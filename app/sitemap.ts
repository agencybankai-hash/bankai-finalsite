import type { MetadataRoute } from "next";
import { siteMeta } from "@/content/site";
import { cases } from "@/content/cases";
import { casesEn } from "@/content/en/cases";
import { guides } from "@/content/guides";
import { landings } from "@/content/landings";
import { enPairOf, ruPairOf } from "@/lib/i18n";
import { modifiedAt } from "@/lib/lastmod";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteMeta.url.replace(/\/$/, "");
  /* lastModified - дата последней правки файлов-источников страницы из git
     (content/lastmod.json, обновляется командой npm run lastmod). Дата сборки
     не годится: она менялась бы при каждом деплое на всех URL сразу. */
  const sources: Record<string, string[]> = {
    "": ["content/site.ts", "app/(ru)/page.tsx"],
    "/about": ["content/about.ts", "app/(ru)/about/page.tsx"],
    "/cases": ["content/cases.ts"],
    "/contacts": ["app/(ru)/contacts/page.tsx"],
    "/guides": ["content/guides.ts"],
    "/privacy": ["app/(ru)/privacy/page.tsx"],
    "/terms": ["app/(ru)/terms/page.tsx"],
    "/en": ["content/en/ui.ts", "app/(en)/en/page.tsx"],
    "/en/cases": ["content/en/cases.ts"],
    "/en/contacts": ["app/(en)/en/contacts/page.tsx"],
    "/en/privacy": ["app/(en)/en/privacy/page.tsx"],
    "/en/terms": ["app/(en)/en/terms/page.tsx"],
  };
  const lastModifiedOf = (p: string): Date | undefined => {
    const files =
      sources[p] ??
      (p.startsWith("/services/") ? (landings.some((l) => l.path === p) ? ["content/landings.ts"] : ["content/services.ts"])
      : p.startsWith("/guides/") ? [`content/guides/${guides.find((g) => `/guides/${g.slug}` === p)?.file ?? ""}`, "content/guides.ts"]
      : p.startsWith("/en/cases/") ? ["content/en/cases.ts"]
      : p.startsWith("/cases/") ? ["content/cases.ts"]
      : []);
    const d = modifiedAt(...files);
    return d ? new Date(d) : undefined;
  };

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
  // Спутниковые посадочные под НЧ-запросы: ниже родительских услуг, выше кейсов.
  const landingPaths = landings.map((l) => l.path);

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

  const priorityOf = (p: string) => {
    if (p === "") return 1;
    if (landingPaths.includes(p)) return 0.7;
    return p.startsWith("/guides") || p.startsWith("/services") ? 0.8 : 0.6;
  };

  const ruEntries = [
    ...staticPaths,
    ...landingPaths,
    ...casePaths,
    ...guidePaths,
  ].map((p) => ({
    url: url(p),
    lastModified: lastModifiedOf(p),
    changeFrequency: "monthly" as const,
    priority: priorityOf(p),
    ...alternates(p, enPairOf(p)),
  }));

  const enEntries = [...enStaticPaths, ...enCasePaths].map((p) => ({
    url: url(p),
    lastModified: lastModifiedOf(p),
    changeFrequency: "monthly" as const,
    priority: p === "/en" ? 1 : 0.6,
    ...alternates(ruPairOf(p), p),
  }));

  return [...ruEntries, ...enEntries];
}
