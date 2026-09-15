"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/motion";

/**
 * Кастомный курсор: точка, догоняющая мышь с инерцией (lerp в rAF),
 * растёт на интерактиве ([data-cursor], a, button) через CSS-класс.
 * Только pointer:fine; на тач и reduced-motion выключен - тогда ни
 * слушателей, ни цикла. Нативный курсор не прячем (доступность форм).
 */
export function Cursor() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = ref.current;
    if (!dot || prefersReducedMotion() || !window.matchMedia("(pointer: fine)").matches) {
      return;
    }

    let tx = 0, ty = 0, x = 0, y = 0;
    let shown = false;
    let raf = 0;
    let running = false;

    const loop = () => {
      x += (tx - x) * 0.18;
      y += (ty - y) * 0.18;
      dot.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
      if (Math.abs(tx - x) > 0.1 || Math.abs(ty - y) > 0.1) raf = requestAnimationFrame(loop);
      else running = false;
    };
    const move = (e: MouseEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      if (!shown) {
        x = tx;
        y = ty;
        dot.classList.add("is-visible");
        shown = true;
      }
      if (!running) {
        running = true;
        raf = requestAnimationFrame(loop);
      }
    };
    const isInteractive = (t: EventTarget | null) =>
      t instanceof Element && !!t.closest("[data-cursor], a, button");
    const over = (e: MouseEvent) => {
      if (isInteractive(e.target)) dot.classList.add("is-active");
    };
    const out = (e: MouseEvent) => {
      if (isInteractive(e.target)) dot.classList.remove("is-active");
    };

    window.addEventListener("mousemove", move, { passive: true });
    document.addEventListener("mouseover", over);
    document.addEventListener("mouseout", out);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseover", over);
      document.removeEventListener("mouseout", out);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="cursor-dot pointer-events-none fixed left-0 top-0 z-[90] hidden h-2.5 w-2.5 rounded-full bg-accent md:block"
    />
  );
}
