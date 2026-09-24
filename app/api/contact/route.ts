import { NextResponse } from "next/server";
import { getSql } from "@/lib/db";
import { notifyEmail, notifyTelegram } from "@/lib/notify";
import type { LeadNotification } from "@/lib/lead-fields";
import { normalizeContact } from "@/lib/contact";
import { formatPhoneDisplay, normalizePhone } from "@/lib/phone";
import { verifyTurnstile } from "@/lib/turnstile";
import { verifyFormToken } from "@/lib/form-token";
import { clientIp, isTrapped } from "@/lib/bot-traps";
import { recordRejection, rejectionPayload, type RejectReason } from "@/lib/rejections";

const clip = (v: unknown, n: number) => String(v ?? "").trim().slice(0, n);

/**
 * Форму отправляет только браузер с нашего сайта: у fetch-POST всегда есть
 * Origin. Чужой или отсутствующий Origin отсекает примитивные скрипты
 * (настоящая защита от ботов - Turnstile ниже).
 */
function originAllowed(origin: string | null) {
  if (!origin) return false;
  try {
    const host = new URL(origin).hostname;
    return (
      host === "bankai.agency" ||
      host.endsWith(".bankai.agency") ||
      host.endsWith(".vercel.app") ||
      host === "localhost"
    );
  } catch {
    return false;
  }
}

/* Лёгкий best-effort рейт-лимит в памяти инстанса (на serverless не строгий). */
const hits = new Map<string, number[]>();
function rateLimited(ip: string, max = 5, windowMs = 600_000) {
  const now = Date.now();
  const arr = (hits.get(ip) ?? []).filter((t) => now - t < windowMs);
  arr.push(now);
  hits.set(ip, arr);
  return arr.length > max;
}

/**
 * Приём заявки из основной контакт-формы.
 * Три независимых получателя: Neon (таблица leads), Telegram-группа
 * и почта через Resend. Запускаются параллельно; ответ ok, если сработал
 * хотя бы один, чтобы заявка не терялась из-за сбоя одного канала.
 * Сбои пишутся в лог Vercel как `contact <канал> failed`.
 */
