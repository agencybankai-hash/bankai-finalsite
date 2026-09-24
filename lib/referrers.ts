import type { NextRequest } from "next/server";
import { neon } from "@neondatabase/serverless";
import { isSuspiciousHost } from "@/content/blocked-referrers";
import { getSql } from "@/lib/db";

/**
 * Необычные источники заходов и ежедневный отчёт о них.
 *
 * proxy.ts при загрузке страницы живым браузером пишет в referrer_daily
 * «день по Алматы + источник», но только если источник может стать поводом
 * для оповещения: незнакомый домен реферера, домен в подозрительной зоне
 * (content/blocked-referrers.ts) или HIDDEN - переход с чужого сайта, который
 * скрыл реферер. Поисковики, соцсети и прямые заходы не пишем: база Neon на
 * бесплатном тарифе, запись на каждый заход не давала бы ей засыпать и съела бы
 * лимит вычислений, а при его исчерпании перестали бы сохраняться и заявки.
 * Прямые заходы видно в Метрике.
 *
 * Cron /api/cron/referrers раз в день присылает в Telegram новые домены
 * и всплески скрытых заходов. Таблицы создаёт scripts/migrate.mjs.
 */

export const HIDDEN = "(hidden)";

/** Новый домен попадает в отчёт, если с первого появления с него столько заходов. */
const NEW_HOST_MIN_HITS = 3;
/** «Новый» - впервые виден не раньше, чем столько дней назад. */
const NEW_HOST_WINDOW_DAYS = 7;
/** Всплеск скрытых заходов: выше медианы на max(SPIKE_MIN_GROWTH, SPIKE_MIN_SHARE медианы). */
const SPIKE_MIN_GROWTH = 15;
const SPIKE_MIN_SHARE = 0.5;
const SPIKE_BASELINE_DAYS = 14;
/**
 * Защита от шума на старте. Домены, впервые замеченные в первые
 * MIN_HISTORY_NEW_HOSTS полных дней сбора, - это обычные источники, не новые.
 * Всплески считаем, когда в базе есть MIN_HISTORY_SPIKES полных дней.
 */
const MIN_HISTORY_NEW_HOSTS = 3;
const MIN_HISTORY_SPIKES = 7;
const RETENTION_DAYS = 90;
const ALERTS_RETENTION_DAYS = 180;
const MAX_LISTED = 15;
const WRITE_TIMEOUT_MS = 3000;

/** Считаем только боевой сайт: превью и локальная разработка пишут в ту же базу. */
const PROD_HOST = /^bankai\.agency$/;
const OWN_HOST =
  /(^|\.)bankai\.agency$|^bankai-agency(-[a-z0-9-]+)?\.vercel\.app$|^localhost$|^127\.0\.0\.1$|^\[::1\]$/;
/** Поисковики, превью ссылок и мониторинги: не посетители. */
const CRAWLER_UA =
  /bot|crawl|spider|slurp|preview|facebookexternalhit|Google-|Mediapartners|WhatsApp|vkShare|Viber|Yandex|YaDirectFetcher|Lighthouse|GTmetrix|Pingdom|uptime/i;
