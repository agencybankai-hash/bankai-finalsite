/**
 * Атрибуция источника посетителя: откуда пришёл человек, который оставил
 * заявку. Пишем два «касания» в localStorage:
 *   - first touch - самый первый визит (живёт 90 дней), не перезаписывается;
 *   - last touch  - последний источник с кампанией (30 дней), обновляется
 *     каждым новым небрямым заходом (utm, рекламный клик или внешний реферер).
 * Прямой заход (закладка, набор руками) не затирает сохранённую кампанию -
 * так же считает атрибуцию сама GA4.
 * Только клиент: на сервере все функции тихо возвращают пустоту.
 */

type Touch = {
  source: string;
  medium: string;
  campaign?: string;
  term?: string;
  content?: string;
  /** Идентификатор рекламного клика (gclid, fbclid, ...), как пришёл в URL. */
  click_id?: string;
  referrer?: string;
  landing_page?: string;
  ts: number;
};

/** Плоский объект для payload заявки и события generate_lead. */
export type Attribution = {
  lead_source: string;
  lead_medium: string;
  lead_campaign?: string;
  lead_term?: string;
  lead_content?: string;
  click_id?: string;
  first_source?: string;
  first_medium?: string;
  first_campaign?: string;
  landing_page?: string;
  referrer?: string;
};

const FIRST_KEY = "bnk_first_touch";
const LAST_KEY = "bnk_last_touch";
const FIRST_TTL = 90 * 24 * 3600 * 1000;
const LAST_TTL = 30 * 24 * 3600 * 1000;

/* localStorage может кидать (приватный режим) - весь ввод-вывод в try/catch,
   при сбое атрибуция теряется молча, форма продолжает работать. */
function read(key: string, ttl: number): Touch | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const t = JSON.parse(raw) as Touch;
    if (!t?.source || Date.now() - t.ts > ttl) return null;
    return t;
  } catch {
    return null;
  }
}

function write(key: string, t: Touch) {
  try {
    localStorage.setItem(key, JSON.stringify(t));
  } catch {}
}

/** Рекламные click id -> источник/канал, когда UTM не проставлены. */
const CLICK_IDS: Array<[param: string, source: string, medium: string]> = [
  ["gclid", "google", "cpc"],
  ["gbraid", "google", "cpc"],
  ["wbraid", "google", "cpc"],
  ["yclid", "yandex", "cpc"],
  ["fbclid", "facebook", "paid-social"],
  ["ttclid", "tiktok", "paid-social"],
  ["msclkid", "bing", "cpc"],
];

/** Известные рефереры -> канал; остальные внешние хосты считаем referral. */
function refererTouch(host: string): Pick<Touch, "source" | "medium"> {
  const h = host.replace(/^www\./, "");
  if (/(^|\.)google\./.test(h)) return { source: "google", medium: "organic" };
  if (/(^|\.)(yandex|ya)\./.test(h)) return { source: "yandex", medium: "organic" };
  if (/(^|\.)bing\.com$/.test(h)) return { source: "bing", medium: "organic" };
  if (/(^|\.)duckduckgo\.com$/.test(h)) return { source: "duckduckgo", medium: "organic" };
  if (/(^|\.)(instagram\.com|facebook\.com|fb\.com)$/.test(h))
    return { source: h.includes("instagram") ? "instagram" : "facebook", medium: "social" };
  if (/(^|\.)(t\.co|x\.com|twitter\.com)$/.test(h)) return { source: "x", medium: "social" };
  if (/(^|\.)linkedin\.com$/.test(h)) return { source: "linkedin", medium: "social" };
  if (/(^|\.)(t\.me|telegram\.(me|org))$/.test(h)) return { source: "telegram", medium: "social" };
  if (/(^|\.)(youtube\.com|youtu\.be)$/.test(h)) return { source: "youtube", medium: "social" };
  return { source: h, medium: "referral" };
}

/** Источник текущего захода; null - прямой заход или внутренний переход. */
function currentTouch(): Touch | null {
  const p = new URLSearchParams(window.location.search);
  const base = {
    landing_page: window.location.pathname,
    referrer: document.referrer || undefined,
    ts: Date.now(),
  };

  const clickId = CLICK_IDS.map(([param, source, medium]) => {
    const v = p.get(param);
    return v ? { param, source, medium, value: v } : null;
  }).find(Boolean);

  const utmSource = p.get("utm_source");
  if (utmSource) {
    return {
      ...base,
      source: utmSource,
      medium: p.get("utm_medium") ?? clickId?.medium ?? "(not set)",
      campaign: p.get("utm_campaign") ?? undefined,
      term: p.get("utm_term") ?? undefined,
      content: p.get("utm_content") ?? undefined,
      click_id: clickId ? `${clickId.param}:${clickId.value}` : undefined,
    };
  }
  if (clickId) {
    return {
      ...base,
      source: clickId.source,
      medium: clickId.medium,
      click_id: `${clickId.param}:${clickId.value}`,
    };
  }

  if (document.referrer) {
    try {
      const ref = new URL(document.referrer);
      if (ref.hostname !== window.location.hostname) {
        return { ...base, ...refererTouch(ref.hostname) };
      }
    } catch {}
  }
  return null;
}

/**
 * Зафиксировать источник текущего визита. Вызывается на каждой загрузке
 * страницы (AttributionTracker); повторные вызовы на внутренних переходах
 * ничего не меняют.
 */
export function captureAttribution() {
  if (typeof window === "undefined") return;
  const touch = currentTouch();
  const first = read(FIRST_KEY, FIRST_TTL);

  if (!first) {
    // Самый первый визит: фиксируем даже прямой заход, чтобы знать landing page.
    write(FIRST_KEY, touch ?? {
      source: "(direct)",
      medium: "(none)",
      landing_page: window.location.pathname,
      referrer: document.referrer || undefined,
      ts: Date.now(),
    });
  }
  if (touch) write(LAST_KEY, touch);
}

/** Атрибуция для заявки: последний небрямой источник, иначе первый, иначе direct. */
export function getAttribution(): Attribution {
  if (typeof window === "undefined") return { lead_source: "(direct)", lead_medium: "(none)" };
  const first = read(FIRST_KEY, FIRST_TTL);
  const last = read(LAST_KEY, LAST_TTL) ?? first;
  return {
    lead_source: last?.source ?? "(direct)",
    lead_medium: last?.medium ?? "(none)",
    lead_campaign: last?.campaign,
    lead_term: last?.term,
    lead_content: last?.content,
    click_id: last?.click_id,
    first_source: first?.source,
    first_medium: first?.medium,
    first_campaign: first?.campaign,
    landing_page: first?.landing_page ?? last?.landing_page,
    referrer: first?.referrer ?? last?.referrer,
  };
}
