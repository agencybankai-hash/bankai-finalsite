/**
 * Источник правды моторики. Значения зеркалят токены в globals.css
 * (--ease-osmo, --dur-*). Любая анимация тянет easing/длительности
 * отсюда, а не задаёт их заново.
 *
 * Без GSAP: reveal, счётчики, бегущая строка и курсор сделаны на CSS
 * и requestAnimationFrame, чтобы библиотека не грузилась на каждой
 * странице. Компоненты на GSAP (SplitReveal, Preloader) берут его из
 * lib/motion-gsap.ts.
 */

/** Имя CustomEase для GSAP-компонентов (см. lib/motion-gsap.ts). */
export const EASE = "osmo";

/** Тот же easing для CSS-переходов и анимаций. */
export const EASE_CSS = "cubic-bezier(0.625, 0.05, 0, 1)";

/** Тот же easing как функция для rAF-анимаций (счётчик, курсор). */
export function easeOsmo(t: number): number {
  return cubicBezier(0.625, 0.05, 0, 1, Math.min(1, Math.max(0, t)));
}

/* Решение кубической Безье по x методом Ньютона: достаточно для анимаций. */
function cubicBezier(x1: number, y1: number, x2: number, y2: number, x: number): number {
  const sampleX = (t: number) => ((1 - 3 * x2 + 3 * x1) * t + (3 * x2 - 6 * x1)) * t * t + 3 * x1 * t;
  const sampleY = (t: number) => ((1 - 3 * y2 + 3 * y1) * t + (3 * y2 - 6 * y1)) * t * t + 3 * y1 * t;
  const slope = (t: number) => 3 * (1 - 3 * x2 + 3 * x1) * t * t + 2 * (3 * x2 - 6 * x1) * t + 3 * x1;
  let t = x;
  for (let i = 0; i < 6; i++) {
    const d = slope(t);
    if (Math.abs(d) < 1e-6) break;
    t -= (sampleX(t) - x) / d;
  }
  return sampleY(t);
}

/** Длительности (сек). Зеркало --dur-* в globals.css. */
export const DUR = { base: 0.6 } as const;

/** Дефолты входной анимации. */
export const REVEAL = { y: 24, stagger: 0.08 } as const;

export function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/* ── Intro-гейт ─────────────────────────────────────────────
   Раньше анимации первого экрана ждали прелоадер-занавес. Прелоадер
   снят ради LCP (он держал первый экран закрытым ~2 с), поэтому гейт
   открыт с самого начала: introReady выполняет колбэк сразу. Если
   прелоадер вернётся, он должен закрыть гейт до эффектов детей. */
let introResolved = true;
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
