"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * Бесконечная лента (донор Osmo «CSS Marquee» / «Logo Wall Cycle»).
 * Контент дублируется в две одинаковые группы, трек едет на −50% CSS-анимацией
 * (см. .marquee-track в globals.css) — бесшовно и без JS в цикле. JS только
 * измеряет ширину, чтобы задать длительность под скорость px/сек.
 * Отступы несут сами дети (трек без gap), иначе шов рвётся.
 * Hover — пауза. reduced-motion → статично (правило в CSS).
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

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const setDuration = () => {
      const half = track.scrollWidth / 2;
      if (half) track.style.setProperty("--marquee-duration", `${half / pxPerSecond}s`);
    };
    setDuration();
    const ro = new ResizeObserver(setDuration);
    ro.observe(track);
    return () => ro.disconnect();
  }, [pxPerSecond]);

  return (
    <div className={cn("marquee overflow-hidden", className)}>
      <div ref={trackRef} className="marquee-track flex w-max">
        <div className="flex shrink-0">{children}</div>
        <div className="flex shrink-0" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}
