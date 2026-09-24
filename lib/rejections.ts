import { getSql } from "@/lib/db";

/**
 * Журнал отклонённых отправок формы: причина, IP, User-Agent, Referer
 * и содержимое полей. Нужен для статистики по ботам и как страховка от
 * ложных срабатываний: контакт живого человека, споткнувшегося о проверку,
 * остаётся здесь. Хранится 30 дней, старое чистится при каждой записи.
 * Всё best-effort: ошибка журнала никогда не меняет ответ формы.
 */
export type RejectReason =
  | "origin"
  | "rate"
  | "bad_json"
  | "honeypot"
  | "token_missing"
  | "token_invalid"
  | "token_too_fast"
  | "token_expired"
  | "trapped"
  | "turnstile"
  | "invalid_fields";

export const REJECT_LABELS: Record<RejectReason, string> = {
  origin: "чужой Origin",
  rate: "лимит запросов",
  bad_json: "битый запрос",
  honeypot: "honeypot",
  token_missing: "нет метки времени",
  token_invalid: "подделана метка времени",
  token_too_fast: "слишком быстро",
  token_expired: "метка устарела",
  trapped: "IP из ловушки",
  turnstile: "Turnstile не пройден",
  invalid_fields: "невалидные поля",
};

const RETENTION = "30 days";
const clip = (v: unknown, n: number) => String(v ?? "").trim().slice(0, n);

/** Снимок полей формы для журнала: только известные ключи, без токенов. */
export function rejectionPayload(b: Record<string, unknown> | null) {
  if (!b) return null;
  const out: Record<string, string> = {};
  for (const [key, max] of [
    ["name", 120], ["phone", 40], ["contact", 200], ["service", 120], ["niche", 200],
    ["revenue", 120], ["comment", 1000], ["page", 300], ["locale", 5], ["company", 200],
  ] as const) {
    const v = clip(b[key], max);
    if (v) out[key] = v;
  }
  return out;
}

export async function recordRejection(
  req: Request,
  reason: RejectReason,
  payload: Record<string, string> | null,
  detail?: string,
): Promise<void> {
  try {
    const sql = getSql();
    const ip = (req.headers.get("x-forwarded-for") ?? req.headers.get("x-real-ip") ?? "local")
      .split(",")[0]
      .trim();
    await sql`
      INSERT INTO rejected_submissions (reason, detail, ip, user_agent, referer, payload)
      VALUES (${reason}, ${detail ?? null}, ${ip}, ${clip(req.headers.get("user-agent"), 300)},
              ${clip(req.headers.get("referer"), 500)}, ${payload ? JSON.stringify(payload) : null}::jsonb)
    `;
    await sql`DELETE FROM rejected_submissions WHERE created_at < now() - ${RETENTION}::interval`;
  } catch (e) {
    console.error("rejection log failed:", e);
  }
}
