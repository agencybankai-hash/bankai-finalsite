import type { ChannelScenes } from "../../types";
import { ContextScene } from "./ContextScene";

/** Сцены контекста по видам. Тематические варианты посадочных пока рисует базовая сцена. */
export const CONTEXT_SCENES: ChannelScenes<
  "context" | "google-ads" | "yandex-direct" | "context-city"
> = {
  context: ContextScene,
  "google-ads": ContextScene,
  "yandex-direct": ContextScene,
  "context-city": ContextScene,
};
