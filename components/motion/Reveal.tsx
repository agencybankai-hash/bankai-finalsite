"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import {
  registerGsap,
  prefersReducedMotion,
  introReady,
  EASE,
  DUR,
  REVEAL,
} from "@/lib/motion";
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
  /** scroll — по входу в вьюпорт (деф); load — после прелоадера (первый экран). */
  trigger?: "scroll" | "load";
};

/**
 * Переиспользуемая входная анимация по скроллу (GSAP ScrollTrigger).
 * Главный motion-примитив: серверные секции остаются серверными,
 * их контент оборачивается в <Reveal>. useGSAP применяет стартовое
 * состояние в layout-эффекте (до краски) — без вспышки.
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

  useGSAP(
    () => {
      registerGsap();
      const el = ref.current;
      if (!el) return;

      const targets = stagger
        ? el.querySelectorAll<HTMLElement>("[data-reveal]")
        : el;
      const step = stagger
        ? typeof stagger === "number"
          ? stagger
          : REVEAL.stagger
        : 0;

      if (prefersReducedMotion()) {
        gsap.set(targets, { autoAlpha: 1, y: 0 });
        return;
      }

      if (trigger === "load") {
        // спрятать до краски, раскрыть после прелоадера (синхрон с занавесом)
        gsap.set(targets, { autoAlpha: 0, y });
        introReady(() =>
          gsap.to(targets, {
            autoAlpha: 1,
            y: 0,
            duration: DUR.base,
            ease: EASE,
            delay,
            stagger: step,
          }),
        );
        return;
      }

      gsap.from(targets, {
        autoAlpha: 0,
        y,
        duration: DUR.base,
        ease: EASE,
        delay,
        stagger: step,
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          toggleActions: once
            ? "play none none none"
            : "play none none reverse",
        },
      });
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} className={cn(className)}>
      {children}
    </Tag>
  );
}
