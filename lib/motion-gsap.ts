import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CustomEase } from "gsap/CustomEase";

/**
 * GSAP нужен только компонентам, которые сейчас не смонтированы
 * (SplitReveal, Preloader). Вынесен из lib/motion.ts, чтобы библиотека
 * не попадала в общий бандл: остальная моторика сайта на CSS и rAF.
 */
let registered = false;

/** Регистрирует плагины и сигнатурный easing один раз. */
export function registerGsap(): void {
  if (registered || typeof window === "undefined") return;
  gsap.registerPlugin(ScrollTrigger, CustomEase);
  // Сигнатура Osmo: cubic-bezier(0.625, 0.05, 0, 1)
  CustomEase.create("osmo", "0.625, 0.05, 0, 1");
  registered = true;
}

export { gsap, ScrollTrigger };
