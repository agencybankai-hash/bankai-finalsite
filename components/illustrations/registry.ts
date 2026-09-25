import type { HeroVisualKind } from "@/content/types";
import type { Scene } from "./types";
import { SEO_SCENES } from "./hero/seo/scenes";
import { CONTEXT_SCENES } from "./hero/context/scenes";
import { WEB_SCENES } from "./hero/web/scenes";
import { SYSTEM_SCENES } from "./hero/system/scenes";

/** Сцена по виду. Каждый канал ведёт свой реестр (hero/<канал>/scenes.ts),
 *  здесь они только сводятся; пропущенный вид - ошибка типов. */
export const HERO_SCENES: Record<HeroVisualKind, Scene> = {
  ...SEO_SCENES,
  ...CONTEXT_SCENES,
  ...WEB_SCENES,
  ...SYSTEM_SCENES,
};
