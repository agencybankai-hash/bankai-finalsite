import type { HeroVisualKind } from "@/content/types";

/** Эмблема услуги: плитка-глиф для списков ссылок. Город - значок-пин поверх. */
export type EmblemName =
  | "seo"
  | "seo-store"
  | "context"
  | "google-ads"
  | "yandex-direct"
  | "web"
  | "landing"
  | "corporate"
  | "ecommerce"
  | "leadgen";

/** Эмблема по виду визуала страницы: городские виды - эмблема темы. */
export const EMBLEM_OF: Record<HeroVisualKind, EmblemName> = {
  seo: "seo",
  "seo-store": "seo-store",
  "seo-regions": "seo",
  "seo-city": "seo",
  context: "context",
  "google-ads": "google-ads",
  "yandex-direct": "yandex-direct",
  "context-city": "context",
  web: "web",
  landing: "landing",
  corporate: "corporate",
  ecommerce: "ecommerce",
  "web-city": "web",
  leadgen: "leadgen",
};
