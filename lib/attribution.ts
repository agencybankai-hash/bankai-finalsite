// Атрибуция лида: откуда пришёл посетитель (first-touch в рамках сессии вкладки).
export const UTM_KEYS = [
  "utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content",
  "gclid", "yclid", "fbclid",
] as const;
export type UtmKey = (typeof UTM_KEYS)[number];
export type Attribution = {
  referrer: string;
  landing: string;
  utm: Partial<Record<UtmKey, string>>;
};
export const STORAGE_KEY = "bankai.attribution";

export function currentAttribution(): Attribution {
  if (typeof window === "undefined") return { referrer: "", landing: "", utm: {} };

  const landing = location.href.slice(0, 2000);

  let referrer = document.referrer;
  if (referrer) {
    try {
      if (new URL(referrer).host === location.host) referrer = "";
    } catch {
      referrer = "";
    }
  }

  const utm: Partial<Record<UtmKey, string>> = {};
  for (const k of UTM_KEYS) {
    const v = new URLSearchParams(location.search).get(k)?.trim();
    if (v) utm[k] = v.slice(0, 200);
  }

  return { referrer: referrer.slice(0, 2000), landing, utm };
}

export function captureAttribution(): void {
  if (typeof window === "undefined") return;
  try {
    if (sessionStorage.getItem(STORAGE_KEY)) return;
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(currentAttribution()));
  } catch {}
}

export function readAttribution(): Attribution | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed: unknown = JSON.parse(raw);
      if (
        parsed &&
        typeof parsed === "object" &&
        typeof (parsed as Attribution).landing === "string"
      ) {
        return parsed as Attribution;
      }
    }
  } catch {}
  return currentAttribution();
}
