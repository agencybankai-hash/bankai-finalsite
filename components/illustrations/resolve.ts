import type {
  HeroVisualKind,
  ServiceChannel,
  ServiceLanding,
  VisualCopy,
} from "@/content/types";
import { landings } from "@/content/landings";
import { channels } from "@/content/services";
import {
  channelVisuals,
  cityVisuals,
  landingVisuals,
  pageVisuals,
  visualCopy,
  visualFloats,
  visualKpis,
} from "@/content/visuals";
import { EMBLEM_OF, type EmblemName } from "./emblems/names";

/* Только для серверных компонентов: тянет весь текст посадочных. */

export type ResolvedHeroVisual = {
  kind: HeroVisualKind;
  /** Путь страницы: ключ карточки и KPI. */
  path: string;
  /** Город в им. падеже («Астана»); у гео-нейтральных страниц нет. */
  city?: string;
  copy: VisualCopy;
};

const COUNTRIES = new Set(["Казахстан", "США", "Россия", "Узбекистан", "Монголия", "СНГ"]);

/** Город городовой страницы: первый не-страна из geo. Без geo - Алматы, как в JSON-LD. */
function cityOf(landing: ServiceLanding): string | undefined {
  if (landing.kind === "subservice") return undefined;
  if (!landing.geo) return "Алматы";
  return landing.geo.find((g) => !COUNTRIES.has(g));
}

function kindOf(channel: ServiceChannel, landing?: ServiceLanding): HeroVisualKind {
  const own = channelVisuals[channel.slug] ?? "leadgen";
  if (!landing) return own;
  if (landing.kind === "subservice") return landingVisuals[landing.slug] ?? own;
  return (
    landingVisuals[landing.slug] ??
    (landing.parent ? landingVisuals[landing.parent] : undefined) ??
    cityVisuals[landing.channel] ??
    own
  );
}

function copyFor(kind: HeroVisualKind, path: string, city?: string): VisualCopy {
  const base = visualCopy[kind];
  const query =
    base.query && city && !base.query.includes(city.toLowerCase())
      ? `${base.query} ${city.toLowerCase()}`
      : base.query;
  // «{city}» в заголовке вида - город встаёт в заголовок, справа остаётся meta вида
  const cityTitle = base.title.includes("{city}");
  return {
    ...base,
    title: cityTitle ? base.title.replace("{city}", city ?? "") : base.title,
    meta: cityTitle ? base.meta : (city ?? base.meta),
    query,
    kpis: visualKpis[path] ?? base.kpis,
    float: visualFloats[path] ?? null,
  };
}

export function resolveHeroVisual(
  channel: ServiceChannel,
  landing?: ServiceLanding,
): ResolvedHeroVisual {
  const kind = kindOf(channel, landing);
  const path = landing?.path ?? `/services/${channel.slug}`;
  const city = landing ? cityOf(landing) : undefined;
  return { kind, path, city, copy: copyFor(kind, path, city) };
}

/** Визуал страницы со своим маршрутом (pageVisuals). */
export function resolvePageVisual(path: string): ResolvedHeroVisual {
  const spec = pageVisuals[path];
  if (!spec) throw new Error(`content/visuals.ts: нет pageVisuals для ${path}`);
  return { kind: spec.kind, path, city: spec.city, copy: copyFor(spec.kind, path, spec.city) };
}

/* Все страницы с визуалом по пути: хабы, посадочные, свои маршруты. */
const byPath = new Map<string, ResolvedHeroVisual>();
for (const c of channels) {
  const v = resolveHeroVisual(c);
  byPath.set(v.path, v);
  for (const l of landings.filter((x) => x.channel === c.slug)) {
    const lv = resolveHeroVisual(c, l);
    byPath.set(lv.path, lv);
  }
}
for (const path of Object.keys(pageVisuals)) byPath.set(path, resolvePageVisual(path));

/* Устаревший ключ в content/visuals.ts валит сборку, а не молча теряет картинку. */
for (const slug of Object.keys(landingVisuals)) {
  if (!landings.some((l) => l.slug === slug)) {
    throw new Error(`content/visuals.ts: landingVisuals - нет посадочной «${slug}»`);
  }
}
for (const path of [...Object.keys(visualFloats), ...Object.keys(visualKpis)]) {
  if (!byPath.has(path)) throw new Error(`content/visuals.ts: нет страницы ${path}`);
}

export function visualForPath(path: string): ResolvedHeroVisual | undefined {
  return byPath.get(path.split(/[?#]/)[0]);
}

/** Эмблема ссылки по её адресу; geo - значок-пин городской страницы. */
export function emblemForHref(href: string): { name: EmblemName; geo: boolean } | undefined {
  const v = visualForPath(href);
  if (!v) return undefined;
  return { name: EMBLEM_OF[v.kind], geo: Boolean(v.city) || v.kind === "seo-regions" };
}
