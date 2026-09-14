import {
  AsYouType,
  getCountryCallingCode,
  getExampleNumber,
  isSupportedCountry,
  parsePhoneNumberFromString,
  type CountryCode,
} from "libphonenumber-js/min";
import examples from "libphonenumber-js/mobile/examples";
import metadata from "libphonenumber-js/min/metadata";

/**
 * Телефон в форме заявки. Маска международная: ввод показывается как
 * «+7 777 123 4567» независимо от того, как набирал посетитель.
 * Стартовая страна берётся по IP посетителя (см. lib/geo.ts), по умолчанию
 * Казахстан. Работает и в браузере (маска), и на сервере (валидация).
 */
export const DEFAULT_COUNTRY: CountryCode = "KZ";
export type { CountryCode };

/** Код страны из заголовка/строки; неизвестное значение - страна по умолчанию. */
export function toCountryCode(value: string | null | undefined): CountryCode {
  const c = (value ?? "").trim().toUpperCase();
  return isSupportedCountry(c) ? (c as CountryCode) : DEFAULT_COUNTRY;
}

const digitsOf = (s: string) => s.replace(/\D/g, "");

/** Состояние поля: показанное значение и признак, что «+код» подставлен автоматически. */
export type PhoneInputState = { value: string; auto: boolean };
export const EMPTY_PHONE: PhoneInputState = { value: "", auto: false };

/**
 * Значение поля после ввода: форматируем «на лету».
 * Ввод с «+» - международный как есть. Ввод без «+» библиотека разбирает
 * по правилам стартовой страны (внутренние префиксы «8» в Казахстане
 * и России, «0» в Британии, Германии, Турции и др.; код страны без «+»),
 * а показываем сразу международный вид: «8 777…» -> «+7 777…»,
 * «020…» для британца -> «+44 20…», «921…» для россиянина -> «+7 921…».
 * Признак `auto` помнит, что «+код» подставили мы: при следующем вводе
 * его снимаем и разбираем заново то, что реально набрал человек, иначе
 * «7 777 123 45 67» без «+» превратилось бы в «+7 7777…».
 */
export function formatPhoneInput(
  prev: PhoneInputState,
  next: string,
  country: CountryCode = DEFAULT_COUNTRY,
): PhoneInputState {
  // Стёрли символ форматирования (пробел, скобку): убираем и цифру перед ним,
  // иначе форматтер вернёт символ обратно и поле «залипнет».
  let raw = next;
  if (next.length < prev.value.length && digitsOf(next) === digitsOf(prev.value)) {
    raw = next.slice(0, -1);
  }
  let cleaned = raw.replace(/[^\d+]/g, "").replace(/(?!^)\+/g, "");
  if (!cleaned) return EMPTY_PHONE;
  if (cleaned === "+") return { value: "+", auto: false };

  const cc = getCountryCallingCode(country);
  if (prev.auto && cleaned.startsWith(`+${cc}`)) {
    // Наш авто-префикс на месте: восстанавливаем набранные цифры без него.
    cleaned = cleaned.slice(cc.length + 1);
    if (!cleaned) return EMPTY_PHONE;
  }

  if (!cleaned.startsWith("+")) {
    const national = new AsYouType(country);
    national.input(cleaned);
    const value = national.getNumberValue();
    const intl = value && value.length > 1 ? value : `+${cc}${cleaned}`;
    return { value: new AsYouType(country).input(intl), auto: true };
  }
  return { value: new AsYouType(country).input(cleaned), auto: false };
}

/** Валидный номер в формате E.164 (+77771234567) или null. */
export function normalizePhone(value: string, country: CountryCode = DEFAULT_COUNTRY): string | null {
  const parsed = parsePhoneNumberFromString(value.trim(), country);
  return parsed?.isValid() ? parsed.number : null;
}

/** Человекочитаемый вид для уведомлений: +7 777 123 4567. */
export function formatPhoneDisplay(e164: string): string {
  return parsePhoneNumberFromString(e164)?.formatInternational() ?? e164;
}

/** Страны по коду набора из метаданных, первая - основная: «1» -> [US, ...], «44» -> [GB, ...]. */
function countriesForCallingCode(code: string): CountryCode[] {
  const map = (metadata as { country_calling_codes: Record<string, CountryCode[]> })
    .country_calling_codes;
  return map[code] ?? [];
}

/**
 * Страна для флага по текущему вводу. Пока номер не определился точно,
 * берём основную страну кода набора, предпочитая стартовую (для «+7»
 * у казахстанца - Казахстан, пока не набрана следующая цифра).
 * Пустое поле - стартовая страна, «+» без цифр - неизвестно.
 */
export function detectPhoneCountry(value: string, country: CountryCode = DEFAULT_COUNTRY): CountryCode | undefined {
  const t = new AsYouType(country);
  t.input(value);
  const exact = t.getCountry();
  if (exact) return exact;
  const code = t.getCallingCode();
  if (!code) return value.trim().startsWith("+") ? undefined : country;
  const list = countriesForCallingCode(code);
  return list.includes(country) ? country : list[0];
}

/** Пример номера страны для плейсхолдера: «+7 771 000 9998», «+44 7400 123456». */
export function phonePlaceholder(country: CountryCode, fallback = "+7 777 123 4567"): string {
  return getExampleNumber(country, examples)?.formatInternational() ?? fallback;
}
