import type { ChannelScenes } from "../../types";
import { ContextScene } from "./ContextScene";
import { DirectScene } from "./DirectScene";
import { GeoScene } from "./GeoScene";
import { StructureScene } from "./StructureScene";

/** Сцены контекста по видам: хаб - базовая сцена, посадочные - свои (город без схемы - базовая). */
export const CONTEXT_SCENES: ChannelScenes<
  "context" | "google-ads" | "yandex-direct" | "context-city"
> = {
  context: ContextScene,
  "google-ads": StructureScene,
  "yandex-direct": DirectScene,
  "context-city": GeoScene,
};
