import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Метка времени выдачи формы, подписанная HMAC. Сервер выдаёт её при
 * рендере страницы контактов, форма возвращает с заявкой, роут проверяет
 * подпись и возраст: заявка, отправленная быстрее MIN_FILL_MS после выдачи,
 * считается ботом (человек столько не печатает). Подделать метку без
 * секрета нельзя, а старую можно переиспользовать только с того же IP,
 * пока действует лимит запросов.
 *
 * Секрет: FORM_TOKEN_SECRET, а без него - уже заданные TURNSTILE_SECRET_KEY
 * или ADMIN_PASSWORD, чтобы защита работала без новой настройки.
 */
export const MIN_FILL_MS = 3000;
const MAX_AGE_MS = 7 * 24 * 3600 * 1000;

function secret(): string {
  return (
    process.env.FORM_TOKEN_SECRET ||
    process.env.TURNSTILE_SECRET_KEY ||
    process.env.ADMIN_PASSWORD ||
    "dev-form-token-secret"
  );
}

function sign(issuedAt: string): string {
  return createHmac("sha256", secret()).update(issuedAt).digest("base64url");
}

/** Токен формы: `<issuedAtMs>.<подпись>`. Вызывать на сервере при рендере. */
export function issueFormToken(now = Date.now()): string {
  const issuedAt = String(now);
  return `${issuedAt}.${sign(issuedAt)}`;
}

export type FormTokenVerdict =
  | { ok: true; ageMs: number }
  | { ok: false; reason: "missing" | "invalid" | "too_fast" | "expired"; ageMs?: number };

export function verifyFormToken(token: unknown, now = Date.now()): FormTokenVerdict {
  if (typeof token !== "string" || !token) return { ok: false, reason: "missing" };
  const dot = token.indexOf(".");
  if (dot <= 0) return { ok: false, reason: "invalid" };
  const issuedAt = token.slice(0, dot);
  const given = token.slice(dot + 1);
  if (!/^\d{10,16}$/.test(issuedAt)) return { ok: false, reason: "invalid" };
  const expected = sign(issuedAt);
  const a = Buffer.from(given);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return { ok: false, reason: "invalid" };
  const ageMs = now - Number(issuedAt);
  if (ageMs < MIN_FILL_MS) return { ok: false, reason: "too_fast", ageMs };
  if (ageMs > MAX_AGE_MS) return { ok: false, reason: "expired", ageMs };
  return { ok: true, ageMs };
}
