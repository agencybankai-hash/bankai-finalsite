/**
 * Серверная проверка токена Cloudflare Turnstile (защита формы от ботов).
 * Включается, когда задан TURNSTILE_SECRET_KEY; сайт-ключ для виджета
 * лежит в NEXT_PUBLIC_TURNSTILE_SITE_KEY. Ключи: https://dash.cloudflare.com → Turnstile.
 * Тестовые ключи Cloudflare (всегда проходят): site 1x00000000000000000000AA,
 * secret 1x0000000000000000000000000000000AA.
 */

const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const TIMEOUT_MS = 8000;

export type TurnstileResult = "ok" | "rejected" | "unavailable";

/** Проверка токена. `unavailable` - Cloudflare не ответил, решение за вызывающим. */
export async function verifyTurnstile(
  secret: string,
  token: string,
  ip: string,
): Promise<TurnstileResult> {
  if (!token) return "rejected";
  try {
    const body = new URLSearchParams({ secret, response: token });
    if (ip && ip !== "local") body.set("remoteip", ip);
    const res = await fetch(VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!res.ok) return "unavailable";
    const data = (await res.json()) as { success?: boolean; "error-codes"?: string[] };
    if (data.success) return "ok";
    const codes = data["error-codes"] ?? [];
    // Ошибки на стороне Cloudflare, а не токена: не наказываем посетителя.
    if (codes.includes("internal-error")) return "unavailable";
    return "rejected";
  } catch (e) {
    console.error("turnstile verify failed:", e);
    return "unavailable";
  }
}
