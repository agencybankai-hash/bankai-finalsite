"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import {
  registerGsap,
  prefersReducedMotion,
  introReady,
  EASE,
  DUR,
} from "@/lib/motion";
import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  className?: string;
  /** Тег (по умолчанию div; для заголовков — h1/h2). */
  as?: React.ElementType;
  delay?: number;
  /** Шаг каскада между строками, сек. */
  stagger?: number;
  /** load — играет сразу при монтаже; scroll — по входу в вьюпорт. */
  trigger?: "load" | "scroll";
};

/**
 * Masked line reveal (донор Osmo «Masked Text Reveal»): строки текста
 * выезжают снизу из-под маски каскадом. GSAP SplitText (mask:"lines")
 * сам оборачивает строки в overflow-hidden. Easing/длительности — из
 * lib/motion.ts. Сплит после fonts.ready, иначе строки бьются неверно.
 * До сплита элемент спрятан (autoAlpha:0 в layout-эффекте) — без вспышки.
 * reduced-motion → текст сразу видим, без движения.
 */
export function SplitReveal({
  children,
  className,
  as: Tag = "div",
  delay = 0,
  stagger = 0.12,
  trigger = "load",
}: Props) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      registerGsap();
      const el = ref.current;
      if (!el) return;

      if (prefersReducedMotion()) {
        gsap.set(el, { autoAlpha: 1 });
        return;
      }

      gsap.set(el, { autoAlpha: 0 });

      // autoSplit сам ждёт fonts.ready и пере-разбивает строки на resize,
      // заново проигрывая onSplit — строки всегда бьются по факт. ширине.
      const split = SplitText.create(el, {
        type: "lines",
        mask: "lines",
        linesClass: "split-line",
        autoSplit: true,
        onSplit: (self) => {
          gsap.set(el, { autoAlpha: 1 });
          if (trigger === "load") {
            // строки спрятаны под маской; раскрываем после прелоадера
            gsap.set(self.lines, { yPercent: 110 });
            introReady(() =>
              gsap.to(self.lines, {
                yPercent: 0,
                duration: DUR.base,
                ease: EASE,
                stagger,
                delay,
              }),
            );
            return;
          }
          return gsap.from(self.lines, {
            yPercent: 110,
            duration: DUR.base,
            ease: EASE,
            stagger,
            delay,
            scrollTrigger: { trigger: el, start: "top 85%" },
          });
        },
      });

      return () => {
        split.revert();
      };
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} className={cn(className)}>
      {children}
    </Tag>
  );
}
