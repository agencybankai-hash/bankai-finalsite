import type { NextRequest } from "next/server";
import { getSql } from "@/lib/db";

/**
 * Источники заходов и ежедневный отчёт о подозрительных.
 *
 * proxy.ts на каждую загрузку страницы (не RSC-запрос, не префетч) добавляет
 * строку «день по Алматы + источник» в referrer_daily. Источник - хост
 * внешнего реферера, DIRECT (набрали адрес, закладка, приложение) или HIDDEN
 * (переход с чужого сайта, который скрыл реферер). Бот-редиректоры вроде
 * kzvoevoda.top умеют и менять домен, и прятать реферер, поэтому cron
 * /api/cron/referrers раз в день присылает в Telegram новые домены-источники
 * и всплески прямых и скрытых заходов. Таблицы создаёт scripts/migrate.mjs.
 */

export const DIRECT = "(direct)";
export const HIDDEN = "(hidden)";

/** Новый домен попадает в отчёт, если за вчера с него столько заходов. */
const NEW_HOST_MIN_HITS = 3;
/** «Новый» - впервые виден не раньше, чем столько дней назад. */
const NEW_HOST_WINDOW_DAYS = 7;
/** Всплеск: вчера не меньше чем в SPIKE_RATIO раз выше медианы и на SPIKE_MIN_GROWTH больше. */
const SPIKE_RATIO = 2;
const SPIKE_MIN_GROWTH = 15;
const SPIKE_BASELINE_DAYS = 14;
/** Сколько дней истории нужно, чтобы отчёт не шумел на старте. */
const MIN_HISTORY_NEW_HOSTS = 3;
const MIN_HISTORY_SPIKES = 7;
const RETENTION_DAYS = 90;
const MAX_LISTED = 15;

const OWN_HOST = /(^|\.)bankai\.agency$|\.vercel\.app$|^localhost$|^127\.0\.0\.1$|^\[::1\]$/;
/** Считаем только боевой сайт: превью и локальная разработка пишут в ту же базу. */
const PROD_HOST = /^(www\.)?bankai\.agency$/;
/** Поисковики, превью ссылок и мониторинги: не посетители, в счёт не идут. */
const CRAWLER_UA =
  /bot|crawl|spider|slurp|preview|facebookexternalhit|Google-|Mediapartners|WhatsApp|vkShare|Viber|Yandex|YaDirectFetcher|Lighthouse|GTmetrix|Pingdom|uptime/i;
const SKIP_PATH = /^\/(api|admin|checklist|trap)(\/|$)/;
/** Зарезервированные зоны: реальных сайтов там нет, на них удобно тестировать. */
const RESERVED_TLD = /\.(invalid|test|localhost|example)$/;
/** Крупные источники, о которых оповещать незачем. */
const KNOWN_SOURCES = [
  /(^|\.)google\.[a-z.]+$/,
  /^com\.google\.android\./,
  /(^|\.)yandex\.[a-z.]+$/,
  /(^|\.)ya\.ru$/,
  /(^|\.)bing\.com$/,
  /(^|\.)duckduckgo\.com$/,
  /(^|\.)2gis\.[a-z.]+$/,
  /^t\.me$/,
  /(^|\.)telegram\.org$/,
  /^org\.telegram\./,
  /(^|\.)whatsapp\.(com|net)$/,
  /(^|\.)instagram\.com$/,
  /(^|\.)facebook\.com$/,
  /(^|\.)vk\.(com|ru)$/,
  /(^|\.)linkedin\.com$/,
  /(^|\.)youtube\.com$/,
  /(^|\.)tiktok\.com$/,
  /(^|\.)chatgpt\.com$/,
  /(^|\.)openai\.com$/,
  /(^|\.)perplexity\.ai$/,
  /(^|\.)claude\.ai$/,
  /(^|\.)mail\.ru$/,
];

/**
 * Источник загрузки страницы: хост реферера без www, DIRECT, HIDDEN
 * или null, если это не загрузка страницы живым браузером.
 */
