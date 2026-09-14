import { AsYouType, parsePhoneNumberFromString, type CountryCode } from "libphonenumber-js/min";
import metadata from "libphonenumber-js/min/metadata";

/**
 * Телефон в форме заявки. Маска международная: номер с «+» форматируется
 * по правилам своей страны, без «+» считается местным (Казахстан).
 * Работает и в браузере (маска), и на сервере (валидация).
 */
const DEFAULT_COUNTRY: CountryCode = "KZ";

export type { CountryCode };

/** Страны по коду набора из метаданных, первая - основная: «1» -> [US, ...], «44» -> [GB, ...]. */
function countriesForCallingCode(code: string): CountryCode[] {
  const map = (metadata as { country_calling_codes: Record<string, CountryCode[]> })
    .country_calling_codes;
  return map[code] ?? [];
}

/**
 * Страна для флага по текущему вводу. Пока номер не определился точно,
 * берём основную страну кода набора (для «+7» - Казахстан, а не Россия,
 * пока не набрана следующая цифра). Пустое поле - страна по умолчанию,
 * «+» без цифр - неизвестно.
 */
export function detectPhoneCountry(value: string): CountryCode | undefined {
  const t = new AsYouType(DEFAULT_COUNTRY);
  t.input(value);
  const exact = t.getCountry();
  if (exact) return exact;
  const code = t.getCallingCode();
  if (!code) return value.trim().startsWith("+") ? undefined : DEFAULT_COUNTRY;
  const list = countriesForCallingCode(code);
  return list.includes(DEFAULT_COUNTRY) ? DEFAULT_COUNTRY : list[0];
}

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
