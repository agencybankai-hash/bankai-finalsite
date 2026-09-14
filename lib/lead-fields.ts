/** Общее для сервера и браузера: форма заявки и подписи полей в уведомлениях. */

export type LeadNotification = {
  name: string;
  phone: string;
  /** Email или @username Telegram. */
  contact: string;
  service?: string;
  niche?: string;
  revenue?: string;
  comment?: string;
  page?: string;
  locale?: string;
};

// Подписи полей в уведомлениях.   - неразрывный пробел после предлога.
const FIELDS: Array<[keyof LeadNotification, string]> = [
  ["name", "Имя"],
  ["phone", "Телефон"],
  ["contact", "Email / Telegram"],
  ["service", "Услуга"],
  ["niche", "Ниша"],
  ["revenue", "Оборот в месяц"],
  ["comment", "Комментарий"],
  ["page", "Страница"],
  ["locale", "Язык"],
];

/** Только заполненные поля, в порядке FIELDS. */
export function filledFields(lead: LeadNotification): Array<[string, string]> {
  return FIELDS.flatMap(([key, label]) => {
    const v = String(lead[key] ?? "").trim();
    return v ? [[label, v] as [string, string]] : [];
  });
}
