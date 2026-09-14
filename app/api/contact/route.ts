import { NextResponse } from "next/server";
import { getSql } from "@/lib/db";
import { notifyEmail, notifyTelegram, type LeadNotification } from "@/lib/notify";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const clip = (v: unknown, n: number) => String(v ?? "").trim().slice(0, n);

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
 * Три независимых получателя: Neon (таблица leads), Telegram-группа, почта.
 * Запускаются параллельно; ответ ok, если сработал хотя бы один, чтобы
 * заявка не терялась из-за сбоя одного канала. Сбои пишутся в лог Vercel.
 */
export async function POST(req: Request) {
  const ip = (req.headers.get("x-forwarded-for") ?? "local").split(",")[0].trim();
  if (rateLimited(ip)) {
    return NextResponse.json({ ok: false, error: "rate" }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad_json" }, { status: 400 });
  }

  const b = (body ?? {}) as Record<string, unknown>;

  // honeypot
  if (String(b.company ?? "")) return NextResponse.json({ ok: true });

  const name = clip(b.name, 120);
  const contact = clip(b.contact, 200);
  if (!name || !contact) {
    return NextResponse.json({ ok: false, error: "required" }, { status: 422 });
  }

  const payload = {
    service: clip(b.service, 120),
    contact,
    niche: clip(b.niche, 200),
    revenue: clip(b.revenue, 120),
    comment: clip(b.comment, 4000),
    page: clip(b.page, 300),
    locale: clip(b.locale, 5),
  };
  const email = EMAIL_RE.test(contact) ? contact.toLowerCase() : null;
  const lead: LeadNotification = { name, ...payload };

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
