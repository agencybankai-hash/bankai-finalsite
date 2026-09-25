import type { ReactElement } from "react";
import type { HeroVisualKind } from "@/content/types";
import type { ResolvedHeroVisual } from "./resolve";

/** Пропсы сцены hero: вид, город, запрос и копирайт уже разрешены. */
export type SceneProps = { v: ResolvedHeroVisual };

export type Scene = (p: SceneProps) => ReactElement;

/** Реестр сцен одного канала: каждый вид канала - своя сцена. */
export type ChannelScenes<K extends HeroVisualKind> = Record<K, Scene>;
