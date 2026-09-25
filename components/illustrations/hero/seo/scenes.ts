import type { ChannelScenes } from "../../types";
import { SeoScene } from "./SeoScene";

/** Сцены SEO по видам. Тематические варианты посадочных пока рисует базовая сцена. */
export const SEO_SCENES: ChannelScenes<"seo" | "seo-store" | "seo-regions" | "seo-city"> = {
  seo: SeoScene,
  "seo-store": SeoScene,
  "seo-regions": SeoScene,
  "seo-city": SeoScene,
};
