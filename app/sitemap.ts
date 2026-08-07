import type { MetadataRoute } from "next";
import { siteMeta } from "@/content/site";
import { cases } from "@/content/cases";
import { casesEn } from "@/content/en/cases";
import { guides } from "@/content/guides";
import { enPairOf, ruPairOf } from "@/lib/i18n";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteMeta.url.replace(/\/$/, "");
  // Дат публикации в контенте нет - берём дату сборки, одну на все страницы.
  const lastModified = new Date();

  const staticPaths = [
    "",
    "/about",
    "/cases",
    "/contacts",
    "/guides",
    "/services/seo",
    "/services/context",
    "/services/web",
    "/privacy",
    "/terms",
  ];
  const casePaths = cases
    .filter((c) => !c.template)
    .map((c) => `/cases/${c.slug}`);
  const guidePaths = guides.map((g) => `/guides/${g.slug}`);

  const enStaticPaths = [
    "/en",
    "/en/cases",
    "/en/contacts",
    "/en/privacy",
    "/en/terms",
  ];
  const enCasePaths = casesEn
    .filter((c) => !c.template)
    .map((c) => `/en/cases/${c.slug}`);

  const url = (p: string) => (p === "" || p === "/" ? base : `${base}${p}`);

  /** hreflang-блок парной страницы; у непарных alternates нет. */
  const alternates = (ru: string, en: string | null) =>
    en
      ? {
          alternates: {
            languages: { ru: url(ru), en: url(en), "x-default": url(ru) },
          },
        }
      : {};

  const ruEntries = [...staticPaths, ...casePaths, ...guidePaths].map((p) => ({
    url: url(p),
    lastModified,
    changeFrequency: "monthly" as const,
    priority: p === "" ? 1 : p.startsWith("/guides") || p.startsWith("/services") ? 0.8 : 0.6,
    ...alternates(p, enPairOf(p)),
  }));

  const enEntries = [...enStaticPaths, ...enCasePaths].map((p) => ({
    url: url(p),
    lastModified,
    changeFrequency: "monthly" as const,
    priority: p === "/en" ? 1 : 0.6,
    ...alternates(ruPairOf(p), p),
  }));

  return [...ruEntries, ...enEntries];
}
