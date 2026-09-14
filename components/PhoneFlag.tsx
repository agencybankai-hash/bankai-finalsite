import type { CountryCode } from "@/lib/phone";

/**
 * Флаг страны внутри поля телефона. SVG из country-flag-icons лежат
 * в public/flags (копируются скриптом перед dev/build). Без страны - глобус.
 */
export function PhoneFlag({ country, locale }: { country?: CountryCode; locale: string }) {
  if (!country) {
    return (
      <svg
        viewBox="0 0 20 20"
        width={20}
        height={20}
        aria-hidden
        className="text-muted"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <circle cx="10" cy="10" r="7.5" />
        <path d="M2.5 10h15M10 2.5c2.5 2.5 2.5 12.5 0 15M10 2.5c-2.5 2.5-2.5 12.5 0 15" />
      </svg>
    );
  }
  let name = country;
  try {
    name = (new Intl.DisplayNames([locale], { type: "region" }).of(country) ?? country) as CountryCode;
  } catch {}
  return (
    // eslint-disable-next-line @next/next/no-img-element -- статичный svg из public, оптимизация не нужна
    <img
      src={`/flags/${country}.svg`}
      alt={name}
      title={name}
      width={20}
      height={15}
      className="h-[15px] w-5 rounded-[2px] shadow-[0_0_0_1px_rgba(0,0,0,0.08)]"
    />
  );
}