export async function POST(req: Request) {
  // Тело читаем первым: даже отклонённая попытка попадает в журнал вместе
  // с содержимым полей (lib/rejections.ts).
  let body: unknown = null;
  let badJson = false;
  try {
    body = await req.json();
  } catch {
    badJson = true;
  }
  const b = (body && typeof body === "object" ? body : {}) as Record<string, unknown>;
  const snapshot = rejectionPayload(badJson ? null : b);

  /** Отказ: пишем в журнал отклонённых и отвечаем клиенту. */
  const reject = async (reason: RejectReason, status: number, error: string, detail?: string) => {
    console.warn(`contact rejected: ${reason}`, detail ?? "");
    await recordRejection(req, reason, snapshot, detail);
    return NextResponse.json({ ok: false, error }, { status });
  };

  if (!originAllowed(req.headers.get("origin"))) {
    return reject("origin", 403, "origin", req.headers.get("origin") ?? "no origin");
  }

  const ip = clientIp(req);
  if (rateLimited(ip)) return reject("rate", 429, "rate");
  if (badJson) return reject("bad_json", 400, "bad_json");

  // honeypot: боту отвечаем «ок», чтобы он не искал обход, но попытку записываем
  if (String(b.company ?? "")) {
    console.warn("contact rejected: honeypot");
    await recordRejection(req, "honeypot", snapshot);
    return NextResponse.json({ ok: true });
  }

  // Время заполнения: метка выдачи формы подписана сервером, заявка раньше
  // чем через MIN_FILL_MS после выдачи - бот. Без метки - тоже.
  const timing = verifyFormToken(b.formToken);
  if (!timing.ok) {
    const secs = timing.ageMs !== undefined ? `${(timing.ageMs / 1000).toFixed(1)} с` : undefined;
    return reject(`token_${timing.reason}`, 403, "bot", secs);
  }

  // IP, сходивший по невидимой ссылке-ловушке /trap за последние часы.
  if (await isTrapped(ip)) return reject("trapped", 403, "bot");

  // Turnstile: включён, когда задан секрет. Токен обязателен и должен пройти
  // проверку; если сам Cloudflare недоступен, заявку пропускаем, чтобы не
  // терять живых клиентов из-за чужого сбоя (факт пишется в лог).
  const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;
  if (turnstileSecret) {
    const verdict = await verifyTurnstile(turnstileSecret, clip(b.turnstileToken, 2048), ip);
    if (verdict === "rejected") return reject("turnstile", 403, "bot");
    if (verdict === "unavailable") console.error("turnstile unavailable, lead accepted");
  }

  const name = clip(b.name, 120);
  const phone = normalizePhone(clip(b.phone, 40));
  const contact = normalizeContact(clip(b.contact, 200));
  if (!name || !phone || !contact) {
    const missing = [!name && "name", !phone && "phone", !contact && "contact"].filter(Boolean).join(",");
    return reject("invalid_fields", 422, "required", missing);
  }

  // Атрибуция источника из lib/attribution: собрана браузером, поэтому
  // берём только известные ключи и режем длину; пустые значения выбрасываем.
  const rawAttr = (b.attribution ?? {}) as Record<string, unknown>;
  const attribution = Object.fromEntries(
    (
      [
        ["lead_source", 120],
        ["lead_medium", 120],
        ["lead_campaign", 200],
        ["lead_term", 200],
        ["lead_content", 200],
        ["click_id", 300],
        ["first_source", 120],
        ["first_medium", 120],
        ["first_campaign", 200],
        ["landing_page", 300],
        ["referrer", 500],
      ] as const
    )
      .map(([key, max]) => [key, clip(rawAttr[key], max)])
      .filter(([, v]) => v),
  ) as Record<string, string>;

  const payload = {
    service: clip(b.service, 120),
    phone,
    contact: contact.value,
    niche: clip(b.niche, 200),
    revenue: clip(b.revenue, 120),
    comment: clip(b.comment, 4000),
    page: clip(b.page, 300),
    locale: clip(b.locale, 5),
    attribution,
  };
  const email = contact.kind === "email" ? contact.value : null;

  // Однострочная сводка источника для Telegram и почты:
  // "google / cpc / brand-kz (первый визит: instagram / social)".
  const line = (s?: string, m?: string, c?: string) =>
    [s, m, c].filter(Boolean).join(" / ");
  const lastLine = line(attribution.lead_source, attribution.lead_medium, attribution.lead_campaign);
  const firstLine = line(attribution.first_source, attribution.first_medium, attribution.first_campaign);
  const traffic =
    lastLine && firstLine && firstLine !== lastLine
      ? `${lastLine} (первый визит: ${firstLine})`
      : lastLine || firstLine;

  const lead: LeadNotification = {
    name,
    ...payload,
    phone: formatPhoneDisplay(phone),
    traffic,
  };

  const insert = async () => {
    const sql = getSql();
    const ua = (req.headers.get("user-agent") ?? "").slice(0, 300);
    await sql`
      INSERT INTO leads (email, name, source, payload, user_agent)
      VALUES (${email}, ${name}, ${"contact-form"}, ${JSON.stringify(payload)}::jsonb, ${ua})
    `;
  };

  const results = await Promise.allSettled([
    insert(),
    notifyTelegram(lead),
    notifyEmail(lead),
  ]);
  const labels = ["db", "telegram", "email"] as const;
  const failed = labels.filter((_, i) => results[i].status === "rejected");
  results.forEach((r, i) => {
    if (r.status === "rejected") {
      console.error(`contact ${labels[i]} failed:`, r.reason);
    }
  });

  if (failed.length === results.length) {
    return NextResponse.json({ ok: false, error: "server" }, { status: 500 });
  }
  return NextResponse.json({ ok: true, failed });
}
