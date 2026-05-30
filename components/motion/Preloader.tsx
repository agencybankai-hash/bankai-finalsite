"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { registerGsap, prefersReducedMotion, EASE, markIntroDone } from "@/lib/motion";

/**
 * Прелоадер-заставка. Играет на каждой полной загрузке (на внутренних
 * SPA-переходах не ремаунтится → не мешает). Гарантированно мягкая,
 * ~2с, по времени (не по реальному прогрессу) — стильный интро-жест.
 * В момент подъёма занавеса вызывает markIntroDone() → первый экран
 * раскрывается синхронно с уходом занавеса. reduced-motion → мгновенно.
 */
export function Preloader() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      registerGsap();
      const el = ref.current;
      if (!el) return;

      if (prefersReducedMotion()) {
        gsap.set(el, { display: "none" });
        markIntroDone();
        return;
      }

      const word = el.querySelector("[data-pl-word]");
      const bar = el.querySelector("[data-pl-bar]");

      const tl = gsap.timeline({
        onComplete: () => gsap.set(el, { display: "none" }),
      });
      tl.from(word, { yPercent: 110, duration: 0.8, ease: EASE }, 0.1)
        .to(bar, { scaleX: 1, duration: 1.0, ease: "power1.inOut" }, 0.2)
        // занавес уходит вверх; ровно в этот момент открываем первый экран
        .to(
          el,
          {
            yPercent: -100,
            duration: 0.8,
            ease: EASE,
            onStart: markIntroDone,
          },
          1.35,
        );
    },
    { scope: ref },
  );

  return (
    <div
      ref={ref}
      aria-hidden
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-6 overflow-hidden bg-ink text-bg"
    >
      <span className="overflow-hidden">
        <span
          data-pl-word
          className="block text-h1 font-semibold tracking-tight"
        >
          Bankai
        </span>
      </span>
      <span className="relative h-px w-40 overflow-hidden bg-bg/15">
        <span
          data-pl-bar
          className="absolute inset-y-0 left-0 w-full origin-left scale-x-0 bg-accent"
        />
      </span>
    </div>
  );
}
