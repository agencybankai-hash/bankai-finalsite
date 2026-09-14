import { headers } from "next/headers";
import { toCountryCode, type CountryCode } from "@/lib/phone";

/**
 * Страна посетителя по IP: Vercel кладёт её в заголовок x-vercel-ip-country
 * (ISO 3166-1 alpha-2). Локально заголовка нет - страна по умолчанию.
 * Используется как стартовая страна поля телефона.
 */
export async function visitorCountry(): Promise<CountryCode> {
  const h = await headers();
  return toCountryCode(h.get("x-vercel-ip-country"));
}
