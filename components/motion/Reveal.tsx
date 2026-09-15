"use client";

import { useLayoutEffect, useRef } from "react";
import { prefersReducedMotion, onEnter, EASE_CSS, DUR, REVEAL } from "@/lib/motion";
import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  className?: string;
  /** Тег обёртки (по умолчанию div). */
  as?: React.ElementType;
  /** Сдвиг по Y на старте, px. */
  y?: number;
  /** Задержка, сек. */
  delay?: number;
  /** Каскад по детям с [data-reveal]. true — дефолтный шаг, число — свой. */
  stagger?: boolean | number;
  /** Повтор при обратном скролле (по умолчанию однократно). */
  once?: boolean;
  /** scroll — по входу в вьюпорт (деф); load — сразу после гидратации. */
  trigger?: "scroll" | "load";
};

/**
 * Переиспользуемая входная анимация без GSAP: стартовое состояние
 * ставится инлайн в layout-эффекте (до краски), раскрытие - CSS-переход
 * по входу в вьюпорт (IntersectionObserver). После перехода инлайновые
 * стили снимаются, чтобы не мешать hover-переходам детей.
 * prefers-reduced-motion → контент сразу видим, без движения.
 */
export function Reveal({
  children,
  className,
  as: Tag = "div",
  y = REVEAL.y,
  delay = 0,
  stagger = false,
  once = true,
  trigger = "scroll",
}: Props) {
  const ref = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    const targets = stagger
      ? Array.from(el.querySelectorAll<HTMLElement>("[data-reveal]"))
      : [el];
    const step = stagger ? (typeof stagger === "number" ? stagger : REVEAL.stagger) : 0;
    let timer: ReturnType<typeof setTimeout> | null = null;

    const hide = () => {
      targets.forEach((t) => {
        t.style.transition = "none";
        t.style.opacity = "0";
        t.style.visibility = "hidden";
        t.style.transform = `translateY(${y}px)`;
      });
    };
    const play = () => {
      targets.forEach((t, i) => {
        const d = `${delay + i * step}s`;
        // фиксируем стартовое состояние, затем включаем переход
        void t.offsetWidth;
        t.style.transition =
          `opacity ${DUR.base}s ${EASE_CSS} ${d}, transform ${DUR.base}s ${EASE_CSS} ${d}, ` +
          `visibility 0s linear ${d}`;
        t.style.opacity = "";
        t.style.visibility = "";
        t.style.transform = "";
      });
      const total = (delay + (targets.length - 1) * step + DUR.base) * 1000 + 50;
      timer = setTimeout(() => targets.forEach((t) => (t.style.transition = "")), total);
    };

    hide();
    if (trigger === "load") {
      play();
      return () => {
        if (timer) clearTimeout(timer);
      };
    }
    const stop = onEnter(el, play, { once });
    let leave: (() => void) | undefined;
    if (!once) {
      // повтор: прячем, когда блок полностью ушёл из вьюпорта
      const io = new IntersectionObserver((entries) => {
        for (const e of entries) if (!e.isIntersecting) hide();
      });
      io.observe(el);
      leave = () => io.disconnect();
    }
    return () => {
      stop();
      leave?.();
      if (timer) clearTimeout(timer);
    };
  }, [y, delay, stagger, once, trigger]);

  return (
    <Tag ref={ref} className={cn(className)}>
      {children}
    </Tag>
  );
}
