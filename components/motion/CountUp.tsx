"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { registerGsap, prefersReducedMotion, EASE } from "@/lib/motion";

/**
 * Count-up на скролле (донор Osmo «Number Odometer» / «Display Count»).
 * Парсит число из строки («$14.6M», «до 5.2x», «50+», «до -40%»),
 * тикает с 0 до значения при входе в вьюпорт, сохраняя префикс/суффикс
 * и число знаков после запятой. reduced-motion / no-JS → сразу значение.
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
      gsap.to(obj, {
        v: target,
        duration: 1.2,
        ease: EASE,
        scrollTrigger: { trigger: el, start: "top 90%", once: true },
        onUpdate: () => {
          el.textContent = fmt(obj.v);
        },
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
