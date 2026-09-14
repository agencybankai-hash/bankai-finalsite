/**
 * Уведомления о новой заявке с сайта: Telegram-группа и почта.
 *
 * Оба канала best-effort: ошибка одного не мешает другому и не ломает
 * запись в БД (см. app/api/contact/route.ts). Секреты только в env:
 *   TELEGRAM_BOT_TOKEN - токен бота от @BotFather
 *   TELEGRAM_CHAT_ID   - id группы/чата (для групп отрицательный)
 *   LEAD_EMAIL_TO      - адрес для писем (необязательно, по умолчанию ниже)
 */

export type LeadNotification = {
  name: string;
  contact: string;
  service?: string;
  niche?: string;
  revenue?: string;
  comment?: string;
  page?: string;
  locale?: string;
};

const DEFAULT_EMAIL_TO = "agency.bankai@gmail.com";
// FormSubmit принимает запросы только «с веб-страницы»: проверяет Origin/Referer.
const SITE_ORIGIN = "https://bankai.agency";
const TIMEOUT_MS = 8000;

// Подписи полей в уведомлениях.   - неразрывный пробел после предлога.
const FIELDS: Array<[keyof LeadNotification, string]> = [
  ["name", "Имя"],
  ["contact", "Контакт"],
  ["service", "Услуга"],
  ["niche", "Ниша"],
  ["revenue", "Оборот в месяц"],
  ["comment", "Комментарий"],
  ["page", "Страница"],
  ["locale", "Язык"],
];

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Только заполненные поля, в порядке FIELDS. */
function filledFields(lead: LeadNotification): Array<[string, string]> {
  return FIELDS.flatMap(([key, label]) => {
    const v = String(lead[key] ?? "").trim();
    return v ? [[label, v] as [string, string]] : [];
  });
}

async function readBody(res: Response) {
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
    throw new Error(`Telegram ${res.status}: ${await readBody(res)}`);
  }
}

/**
 * Письмо через FormSubmit (formsubmit.co/ajax). Адрес должен быть один раз
 * активирован на formsubmit.co, иначе сервис отвечает success:false.
 */
export async function notifyEmail(lead: LeadNotification): Promise<void> {
  const to = process.env.LEAD_EMAIL_TO || DEFAULT_EMAIL_TO;
  const subject =
    `Новая заявка с сайта: ${lead.name}` +
    (lead.service ? ` | ${lead.service}` : "");

  const res = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(to)}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Origin: SITE_ORIGIN,
      Referer: `${SITE_ORIGIN}/contacts`,
    },
    body: JSON.stringify({
      _subject: subject,
      _template: "table",
      ...Object.fromEntries(filledFields(lead)),
    }),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });

  const body = await readBody(res);
  let success = false;
  try {
    const j = JSON.parse(body) as { success?: boolean | string };
    success = j.success === true || j.success === "true";
  } catch {}
  if (!res.ok || !success) {
    throw new Error(`FormSubmit ${res.status}: ${body}`);
  }
}
