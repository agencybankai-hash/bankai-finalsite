"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion, onEnter, easeOsmo } from "@/lib/motion";

/**
 * Count-up по входу в вьюпорт (донор Osmo «Number Odometer»), триггер на
 * IntersectionObserver. Парсит число из строки («$14.6M», «до 5.2x»,
 * «50+», «до -40%»), тикает с 0 до значения, сохраняя префикс/суффикс
 * и знаки после запятой. На requestAnimationFrame, без GSAP.
 * reduced-motion / no-JS → сразу значение.
 */
const DURATION_MS = 1200;

export function CountUp({ value, className }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const match = value.match(/-?\d+(?:[.,]\d+)?/);
    if (!match || prefersReducedMotion()) {
      el.textContent = value;
      return;
    }

    const numStr = match[0];
    const target = parseFloat(numStr.replace(",", "."));
    const decimals = (numStr.split(/[.,]/)[1] || "").length;
    const prefix = value.slice(0, match.index);
    const suffix = value.slice((match.index ?? 0) + numStr.length);
    const sep = numStr.includes(",") ? "," : ".";
    const fmt = (v: number) => prefix + v.toFixed(decimals).replace(".", sep) + suffix;

    el.textContent = fmt(0);
    let raf = 0;

    const stop = onEnter(el, () => {
      const t0 = performance.now();
      const tick = (now: number) => {
        const p = Math.min(1, (now - t0) / DURATION_MS);
        el.textContent = fmt(target * easeOsmo(p));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    });

    return () => {
      stop();
      cancelAnimationFrame(raf);
    };
  }, [value]);

  return (
    <span ref={ref} className={className}>
      {value}
    </span>
  );
}
