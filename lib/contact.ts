/**
 * Поле «Email или Telegram» в форме заявки: одна и та же проверка
 * в браузере и на сервере. Принимаем email или логин Telegram
 * (@username, username, t.me/username), остальное отклоняем.
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
// Правила Telegram: 5-32 символа, латиница, цифры и «_», первый символ - буква.
const TG_USERNAME_RE = /^[A-Za-z][A-Za-z0-9_]{4,31}$/;
const TG_LINK_RE = /^(?:https?:\/\/)?(?:t\.me|telegram\.me|telegram\.dog)\/@?([A-Za-z0-9_]+)\/?$/i;

export type ContactKind = "email" | "telegram";
export type NormalizedContact = { kind: ContactKind; value: string };

/** Нормализованный контакт (email в нижнем регистре или @username) или null. */
export function normalizeContact(raw: string): NormalizedContact | null {
  const value = raw.trim();
  if (!value) return null;

  if (EMAIL_RE.test(value)) return { kind: "email", value: value.toLowerCase() };

  const link = value.match(TG_LINK_RE);
  const username = link ? link[1] : value.replace(/^@/, "");
  if (TG_USERNAME_RE.test(username)) return { kind: "telegram", value: `@${username}` };

  return null;
}
