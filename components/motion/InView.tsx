"use client";

import { useLayoutEffect, useRef } from "react";
import { onEnter, prefersReducedMotion } from "@/lib/motion";

type Props = React.HTMLAttributes<HTMLElement> & {
  /** load - сцена играет с первой краски (hero); enter - по входу в экран. */
  intro?: "load" | "enter";
  as?: React.ElementType;
};

/**
 * Область CSS-анимаций иллюстрации (контракт - components/illustrations/illustrations.css):
 * базовый стиль = финальный кадр, анимации включает [data-live], пауза - [data-play=wait|off].
 * - load: data-live уже в SSR, сцена играет без JS. Если к гидрации блок почти
 *   не виден (мобила, hero ниже сгиба) - перезапуск с нуля и старт по входу в экран.
 * - enter: без JS и если блок уже на экране при гидрации - статичный финал без
 *   повтора; иначе сцена ждёт на первом кадре и стартует по входу.
 * Вне экрана - пауза, reduced-motion - статика. Без state: только атрибуты через ref.
 */
export function InView({ intro = "enter", as: Tag = "div", children, ...rest }: Props) {
  const ref = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) {
      el.removeAttribute("data-live");
      return;
    }

    const r = el.getBoundingClientRect();
    const seen = Math.max(0, Math.min(r.bottom, window.innerHeight) - Math.max(r.top, 0));
    const share = r.height ? seen / r.height : 0;

    if (intro === "enter") {
      if (share >= 0.5) return;
      el.setAttribute("data-live", "");
      el.setAttribute("data-play", "wait");
    } else if (share < 0.34) {
      el.removeAttribute("data-live");
      void el.offsetWidth; // сброс уже идущих анимаций
      el.setAttribute("data-live", "");
      el.setAttribute("data-play", "wait");
    }

    const stopEnter =
      el.getAttribute("data-play") === "wait"
        ? onEnter(el, () => el.setAttribute("data-play", "on"))
        : () => {};
    const io = new IntersectionObserver((entries) => {
      if (el.getAttribute("data-play") === "wait") return;
      for (const e of entries) el.setAttribute("data-play", e.isIntersecting ? "on" : "off");
    });
    io.observe(el);
    return () => {
      stopEnter();
      io.disconnect();
    };
  }, [intro]);

  return (
    <Tag
      ref={ref}
      data-anim={intro}
      data-live={intro === "load" ? "" : undefined}
      {...rest}
    >
      {children}
    </Tag>
  );
}
