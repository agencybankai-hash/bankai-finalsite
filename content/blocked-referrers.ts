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

/**
 * Дешёвые доменные зоны, в которых обычно живут одноразовые редиректоры.
 * Зоны, где есть живые малые бизнесы и наши клиенты (.shop, .online, .site,
 * .store, .app, .rest у ресторанов), сюда не входят. Перед переводом в block
 * выгрузить хосты этих зон из referrer_daily и живые сайты занести в
 * ALLOWED_REFERRERS. Переходы с доменов в этих зонах:
 * - "log": пропускаем, а ежедневное оповещение в Telegram показывает такой
 *   домен с первого же захода как кандидата в блок;
 * - "block": 403 и запись в bot_traps, как для списка выше.
 * Перевести в блок: заменить "log" на "block" и запушить в main.
 * Живой сайт в такой зоне - дописать его в ALLOWED_REFERRERS.
 */
export const SUSPICIOUS_TLDS = [
  "top", "xyz", "icu", "cyou", "sbs", "cfd", "bond",
  "buzz", "click", "quest", "monster", "lol", "mom",
];
export const SUSPICIOUS_TLD_MODE: "log" | "block" = "log";
/** Исключения из SUSPICIOUS_TLDS: домены (с поддоменами), переходы с которых не трогаем. */
export const ALLOWED_REFERRERS: string[] = [];

const matches = (host: string, domain: string) => host === domain || host.endsWith(`.${domain}`);

/** Хост из Referer в нижнем регистре и без точки в конце: «kzvoevoda.top.» - тот же домен. */
function refererHost(referer: string): string {
  let host = referer;
  try {
    host = new URL(referer).hostname;
  } catch {}
  return host.toLowerCase().replace(/\.+$/, "");
}

/** Хост из Referer совпадает с заблокированным доменом или его поддоменом. */
export function isBlockedReferrer(referer: string | null): string | null {
  if (!referer) return null;
  const host = refererHost(referer);
  return BLOCKED_REFERRERS.find((d) => matches(host, d)) ?? null;
}

/** Хост в подозрительной зоне и не в исключениях. */
export function isSuspiciousHost(host: string): boolean {
  const tld = host.slice(host.lastIndexOf(".") + 1);
  return SUSPICIOUS_TLDS.includes(tld) && !ALLOWED_REFERRERS.some((d) => matches(host, d));
}

/** Хост из Referer, если он в подозрительной зоне; иначе null. */
export function suspiciousReferrer(referer: string | null): string | null {
  if (!referer) return null;
  const host = refererHost(referer);
  return isSuspiciousHost(host) ? host : null;
}