const SKIP_PATH = /^\/(api|admin|checklist|trap)(\/|$)/;
/** Зарезервированные зоны: реальных сайтов там нет, на них удобно тестировать. */
const RESERVED_TLD = /\.(invalid|test|localhost|example)$/;
/** Крупные источники: не пишем и не сообщаем. */
const KNOWN_SOURCES = [
  /(^|\.)google\.(com?\.)?[a-z]{2,3}$/,
  /^com\.google\.android\.[a-z0-9_]+$/,
  /(^|\.)yandex\.(ru|kz|com|by|uz|net|com\.tr)$/,
  /(^|\.)ya\.ru$/,
  /(^|\.)bing\.com$/,
  /(^|\.)duckduckgo\.com$/,
  /(^|\.)2gis\.(ru|kz|com|ae|uz|kg)$/,
  /^t\.me$/,
  /(^|\.)telegram\.org$/,
  /^org\.telegram\.[a-z0-9_]+$/,
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

/** Хост без порта, точки в конце и www, в нижнем регистре. */
const normalizeHost = (s: string) =>
  s.split(":")[0].toLowerCase().replace(/\.+$/, "").replace(/^www\./, "").slice(0, 100);

/**
 * Источник загрузки страницы, если о нём может понадобиться оповещение:
 * домен реферера (незнакомый или в подозрительной зоне), HIDDEN или null.
 */
export function navigationSource(req: NextRequest): string | null {
  const h = req.headers;
  // Хост из заголовка, а не из nextUrl: локально next dev подставляет в nextUrl localhost.
  const siteHost = normalizeHost(h.get("x-forwarded-host") ?? h.get("host") ?? "");
  if (req.method !== "GET" || !PROD_HOST.test(siteHost) || SKIP_PATH.test(req.nextUrl.pathname)) {
    return null;
  }
  // Только загрузка документа браузером верхнего уровня. Без Sec-Fetch-* приходят
  // сканеры и скрипты (и iOS до 16.4), с dest=iframe - встраивание в чужой сайт.
  if (h.get("sec-fetch-mode") !== "navigate" || h.get("sec-fetch-dest") !== "document") return null;
  // Префетч и пререндер браузера - не отдельный заход.
  if (/prefetch|prerender/i.test(h.get("sec-purpose") ?? h.get("purpose") ?? "")) return null;
  if (CRAWLER_UA.test(h.get("user-agent") ?? "")) return null;

  const referer = h.get("referer");
  if (!referer) return h.get("sec-fetch-site") === "cross-site" ? HIDDEN : null;
  let host = "";
  try {
    host = normalizeHost(new URL(referer).hostname);
  } catch {
    return null;
  }
  if (!host || OWN_HOST.test(host)) return null;
  if (isSuspiciousHost(host)) return host;
  return KNOWN_SOURCES.some((re) => re.test(host)) ? null : host;
}

/** Плюс один заход с источника за сегодня (по Алматы). Ошибки БД не мешают странице. */
export async function recordReferrer(source: string): Promise<void> {
  const url = process.env.DATABASE_URL;
  if (!url) return;
  try {
    // Свой клиент с таймаутом: зависший запрос не должен держать функцию proxy.
    const sql = neon(url, { fetchOptions: { signal: AbortSignal.timeout(WRITE_TIMEOUT_MS) } });
    await sql`
      INSERT INTO referrer_daily (day, host, hits)
      VALUES ((now() AT TIME ZONE 'Asia/Almaty')::date, ${source}, 1)
      ON CONFLICT (day, host) DO UPDATE SET hits = referrer_daily.hits + 1
    `;
  } catch (e) {
    console.error("referrer count failed:", e);
  }
}

/** suspicious - домен в дешёвой зоне из content/blocked-referrers.ts, кандидат в блок. */
type HostRow = { host: string; hits: number; firstDay: string; suspicious: boolean };
type Spike = { hits: number; median: number };

export type ReferrerReport = {
  day: string;
  /** Первый день сбора (неполный) или null, если данных нет. */
  start: string | null;
  newHosts: HostRow[];
  spike: Spike | null;
  /** Ключи для referrer_alerts, чтобы не повторять оповещение. */
  keys: string[];
  /** Готовый HTML для Telegram или null, если сообщать нечего. */
  text: string | null;
};

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const ddmm = (iso: string) => `${iso.slice(8, 10)}.${iso.slice(5, 7)}`;
const addDays = (iso: string, n: number) => {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
};
const median = (xs: number[]) => {
  if (!xs.length) return 0;
  const s = [...xs].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};
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

/** Всплеск: вчера выше медианы полных дней до него на max(15, 50% медианы). */
export function detectSpike(
  byDay: Map<string, number>,
  day: string,
  start: string | null,
  force = false,
): Spike | null {
  const hits = byDay.get(day) ?? 0;
  // База - полные дни после начала сбора; дни до него нулями не заполняем.
  const baselineDays = Array.from({ length: SPIKE_BASELINE_DAYS }, (_, i) => addDays(day, -i - 1)).filter(
    (d) => start !== null && d > start,
  );
  if (!force && baselineDays.length < MIN_HISTORY_SPIKES) return null;
  const m = median(baselineDays.map((d) => byDay.get(d) ?? 0));
  return hits - m >= Math.max(SPIKE_MIN_GROWTH, SPIKE_MIN_SHARE * m) ? { hits, median: m } : null;
}

/** Отчётный день по умолчанию - вчера по Алматы. */
export async function currentReportDay(): Promise<string> {
  const [row] = await getSql()`SELECT ((now() AT TIME ZONE 'Asia/Almaty')::date - 1)::text AS day`;
  return row.day as string;
}

/**
 * Отчёт за день (по умолчанию вчера по Алматы): новые домены-источники
 * и всплеск скрытых заходов. force снимает защиту от шума на старте (для проверки).
 */
export async function buildReferrerReport({
  force = false,
  day: requestedDay,
}: { force?: boolean; day?: string } = {}): Promise<ReferrerReport> {
  const sql = getSql();
  const dayParam = requestedDay && /^\d{4}-\d{2}-\d{2}$/.test(requestedDay) ? requestedDay : null;
  const [meta] = await sql`
    SELECT COALESCE(${dayParam}::date, (now() AT TIME ZONE 'Asia/Almaty')::date - 1)::text AS day,
           (SELECT min(day) FROM referrer_daily)::text AS start
  `;
  const day = meta.day as string;
  const start = (meta.start as string | null) ?? null;

  // Сумма с первого появления по отчётный день: так ловятся и домены с парой
  // заходов в день, и всплеск в день, когда cron не сработал.
  const hostRows = await sql`
    SELECT d.host, sum(d.hits)::int AS hits, min(d.day)::text AS first_day
    FROM referrer_daily d
    WHERE d.host <> ${HIDDEN} AND d.day <= ${day}::date
    GROUP BY d.host
    HAVING min(d.day) >= ${day}::date - ${NEW_HOST_WINDOW_DAYS - 1}::int
       AND NOT EXISTS (SELECT 1 FROM referrer_alerts a WHERE a.key = 'host:' || d.host)
    ORDER BY sum(d.hits) DESC
    LIMIT 100
  `;
  // Домены, впервые замеченные в первые дни сбора, - обычные источники.
  const warmupEnd = start ? addDays(start, MIN_HISTORY_NEW_HOSTS) : null;
  const newHosts: HostRow[] = hostRows
    .map((r) => {
      const host = r.host as string;
      return { host, hits: r.hits as number, firstDay: r.first_day as string, suspicious: isSuspiciousHost(host) };
    })
    .filter((r) => {
      if (RESERVED_TLD.test(r.host)) return false;
      // Подозрительную зону сообщаем с первого захода и без защиты от шума на старте.
      if (r.suspicious) return true;
      if (KNOWN_SOURCES.some((re) => re.test(r.host)) || r.hits < NEW_HOST_MIN_HITS) return false;
      return force || (warmupEnd !== null && r.firstDay > warmupEnd);
    });

  const hiddenRows = await sql`
    SELECT day::text AS day, hits FROM referrer_daily
    WHERE host = ${HIDDEN}
      AND day BETWEEN ${day}::date - ${SPIKE_BASELINE_DAYS}::int AND ${day}::date
      AND NOT EXISTS (SELECT 1 FROM referrer_alerts a WHERE a.key = ${`spike:${HIDDEN}:${day}`})
  `;
  const spike = hiddenRows.length
    ? detectSpike(new Map(hiddenRows.map((r) => [r.day as string, r.hits as number])), day, start, force)
    : null;

  const listed = newHosts.slice(0, MAX_LISTED);
  const keys = [...listed.map((r) => `host:${r.host}`), ...(spike ? [`spike:${HIDDEN}:${day}`] : [])];

  let text: string | null = null;
  if (listed.length || spike) {
    const lines = [`<b>bankai.agency: подозрительные источники за ${ddmm(day)}</b>`, ""];
    if (listed.length) {
      lines.push("Новые домены-источники:");
      for (const r of listed) {
        const zone = r.suspicious
          ? `, зона .${esc(r.host.slice(r.host.lastIndexOf(".") + 1))} - кандидат в блок`
          : "";
        lines.push(`- <code>${esc(r.host)}</code> - ${visits(r.hits)}, впервые ${ddmm(r.firstDay)}${zone}`);
      }
      // Не показанные домены не помечаем: они придут в следующем отчёте.
      if (newHosts.length > MAX_LISTED) lines.push(`- ещё ${newHosts.length - MAX_LISTED} - в следующем отчёте`);
      lines.push("");
    }
    if (spike) {
      lines.push(
        `Всплеск заходов со скрытым источником: ${spike.hits} при обычных ${Math.round(spike.median)} в день`,
        "",
      );
    }
    lines.push(
      "Что делать: открыть домен и проверить WHOIS. Пустая страница, свежий домен и скрытый владелец - " +
        "это редиректор: добавить его строкой в content/blocked-referrers.ts и запушить в main. " +
        "Всплеск без домена - смотреть Метрику и Вебвизор за этот день.",
    );
    text = lines.join("\n");
  }

  return { day, start, newHosts, spike, keys, text };
}

/** Запомнить, о чём уже сообщили, чтобы не повторять. */
export async function markAlerted(keys: string[]): Promise<void> {
  if (!keys.length) return;
  await getSql()`INSERT INTO referrer_alerts (key) SELECT unnest(${keys}::text[]) ON CONFLICT DO NOTHING`;
}

/** Занять запуск за день: false, если cron за этот день уже отработал (повторная доставка). */
export async function claimRun(day: string): Promise<boolean> {
  const rows = await getSql()`
    INSERT INTO referrer_alerts (key) VALUES (${`run:${day}`}) ON CONFLICT DO NOTHING RETURNING key
  `;
  return rows.length > 0;
}

/** Освободить запуск после сбоя, чтобы повторный запуск мог отправить отчёт. */
export async function releaseRun(day: string): Promise<void> {
  await getSql()`DELETE FROM referrer_alerts WHERE key = ${`run:${day}`}`;
}

export async function pruneReferrers(): Promise<void> {
  const sql = getSql();
  await sql`
    DELETE FROM referrer_daily
    WHERE day < (now() AT TIME ZONE 'Asia/Almaty')::date - ${RETENTION_DAYS}::int
  `;
  await sql`DELETE FROM referrer_alerts WHERE alerted_at < now() - ${`${ALERTS_RETENTION_DAYS} days`}::interval`;
}
