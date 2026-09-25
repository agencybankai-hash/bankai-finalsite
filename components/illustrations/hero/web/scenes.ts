import type { ChannelScenes } from "../../types";
import { WebScene } from "./WebScene";

/** Сцены сайтов по видам. Тематические варианты посадочных пока рисует базовая сцена. */
export const WEB_SCENES: ChannelScenes<"web" | "landing" | "corporate" | "ecommerce" | "web-city"> = {
  web: WebScene,
  landing: WebScene,
  corporate: WebScene,
  ecommerce: WebScene,
  "web-city": WebScene,
};
