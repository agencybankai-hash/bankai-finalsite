"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { registerGsap, prefersReducedMotion, EASE, DUR } from "@/lib/motion";

/**
 * template.tsx ремаунтится на каждую навигацию → enter-анимация
 * контента при переходе между страницами. Конверсионно-безопасно:
 * быстро, без блокировки. reduced-motion → без движения.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      registerGsap();
      const el = ref.current;
      if (!el || prefersReducedMotion()) return;
      gsap.from(el, { autoAlpha: 0, y: 16, duration: DUR.base, ease: EASE });
    },
    { scope: ref },
  );

  return <div ref={ref}>{children}</div>;
}
