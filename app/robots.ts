import type { MetadataRoute } from "next";
import { headers } from "next/headers";
import { siteMeta } from "@/content/site";

// Боевой хост - обычные правила; любой другой (*.vercel.app, preview) - закрыт целиком.
export default async function robots(): Promise<MetadataRoute.Robots> {
  const base = siteMeta.url.replace(/\/$/, "");
  const host = (await headers()).get("host") ?? "";
  if (!/^(www\.)?bankai\.agency$/.test(host)) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api"],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
