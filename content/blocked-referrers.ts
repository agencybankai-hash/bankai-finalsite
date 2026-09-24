/**
 * Домены-редиректоры бот-ферм. Любой запрос, у которого Referer указывает
 * на один из них (или на поддомен), получает 403 ещё до рендера страницы
 * (см. proxy.ts), а IP и User-Agent записываются в таблицу bot_traps.
 *
 * Как добавить новый домен: дописать строку и задеплоить (пуш в main).
 * Тот же список стоит держать в правиле Vercel Firewall (см. README):
 * там правка применяется без деплоя.
 */
export const BLOCKED_REFERRERS = [
  "kzvoevoda.top", // с 21.09.2026: 97 визитов за 4 дня, 36,7 % трафика в Метрике
];

/** Хост из Referer совпадает с заблокированным доменом или его поддоменом. */
export function isBlockedReferrer(referer: string | null): string | null {
  if (!referer) return null;
  let host = "";
  try {
    host = new URL(referer).hostname.toLowerCase();
  } catch {
    host = referer.toLowerCase();
  }
  return BLOCKED_REFERRERS.find((d) => host === d || host.endsWith(`.${d}`)) ?? null;
}
