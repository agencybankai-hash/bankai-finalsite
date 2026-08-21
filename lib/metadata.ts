import type { Metadata, ResolvingMetadata } from "next";
import { siteMeta } from "@/content/site";
import type { Locale } from "@/content/types";
import { enPairOf, pairAlternates, ruPairOf } from "@/lib/i18n";

type PageMeta = {
  title: string;
  description: string;
  /** Канонический путь страницы - он же og:url. */
  path: string;
  locale?: Locale;
};

/**
 * generateMetadata страницы: title/description плюс свои openGraph и twitter, чтобы
 * ссылка на любой URL разворачивалась в карточку этой страницы, а не главной.
 * og:url совпадает с canonical; картинку берём из родителя - Next отдаёт
 * opengraph-image локали только тем страницам, у которых нет своего openGraph.
 * alternates считаются из пути: у RU-страницы с EN-парой появляется hreflang,
 * у остальных - только canonical.
 */
export function pageMetadata({
  title,
  description,
  path,
  locale = "ru",
}: PageMeta) {
  return async (
    _props: unknown,
    parent: ResolvingMetadata,
  ): Promise<Metadata> => {
    const en = locale === "en";
    const pair = en ? null : enPairOf(path);

    return {
      title,
      description,
      alternates: en
        ? pairAlternates(ruPairOf(path), path, "en")
        : pair
          ? pairAlternates(path, pair)
          : { canonical: path },
      openGraph: {
        type: "website",
        locale: en ? "en_US" : "ru_RU",
        siteName: siteMeta.name,
        url: path,
        title,
        description,
        images: (await parent).openGraph?.images,
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
      },
    };
  };
}
