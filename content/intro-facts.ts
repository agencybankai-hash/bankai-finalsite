import type { ServiceChannel, ServiceLanding } from "./types";

/* ───────────────  Факты интро-полосы  ───────────────
   Чипы справа от абзаца под hero (components/sections/IntroStrip.tsx).
   Отдельно от services.ts и landings.ts, как visuals.ts: правка чипа не должна
   сдвигать lastmod страниц в sitemap. Срок - только выжимка из текста этой же
   страницы, без новых обещаний. Цена и гео берутся из данных страницы. */

/** Чип «Срок» по пути страницы. Нет записи - нет чипа. */
const introTimeline: Record<string, string> = {
  "/services/leadgen": "заявки с первой недели",
  "/services/seo/prodvizhenie-saitov-almaty": "заявки с 3-4 месяца",
  "/services/seo/prodvizhenie-saitov-astana": "обращения с 3-4 месяца",
  "/services/seo/prodvizhenie-saitov-kazakhstan": "рост заявок с 3-4 месяца",
  "/services/seo/prodvizhenie-internet-magazina": "заказы с 3-4 месяца",
  "/services/context/kontekstnaya-reklama-almaty": "обращения с первой недели",
  "/services/context/kontekstnaya-reklama-astana": "обращения в первую неделю",
  "/services/context/nastroika-google-ads": "показы через 3-5 дней",
  "/services/context/nastroika-yandex-direct": "показы на 3-5 день",
  "/services/web/sozdanie-lendinga": "от 2 недель",
  "/services/web/sozdanie-lendinga-almaty": "от 2 недель",
  "/services/web/sozdanie-lendinga-astana": "от 2 недель",
  "/services/web/sozdanie-korporativnogo-saita": "4-6 недель",
  "/services/web/sozdanie-saitov-almaty": "от 2 недель",
  "/services/web/sozdanie-saitov-astana": "от 2 недель",
  "/services/web/sozdanie-saitov-shymkent": "от 2 недель",
  "/services/web/sozdanie-internet-magazina": "называем после прототипа",
  "/services/web/sozdanie-internet-magazina-almaty": "называем после прототипа",
};

export type IntroFacts = {
  timeline?: string;
  /** Значение без «от», как в ответном блоке: «250 000 ₸/мес». */
  priceFrom?: string;
  geo?: string;
};

/** Факты страницы услуги: срок - из списка выше, цена - из ответного блока,
 *  гео - город городовой страницы (без `geo` - Алматы, как в areaServed).
 *  У гео-нейтральных страниц (хабы, подуслуги) гео нет. */
export function introFacts(channel: ServiceChannel, landing?: ServiceLanding): IntroFacts {
  const path = landing?.path ?? `/services/${channel.slug}`;
  const isCity = Boolean(landing) && landing?.kind !== "subservice";
  return {
    timeline: introTimeline[path],
    priceFrom: (landing ?? channel).answer?.priceFrom,
    geo: isCity ? (landing?.geo?.[0] ?? "Алматы") : undefined,
  };
}
