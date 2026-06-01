"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { registerGsap, prefersReducedMotion, onEnter, EASE } from "@/lib/motion";

/**
 * Count-up по входу в вьюпорт (донор Osmo «Number Odometer»), триггер на
 * IntersectionObserver. Парсит число из строки («$14.6M», «до 5.2x»,
 * «50+», «до -40%»), тикает с 0 до значения, сохраняя префикс/суффикс
 * и знаки после запятой. reduced-motion / no-JS → сразу значение.
 */
export function CountUp({
  value,
  className,
}: {
  value: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      registerGsap();
      const el = ref.current;
      if (!el) return;

      const match = value.match(/-?\d+(?:[.,]\d+)?/);
      if (!match || prefersReducedMotion()) {
        el.textContent = value;
        return;
      }

      const numStr = match[0];
      const target = parseFloat(numStr.replace(",", "."));
      const decimals = (numStr.split(/[.,]/)[1] || "").length;
      const prefix = value.slice(0, match.index);
      const suffix = value.slice((match.index ?? 0) + numStr.length);
      const fmt = (v: number) => prefix + v.toFixed(decimals) + suffix;

      const obj = { v: 0 };
      el.textContent = fmt(0);

      return onEnter(el, () => {
        gsap.to(obj, {
          v: target,
          duration: 1.2,
          ease: EASE,
          onUpdate: () => {
            el.textContent = fmt(obj.v);
          },
        });
      });
    },
    { scope: ref },
  );

  return (
    <span ref={ref} className={className}>
      {value}
    </span>
  );
}
