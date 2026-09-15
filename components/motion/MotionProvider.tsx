"use client";

import { useEffect } from "react";
import { prefersReducedMotion } from "@/lib/motion";

/**
 * Плавный скролл Lenis для устройств с мышью. Библиотека подгружается
 * динамически после простоя браузера: не попадает в стартовый бандл и
 * не отнимает главный поток у первой краски. На тач-устройствах и при
 * prefers-reduced-motion не запускается вовсе (колесо там не сглаживается,
 * а rAF-цикл только грузил бы процессор).
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (prefersReducedMotion() || window.matchMedia("(pointer: coarse)").matches) return;

    let cancelled = false;
    let destroy: (() => void) | null = null;

    const start = async () => {
      const { default: Lenis } = await import("lenis");
      if (cancelled) return;
      const lenis = new Lenis({
        duration: 1.1,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      });
      let raf = 0;
      const loop = (time: number) => {
        lenis.raf(time);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
      destroy = () => {
        cancelAnimationFrame(raf);
        lenis.destroy();
      };
    };

    const hasIdle = typeof window.requestIdleCallback === "function";
    const idle = hasIdle
      ? window.requestIdleCallback(() => void start(), { timeout: 2000 })
      : window.setTimeout(() => void start(), 200);

    return () => {
      cancelled = true;
      if (hasIdle) window.cancelIdleCallback(idle);
      else window.clearTimeout(idle);
      destroy?.();
    };
  }, []);

  return <>{children}</>;
}
