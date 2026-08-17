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

export function serviceLd(name: string, description: string, path: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    url: `${base}${path}`,
    serviceType: name,
    provider: { ...publisher, address: organizationLd.address },
    areaServed: [
      { "@type": "City", name: "Алматы" },
      { "@type": "Country", name: "Казахстан" },
      { "@type": "Country", name: "США" },
    ],
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
