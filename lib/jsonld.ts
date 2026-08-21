import { contacts, siteMeta } from "@/content/site";
import { siteMetaEn } from "@/content/en/ui";
import type { FaqItem } from "@/content/types";

const base = siteMeta.url.replace(/\/$/, "");

/* Только реальные профили: заглушки «#» в разметку не попадают. */
const sameAs = [
  contacts.telegramUrl,
  contacts.telegramChannelUrl,
  contacts.youtubeUrl,
].filter((u) => u.startsWith("http"));

const publisher = {
  "@type": "Organization",
  name: siteMeta.name,
  url: base,
};

export const organizationLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: siteMeta.name,
  legalName: siteMeta.fullName,
  url: base,
  email: contacts.email,
  description: siteMeta.description,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Алматы",
    addressCountry: "KZ",
  },
  areaServed: [
    { "@type": "Country", name: "Казахстан" },
    { "@type": "Country", name: "США" },
  ],
  ...(sameAs.length > 0 && { sameAs }),
};

/** Организация для EN-версии: те же данные, подписи латиницей. */
export const organizationLdEn = {
  ...organizationLd,
  description: siteMetaEn.description,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Almaty",
    addressCountry: "KZ",
  },
  areaServed: [
    { "@type": "Country", name: "United States" },
    { "@type": "Country", name: "Kazakhstan" },
  ],
};

/* Гео из контента приходит строками - страна это или город, знаем по списку. */
const countryNames = new Set(["Казахстан", "США", "Россия", "Узбекистан"]);

function areaLd(name: string) {
  return { "@type": countryNames.has(name) ? "Country" : "City", name };
}

const currencyBySign: Record<string, string> = { "₸": "KZT", $: "USD" };

/** «250 000 ₸/мес» → Offer с price 250000 и priceCurrency KZT. */
function offerLd(priceFrom: string) {
  const price = priceFrom.replace(/\D/g, "");
  const sign = Object.keys(currencyBySign).find((s) => priceFrom.includes(s));
  if (!price || !sign) return undefined;
  return { "@type": "Offer", price, priceCurrency: currencyBySign[sign] };
}

type ServiceLdOptions = {
  /** Короткое название услуги: «SEO-продвижение», а не meta title с гео и хвостом. */
  serviceType?: string;
  /** Гео обслуживания. Не задано - Алматы, Казахстан, США. */
  areaServed?: string | string[];
  /** Цена «от» строкой из контента, напр. «250 000 ₸/мес». */
  priceFrom?: string;
};

export function serviceLd(
  name: string,
  description: string,
  path: string,
  options: ServiceLdOptions = {},
) {
  const url = `${base}${path}`;
  const areas = options.areaServed
    ? [options.areaServed].flat()
    : ["Алматы", "Казахстан", "США"];
  const offer = options.priceFrom ? offerLd(options.priceFrom) : undefined;
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    url,
    serviceType: options.serviceType ?? name,
    provider: { ...publisher, address: organizationLd.address },
    areaServed: areas.map(areaLd),
    ...(offer && { offers: { ...offer, url } }),
  };
}

export function articleLd(headline: string, description: string, path: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline,
    description,
    inLanguage: "ru",
    mainEntityOfPage: `${base}${path}`,
    author: publisher,
    publisher,
  };
}

/** Блок вопрос-ответ страницы: заявка на быстрый ответ в выдаче. */
export function faqLd(items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((it) => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: { "@type": "Answer", text: it.a },
    })),
  };
}

export function breadcrumbLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: `${base}${it.path}`,
    })),
  };
}

/** Готовый props для <script type="application/ld+json" dangerouslySetInnerHTML={...} /> */
export function ldJson(data: unknown) {
  return { __html: JSON.stringify(data).replace(/</g, "\\u003c") };
}
