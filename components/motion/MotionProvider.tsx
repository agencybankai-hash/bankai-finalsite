"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { registerGsap, prefersReducedMotion } from "@/lib/motion";

/**
 * Корневой провайдер моторики:
 * - регистрирует плагины GSAP один раз;
 * - запускает Lenis (smooth scroll) и синхронит его со ScrollTrigger
 *   через общий тикер GSAP;
 * - при prefers-reduced-motion не инициализирует Lenis вовсе.
 * Чистка — на размонтировании через useGSAP.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useGSAP(() => {
    registerGsap();
    if (prefersReducedMotion()) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenisRef.current = lenis;
    // Доступ для якорных переходов (GuideToc и т.п.).
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;

    lenis.on("scroll", ScrollTrigger.update);
    const ticker = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(ticker);
    gsap.ticker.lagSmoothing(0);

    // Триггеры дочерних reveal уже созданы (эффекты детей раньше родителя) —
    // пересчитываем позиции под Lenis, чтобы below-fold reveal не залипал.
    ScrollTrigger.refresh();

    return () => {
      gsap.ticker.remove(ticker);
      lenis.destroy();
      lenisRef.current = null;
      (window as unknown as { __lenis?: Lenis }).__lenis = undefined;
    };
  }, []);

  return <>{children}</>;
}
