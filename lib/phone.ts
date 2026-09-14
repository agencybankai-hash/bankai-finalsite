import { AsYouType, parsePhoneNumberFromString } from "libphonenumber-js/min";

/**
 * Телефон в форме заявки. Маска международная: номер с «+» форматируется
 * по правилам своей страны, без «+» считается местным (Казахстан).
 * Работает и в браузере (маска), и на сервере (валидация).
 */
const DEFAULT_COUNTRY = "KZ";

const digitsOf = (s: string) => s.replace(/\D/g, "");

/** Значение поля после ввода: форматируем «на лету». */
export function formatPhoneInput(prev: string, next: string): string {
  // Стёрли символ форматирования (пробел, скобку): убираем и цифру перед ним,
  // иначе форматтер вернёт символ обратно и поле «залипнет».
  let raw = next;
  if (next.length < prev.length && digitsOf(next) === digitsOf(prev)) {
    raw = next.slice(0, -1);
  }
  const cleaned = raw.replace(/[^\d+]/g, "").replace(/(?!^)\+/g, "");
  if (!cleaned) return "";
  return new AsYouType(DEFAULT_COUNTRY).input(cleaned);
}

/** Валидный номер в формате E.164 (+77771234567) или null. */
export function normalizePhone(value: string): string | null {
  const parsed = parsePhoneNumberFromString(value.trim(), DEFAULT_COUNTRY);
  return parsed?.isValid() ? parsed.number : null;
}

/** Человекочитаемый вид для уведомлений: +7 777 123 4567. */
export function formatPhoneDisplay(e164: string): string {
  return parsePhoneNumberFromString(e164)?.formatInternational() ?? e164;
}
