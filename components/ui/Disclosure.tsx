"use client";

import { useId, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Раскрывающийся блок вместо нативного <details>: плавная анимация высоты
 * (grid-template-rows 0fr → 1fr, работает во всех браузерах), плюсик
 * поворачивается в крестик, без маркера и без синей рамки по клику
 * (кольцо фокуса только с клавиатуры). Контент всегда в DOM, только
 * визуально свёрнут - текст виден поисковикам.
 * data-open на корне - для стилей открытого состояния снаружи.
 */
export function Disclosure({
  label,
  children,
  className,
  buttonClassName,
  panelClassName,
  iconClassName,
  defaultOpen = false,
}: {
  label: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  buttonClassName?: string;
  panelClassName?: string;
  /** Размер плюсика, напр. text-lg / text-xl. */
  iconClassName?: string;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const id = useId();

  return (
    <div className={className} data-open={open}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex w-full cursor-pointer items-center justify-between gap-4 text-left",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg rounded-lg",
          buttonClassName,
        )}
      >
        {/* Фрагмент не убирать: label с сервера может прийти ленивым RSC-чанком, и без обёртки React требует у него key. */}
        <>{label}</>
        <span
          aria-hidden
          className={cn(
            "shrink-0 leading-none text-muted transition-transform duration-300 ease-osmo motion-reduce:transition-none",
            iconClassName,
            open && "rotate-45",
          )}
        >
          +
        </span>
      </button>
      <div
        id={id}
        className="grid transition-[grid-template-rows] duration-300 ease-osmo motion-reduce:transition-none"
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
      >
        <div className="min-h-0 overflow-hidden">
          <div
            className={cn(
              "transition-opacity duration-300 ease-osmo motion-reduce:transition-none",
              open ? "opacity-100" : "opacity-0",
              panelClassName,
            )}
            aria-hidden={!open}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
