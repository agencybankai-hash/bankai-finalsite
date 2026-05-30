"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { prefersReducedMotion, EASE } from "@/lib/motion";

/**
 * Кастомный курсор: точка, догоняющая мышь с инерцией (quickTo),
 * растёт на интерактиве ([data-cursor], a, button).
 * Только pointer:fine; на тач и reduced-motion выключен.
 * Нативный курсор не прячем (доступность форм).
 */
export function Cursor() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const dot = ref.current;
    if (!dot) return;

    if (
      prefersReducedMotion() ||
      !window.matchMedia("(pointer: fine)").matches
    ) {
      gsap.set(dot, { display: "none" });
      return;
    }

    gsap.set(dot, { xPercent: -50, yPercent: -50 });
    const xTo = gsap.quickTo(dot, "x", { duration: 0.4, ease: "power3" });
    const yTo = gsap.quickTo(dot, "y", { duration: 0.4, ease: "power3" });

    let shown = false;
    const move = (e: MouseEvent) => {
      if (!shown) {
        gsap.to(dot, { autoAlpha: 1, duration: 0.2 });
        shown = true;
      }
      xTo(e.clientX);
      yTo(e.clientY);
    };
    const isInteractive = (t: EventTarget | null) =>
      t instanceof Element && !!t.closest("[data-cursor], a, button");
    const over = (e: MouseEvent) => {
      if (isInteractive(e.target))
        gsap.to(dot, { scale: 2.6, duration: 0.3, ease: EASE });
    };
    const out = (e: MouseEvent) => {
      if (isInteractive(e.target))
        gsap.to(dot, { scale: 1, duration: 0.3, ease: EASE });
    };

    window.addEventListener("mousemove", move);
    document.addEventListener("mouseover", over);
    document.addEventListener("mouseout", out);
    return () => {
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseover", over);
      document.removeEventListener("mouseout", out);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[90] hidden h-2.5 w-2.5 rounded-full bg-accent opacity-0 md:block"
    />
  );
}
