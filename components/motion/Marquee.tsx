"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { registerGsap, prefersReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * Бесконечная лента (донор Osmo «CSS Marquee» / «Logo Wall Cycle»).
 * Контент дублируется в две одинаковые группы, трек едет на −50% —
 * бесшовно. Отступы несут сами дети (трек без gap), иначе шов рвётся.
 * Hover — замедление. reduced-motion → статично, без анимации.
 */
export function Marquee({
  children,
  pxPerSecond = 40,
  className,
}: {
  children: React.ReactNode;
  /** Скорость, px/сек. */
  pxPerSecond?: number;
  className?: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      registerGsap();
      const track = trackRef.current;
      if (!track || prefersReducedMotion()) return;

      const half = track.scrollWidth / 2;
      if (!half) return;

      const tween = gsap.to(track, {
        x: -half,
        duration: half / pxPerSecond,
        ease: "none",
        repeat: -1,
      });

      const slow = () => gsap.to(tween, { timeScale: 0.2, duration: 0.4 });
      const back = () => gsap.to(tween, { timeScale: 1, duration: 0.4 });
      track.addEventListener("mouseenter", slow);
      track.addEventListener("mouseleave", back);

      return () => {
        tween.kill();
        track.removeEventListener("mouseenter", slow);
        track.removeEventListener("mouseleave", back);
      };
    },
    { scope: trackRef },
  );

  return (
    <div className={cn("overflow-hidden", className)}>
      <div ref={trackRef} className="flex w-max">
        <div className="flex shrink-0">{children}</div>
        <div className="flex shrink-0" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}
