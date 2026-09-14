import { filledFields, type LeadNotification } from "@/lib/lead-fields";

/**
 * Серверные уведомления о новой заявке. Секреты только в env:
 *   TELEGRAM_BOT_TOKEN - токен бота от @BotFather
 *   TELEGRAM_CHAT_ID   - id группы/чата (для групп отрицательный)
 *   RESEND_API_KEY     - ключ Resend (https://resend.com/api-keys)
 *   LEAD_EMAIL_FROM    - отправитель, домен должен быть подтверждён в Resend
 *   LEAD_EMAIL_TO      - получатели через запятую
 */

const TIMEOUT_MS = 8000;
const DEFAULT_EMAIL_FROM = "Bankai Agency <leads@bankai.agency>";
const DEFAULT_EMAIL_TO = "agency.bankai@gmail.com";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

async function readDetail(res: Response) {
  try {
    return (await res.text()).slice(0, 300);
  } catch {
    return "";
  }
}

/** Сообщение в Telegram-группу через Bot API. Бросает при любой ошибке. */
export async function notifyTelegram(lead: LeadNotification): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    throw new Error("TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID not set");
  }

  const text =
    "🔥 <b>Новая заявка с сайта bankai.agency</b>\n\n" +
    filledFields(lead)
      .map(([label, v]) => `<b>${label}:</b> ${escapeHtml(v)}`)
      .join("\n");

  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: "HTML",
      disable_web_page_preview: true,
    }),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!res.ok) {
    throw new Error(`Telegram ${res.status}: ${await readDetail(res)}`);
  }
}

/**
 * Письмо через Resend (REST API, без SDK). Если контакт лида похож
 * на email, он подставляется в Reply-To, чтобы отвечать прямо из почты.
 */
export async function notifyEmail(lead: LeadNotification): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY not set");

  const from = process.env.LEAD_EMAIL_FROM || DEFAULT_EMAIL_FROM;
  const to = (process.env.LEAD_EMAIL_TO || DEFAULT_EMAIL_TO)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const fields = filledFields(lead);
  const subject =
    `Новая заявка с сайта: ${lead.name}` +
    (lead.service ? ` | ${lead.service}` : "");
  const text = fields.map(([label, v]) => `${label}: ${v}`).join("\n");
  const html =
    `<h2 style="margin:0 0 16px;font:600 18px/1.3 sans-serif">Новая заявка с сайта bankai.agency</h2>` +
    `<table style="border-collapse:collapse;font:14px/1.5 sans-serif">` +
    fields
      .map(
        ([label, v]) =>
          `<tr><td style="padding:4px 12px 4px 0;color:#6b7280;white-space:nowrap;vertical-align:top">${escapeHtml(label)}</td>` +
          `<td style="padding:4px 0;white-space:pre-wrap">${escapeHtml(v)}</td></tr>`,
      )
      .join("") +
    `</table>`;
  const replyTo = EMAIL_RE.test(lead.contact.trim()) ? lead.contact.trim() : undefined;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to, subject, text, html, reply_to: replyTo }),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!res.ok) {
    throw new Error(`Resend ${res.status}: ${await readDetail(res)}`);
  }
}
