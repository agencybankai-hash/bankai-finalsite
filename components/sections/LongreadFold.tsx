"use client";

import { useId, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { reachGoal } from "@/components/analytics/YandexMetrika";

/**
 * Свёрнутая часть лонгрида. Скрытие только визуальное - обрезка по высоте:
 * текст целиком в HTML сервера, кнопка его просто открывает (Google разрешает
 * такой раскрываемый контент). Высота свёрнутого блока фиксированная, поэтому
 * при гидратации макет не сдвигается.
 */
export function LongreadFold({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const ref = useRef<HTMLDivElement>(null);

  const toggle = () => {
    if (open) {
      setOpen(false);
      // После сворачивания кнопка уезжает вверх - возвращаем её в поле зрения
      requestAnimationFrame(() => ref.current?.scrollIntoView({ block: "nearest" }));
    } else {
      setOpen(true);
      reachGoal("longread_expand");
    }
  };

  return (
    <>
      <div
        id={id}
        ref={ref}
        // Клавиатура: фокус на ссылке внутри свёрнутой части раскрывает текст
        onFocus={() => setOpen(true)}
        className={cn("relative", !open && "max-h-28 overflow-hidden")}
      >
        {children}
        {!open && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-linear-to-b from-transparent to-bg"
          />
        )}
      </div>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={toggle}
        data-cursor
        className="mt-6 inline-flex h-10 items-center justify-center rounded-md border border-border bg-bg px-4 text-sm font-medium text-ink transition duration-300 ease-osmo hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
      >
        {open ? "Свернуть" : "Читать полностью"}
      </button>
    </>
  );
}
