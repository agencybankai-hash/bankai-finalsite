import { HeroFrame } from "./frame/HeroFrame";
import { HERO_SCENES } from "./registry";
import type { ResolvedHeroVisual } from "./resolve";

/** Тематический визуал hero: рамка + сцена по виду страницы. */
export function HeroIllustration({ visual }: { visual: ResolvedHeroVisual }) {
  const Scene = HERO_SCENES[visual.kind];
  return (
    <HeroFrame kind={visual.kind} city={visual.city} copy={visual.copy}>
      <Scene v={visual} />
    </HeroFrame>
  );
}
