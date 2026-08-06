"use client";

import { useId } from "react";

/**
 * Иконка «i» с всплывающей подсказкой.
 * Только CSS: открывается по наведению (desktop) и по фокусу/тапу (mobile).
 * Визуальный кружок 20px, тап-таргет расширен псевдоэлементом до 40px.
 */
export function InfoTooltip({ text }: { text: string }) {
  const id = useId();
  return (
    <span className="group relative inline-flex shrink-0">
      <button
        type="button"
        aria-label="Подробнее"
        aria-describedby={id}
        className="relative flex h-5 w-5 items-center justify-center rounded-full border border-border text-xs text-muted before:absolute before:-inset-2.5 before:content-[''] hover:border-ink hover:text-ink focus-visible:border-ink focus-visible:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
      >
        i
      </button>
      <span
        id={id}
        role="tooltip"
        className="pointer-events-none invisible absolute bottom-full right-0 z-20 mb-2 w-80 whitespace-pre-line rounded-lg border border-border bg-bg p-3.5 text-left text-xs leading-relaxed text-ink-2 opacity-0 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100"
      >
        {text}
      </span>
    </span>
  );
}
