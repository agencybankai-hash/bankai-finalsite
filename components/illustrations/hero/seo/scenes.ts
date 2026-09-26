import type { ChannelScenes } from "../../types";
import { SeoScene } from "./SeoScene";
import { SeoCityScene } from "./CityScene";
import { SeoRegionsScene } from "./RegionsScene";
import { SeoStoreScene } from "./StoreScene";

/** Сцены SEO по видам: хаб - базовая выдача, посадочные - свои сцены. */
export const SEO_SCENES: ChannelScenes<"seo" | "seo-store" | "seo-regions" | "seo-city"> = {
  seo: SeoScene,
  "seo-store": SeoStoreScene,
  "seo-regions": SeoRegionsScene,
  "seo-city": SeoCityScene,
};
