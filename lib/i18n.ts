import type { Locale } from "@/content/types";

/**
 * Пары RU↔EN. EN-версия - выжимка, поэтому парных страниц немного, а
 * остальные RU-разделы (услуги, гайды, о нас) пары не имеют и hreflang не получают.
 */
const staticPairs: Record<string, string> = {
  "/": "/en",
  "/cases": "/en/cases",
  "/contacts": "/en/contacts",
  "/privacy": "/en/privacy",
  "/terms": "/en/terms",
};

/**
 * Слаги кейсов с EN-версией - зеркало `casesEn` из content/en/cases.ts.
 * Список литеральный: переключатель локали живёт в клиентском Header,
 * и импорт файла кейсов утянул бы весь их текст в клиентский бандл.
 * Появился новый EN-кейс - добавьте слаг сюда.
 */
export const pairedCaseSlugs = [
  "object-first",
  "sos-moving",
  "1kredit-kz",
  "green-moving",
  "ak-cabinet-craft",
  "unitel",
];

/** Путь без хвостового слэша; корень остаётся "/". */
function normalize(path: string): string {
  const p = path.replace(/\/+$/, "");
  return p === "" ? "/" : p;
}

/** EN-путь пары для RU-пути; null - у страницы нет EN-версии. */
export function enPairOf(ruPath: string): string | null {
  const p = normalize(ruPath);
  if (staticPairs[p]) return staticPairs[p];
  const slug = p.startsWith("/cases/") ? p.slice("/cases/".length) : "";
  return slug && pairedCaseSlugs.includes(slug) ? `/en/cases/${slug}` : null;
}

/** RU-путь пары для EN-пути: RU-оригинал есть у любой EN-страницы. */
export function ruPairOf(enPath: string): string {
  const p = normalize(enPath);
  return p === "/en" ? "/" : normalize(p.slice("/en".length));
}

/**
 * alternates парной страницы: canonical текущей локали + hreflang ru/en/x-default.
 * x-default - RU: основная версия сайта.
 */
export function pairAlternates(ru: string, en: string, locale: Locale = "ru") {
  return {
    canonical: locale === "en" ? en : ru,
    languages: { ru, en, "x-default": ru },
  };
}

/**
 * Куда ведёт переключатель локали с текущего пути.
 * RU-страница без EN-версии уводит на EN-главную, неизвестный EN-путь (404) - на RU-главную.
 */
export function switchHref(pathname: string, locale: Locale): string {
  if (locale === "ru") return enPairOf(pathname) ?? "/en";
  const ru = ruPairOf(pathname);
  return enPairOf(ru) ? ru : "/";
}