export function navigationSource(req: NextRequest): string | null {
  const h = req.headers;
  // Хост из заголовка, а не из nextUrl: локально next dev подставляет в nextUrl localhost.
  const siteHost = (h.get("x-forwarded-host") ?? h.get("host") ?? "").split(":")[0].toLowerCase();
  if (req.method !== "GET" || !PROD_HOST.test(siteHost) || SKIP_PATH.test(req.nextUrl.pathname)) {
    return null;
  }
  const mode = h.get("sec-fetch-mode");
  const isNavigation = mode ? mode === "navigate" : (h.get("accept") ?? "").includes("text/html");
  if (!isNavigation) return null;
  // Префетч и пререндер браузера, клиентские переходы Next - не отдельные заходы.
  if (h.get("rsc") || h.get("next-router-prefetch") || /prefetch/i.test(h.get("sec-purpose") ?? h.get("purpose") ?? "")) {
    return null;
  }
  if (CRAWLER_UA.test(h.get("user-agent") ?? "")) return null;

  const referer = h.get("referer");
  if (referer) {
    let host = "";
    try {
      host = new URL(referer).hostname.toLowerCase();
    } catch {
      return null;
    }
    host = host.replace(/^www\./, "").slice(0, 100);
    return host && !OWN_HOST.test(host) ? host : null;
  }
  const site = h.get("sec-fetch-site");
  if (!site || site === "none") return DIRECT;
  return site === "cross-site" ? HIDDEN : null;
}

/** Плюс один заход с источника за сегодня (по Алматы). Ошибки БД не мешают странице. */
export async function recordReferrer(source: string): Promise<void> {
  try {
    const sql = getSql();
    await sql`
      INSERT INTO referrer_daily (day, host, hits)
      VALUES ((now() AT TIME ZONE 'Asia/Almaty')::date, ${source}, 1)
      ON CONFLICT (day, host) DO UPDATE SET hits = referrer_daily.hits + 1
    `;
  } catch (e) {
    console.error("referrer count failed:", e);
  }
}

type HostRow = { host: string; hits: number; firstDay: string };
type Spike = { bucket: string; hits: number; median: number };

export type ReferrerReport = {
  day: string;
  historyDays: number;
  newHosts: HostRow[];
  spikes: Spike[];
  /** Ключи для referrer_alerts, чтобы не повторять оповещение. */
  keys: string[];
  /** Готовый HTML для Telegram или null, если сообщать нечего. */
  text: string | null;
};

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const ddmm = (iso: string) => `${iso.slice(8, 10)}.${iso.slice(5, 7)}`;
const visits = (n: number) => {
  const m10 = n % 10;
  const m100 = n % 100;
  const word =
    m10 === 1 && m100 !== 11
      ? "заход"
      : m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)
        ? "захода"
        : "заходов";
  return `${n} ${word}`;
};
const median = (xs: number[]) => {
  const s = [...xs].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};

/**
 * Отчёт за вчерашний день по Алматы: новые домены-источники и всплески
 * прямых и скрытых заходов. Для ручной проверки: force снимает защиту
 * от шума на старте, day (YYYY-MM-DD) - отчёт за другой день.
 */
