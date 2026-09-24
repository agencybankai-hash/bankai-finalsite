import type { ReactElement } from "react";
import type { HeroVisualKind } from "@/content/types";
import type { SceneProps } from "./types";
import { SeoScene } from "./hero/seo/SeoScene";
import { ContextScene } from "./hero/context/ContextScene";
import { WebScene } from "./hero/web/WebScene";
import { LeadgenScene } from "./hero/system/LeadgenScene";

/** Сцена по виду. Тематические варианты посадочных пока рисует базовая сцена
 *  канала: вид, город и запрос она получает в пропсах. */
export const HERO_SCENES: Record<HeroVisualKind, (p: SceneProps) => ReactElement> = {
  seo: SeoScene,
  "seo-store": SeoScene,
  "seo-regions": SeoScene,
  "seo-city": SeoScene,
  context: ContextScene,
  "google-ads": ContextScene,
  "yandex-direct": ContextScene,
  "context-city": ContextScene,
  web: WebScene,
  landing: WebScene,
  corporate: WebScene,
  ecommerce: WebScene,
  "web-city": WebScene,
  leadgen: LeadgenScene,
};
