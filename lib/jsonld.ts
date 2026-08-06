import { contacts, siteMeta } from "@/content/site";

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
