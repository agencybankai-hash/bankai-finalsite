import type { ChannelScenes } from "../../types";
import { CorporateScene } from "./CorporateScene";
import { LandingScene } from "./LandingScene";
import { StoreScene } from "./StoreScene";
import { WebScene } from "./WebScene";

/** Сцены сайтов по видам. Городские страницы сайтов - базовая сцена с карточкой города. */
export const WEB_SCENES: ChannelScenes<"web" | "landing" | "corporate" | "ecommerce" | "web-city"> = {
  web: WebScene,
  landing: LandingScene,
  corporate: CorporateScene,
  ecommerce: StoreScene,
  "web-city": WebScene,
};
