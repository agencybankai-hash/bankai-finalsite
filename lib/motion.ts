import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CustomEase } from "gsap/CustomEase";
import { SplitText } from "gsap/SplitText";

/**
 * Источник правды моторики. Значения зеркалят токены в globals.css
 * (--ease-osmo, --dur-*). Любая анимация тянет easing/длительности
 * отсюда, а не задаёт их заново.
 */

let registered = false;

/** Регистрирует плагины и сигнатурный easing один раз. */
export function registerGsap(): void {
  if (registered || typeof window === "undefined") return;
  gsap.registerPlugin(ScrollTrigger, CustomEase, SplitText);
  // Сигнатура Osmo: cubic-bezier(0.625, 0.05, 0, 1)
  CustomEase.create("osmo", "0.625, 0.05, 0, 1");
  registered = true;
}

/** Имя зарегистрированного CustomEase — основной easing проекта. */
export const EASE = "osmo";
export const EASE_OUT = "power3.out";

/** Длительности (сек). Зеркало --dur-* в globals.css. */
export const DUR = { fast: 0.3, base: 0.6, slow: 0.9 } as const;

/** Дефолты входной анимации. */
export const REVEAL = { y: 24, stagger: 0.08 } as const;

export function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/* ── Intro-гейт ─────────────────────────────────────────────
   Анимации первого экрана ждут окончания прелоадера, чтобы
   раскрываться вместе с уходом занавеса, а не за ним. После
   первой загрузки гейт открыт — на внутренних переходах не ждём. */
let introResolved = false;
let introCbs: Array<() => void> = [];
let introTimer: ReturnType<typeof setTimeout> | null = null;

/** Прелоадер вызывает в момент подъёма занавеса (или сразу при скипе). */
export function markIntroDone(): void {
  if (introResolved) return;
  introResolved = true;
  if (introTimer) {
    clearTimeout(introTimer);
    introTimer = null;
  }
  const cbs = introCbs;
  introCbs = [];
  cbs.forEach((c) => c());
}

/** Выполнить cb когда intro готов (сразу, если уже готов). */
export function introReady(cb: () => void): void {
  if (introResolved || typeof window === "undefined") {
    cb();
    return;
  }
  introCbs.push(cb);
  // страховка: не держать контент скрытым, если прелоадер не отработал
  if (!introTimer) introTimer = setTimeout(markIntroDone, 3500);
}

/**
 * Триггер «по входу в вьюпорт» на IntersectionObserver — надёжнее
 * GSAP ScrollTrigger в связке с Lenis (срабатывает и для уже видимых,
 * и для входящих; не зависит от sync скролла). Возвращает cleanup.
 */
export function onEnter(
  el: Element,
  cb: () => void,
  opts: { once?: boolean; rootMargin?: string } = {},
): () => void {
  const { once = true, rootMargin = "0px 0px -12% 0px" } = opts;
  if (typeof IntersectionObserver === "undefined") {
    cb();
    return () => {};
  }
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          cb();
          if (once) io.disconnect();
        }
      }
    },
    { rootMargin, threshold: 0 },
  );
  io.observe(el);
  return () => io.disconnect();
}