export async function buildReferrerReport({
  force = false,
  day: requestedDay,
}: { force?: boolean; day?: string } = {}): Promise<ReferrerReport> {
  const sql = getSql();
  const dayParam = requestedDay && /^\d{4}-\d{2}-\d{2}$/.test(requestedDay) ? requestedDay : null;
  const [meta] = await sql`
    SELECT COALESCE(${dayParam}::date, (now() AT TIME ZONE 'Asia/Almaty')::date - 1)::text AS day,
           (SELECT count(DISTINCT day) FROM referrer_daily)::int AS history
  `;
  const day = meta.day as string;
  const historyDays = meta.history as number;

  const hostRows = await sql`
    SELECT d.host, d.hits, f.first_day::text AS first_day
    FROM referrer_daily d
    JOIN (SELECT host, min(day) AS first_day FROM referrer_daily GROUP BY host) f USING (host)
    WHERE d.day = ${day}::date
      AND d.host NOT IN (${DIRECT}, ${HIDDEN})
      AND f.first_day >= ${day}::date - ${NEW_HOST_WINDOW_DAYS - 1}::int
      AND NOT EXISTS (SELECT 1 FROM referrer_alerts a WHERE a.key = 'host:' || d.host)
    ORDER BY d.hits DESC
  `;
  const newHosts: HostRow[] =
    force || historyDays >= MIN_HISTORY_NEW_HOSTS
      ? hostRows
          .map((r) => ({ host: r.host as string, hits: r.hits as number, firstDay: r.first_day as string }))
          .filter(
            (r) =>
              r.hits >= NEW_HOST_MIN_HITS &&
              !RESERVED_TLD.test(r.host) &&
              !KNOWN_SOURCES.some((re) => re.test(r.host)),
          )
      : [];

  const bucketRows = await sql`
    SELECT host, day::text AS day, hits FROM referrer_daily
    WHERE host IN (${DIRECT}, ${HIDDEN})
      AND day BETWEEN ${day}::date - ${SPIKE_BASELINE_DAYS}::int AND ${day}::date
  `;
  const alerted = await sql`
    SELECT key FROM referrer_alerts WHERE key IN (${`spike:${DIRECT}:${day}`}, ${`spike:${HIDDEN}:${day}`})
  `;
  const spikes: Spike[] = [];
  if (force || historyDays >= MIN_HISTORY_SPIKES) {
    for (const bucket of [DIRECT, HIDDEN]) {
      if (alerted.some((a) => a.key === `spike:${bucket}:${day}`)) continue;
      const byDay = new Map(
        bucketRows.filter((r) => r.host === bucket).map((r) => [r.day as string, r.hits as number]),
      );
      const hits = byDay.get(day) ?? 0;
      // Дни без строки - ноль заходов, а не пропуск.
      const baseline = Array.from({ length: SPIKE_BASELINE_DAYS }, (_, i) => {
        const d = new Date(`${day}T00:00:00Z`);
        d.setUTCDate(d.getUTCDate() - i - 1);
        return byDay.get(d.toISOString().slice(0, 10)) ?? 0;
      });
      const m = median(baseline);
      if (hits >= m * SPIKE_RATIO && hits - m >= SPIKE_MIN_GROWTH) spikes.push({ bucket, hits, median: m });
    }
  }

  const keys = [
    ...newHosts.map((r) => `host:${r.host}`),
    ...spikes.map((s) => `spike:${s.bucket}:${day}`),
  ];

  let text: string | null = null;
  if (newHosts.length || spikes.length) {
    const lines = [`<b>bankai.agency: подозрительные источники за ${ddmm(day)}</b>`, ""];
    if (newHosts.length) {
      lines.push("Новые домены-источники:");
      for (const r of newHosts.slice(0, MAX_LISTED)) {
        lines.push(`- <code>${esc(r.host)}</code> - ${visits(r.hits)}, впервые ${ddmm(r.firstDay)}`);
      }
      if (newHosts.length > MAX_LISTED) lines.push(`- и ещё ${newHosts.length - MAX_LISTED}`);
      lines.push("");
    }
    for (const s of spikes) {
      const label = s.bucket === DIRECT ? "прямых заходов" : "заходов со скрытым источником";
      lines.push(`Всплеск ${label}: ${s.hits} при обычных ${Math.round(s.median)} в день`);
    }
    if (spikes.length) lines.push("");
    lines.push(
      "Что делать: открыть домен и проверить WHOIS. Пустая страница, свежий домен и скрытый владелец - " +
        "это редиректор: добавить его строкой в content/blocked-referrers.ts и запушить в main. " +
        "Всплеск без домена - смотреть Метрику и Вебвизор за этот день.",
    );
    text = lines.join("\n");
  }

  return { day, historyDays, newHosts, spikes, keys, text };
}

/** Запомнить, о чём уже сообщили, чтобы повторный запуск cron не дублировал. */
export async function markAlerted(keys: string[]): Promise<void> {
  if (!keys.length) return;
  const sql = getSql();
  await sql`INSERT INTO referrer_alerts (key) SELECT unnest(${keys}::text[]) ON CONFLICT DO NOTHING`;
}

export async function pruneReferrers(): Promise<void> {
  const sql = getSql();
  await sql`
    DELETE FROM referrer_daily
    WHERE day < (now() AT TIME ZONE 'Asia/Almaty')::date - ${RETENTION_DAYS}::int
  `;
}
