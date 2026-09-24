"use client";

import { useEffect, useRef } from "react";

/**
 * template.tsx ремаунтится на каждую навигацию → enter-анимация
 * контента при переходе между страницами (CSS-класс .page-enter,
 * см. globals.css). Первую загрузку не анимируем: контент уже отрисован
 * сервером, прятать и заново проявлять его - вспышка и поздний LCP.
 * reduced-motion → без движения (правило в CSS).
 */
let firstMount = true;

export default function Template({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (firstMount) {
      firstMount = false;
      return;
    }
    const el = ref.current;
    if (!el) return;
    el.classList.add("page-enter");
    // animationend всплывает от анимаций детей (иллюстрации) - ждём свою
    const done = (e: AnimationEvent) => {
      if (e.target !== el) return;
      el.classList.remove("page-enter");
      el.removeEventListener("animationend", done);
    };
    el.addEventListener("animationend", done);
    return () => el.removeEventListener("animationend", done);
  }, []);

  return <div ref={ref}>{children}</div>;
}
