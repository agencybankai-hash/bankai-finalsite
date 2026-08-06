import type { MetadataRoute } from "next";
import { siteMeta } from "@/content/site";
import { cases } from "@/content/cases";
import { guides } from "@/content/guides";

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

  return [...staticPaths, ...casePaths, ...guidePaths].map((p) => ({
    url: `${base}${p}` || base,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: p === "" ? 1 : p.startsWith("/guides") || p.startsWith("/services") ? 0.8 : 0.6,
  }));
}
