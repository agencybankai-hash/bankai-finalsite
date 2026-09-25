"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { reachGoal } from "@/components/analytics/YandexMetrika";

const HEADER_OFFSET = 88; // высота липкой шапки + воздух (как в GuideToc)

// Прыжок без smooth: с Lenis нативный smooth-скролл ненадёжен, instant стабилен
function scrollToY(y: number) {
  window.scrollTo({ top: Math.max(0, y), behavior: "instant" as ScrollBehavior });
}

const button =
  "inline-flex h-10 items-center justify-center gap-2 rounded-md border border-border bg-bg px-4 text-sm font-medium text-ink transition duration-300 ease-osmo hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg";

// Прокрутка к разделу статьи и фокус на его заголовок (для клавиатуры)
function goTo(article: HTMLElement | null, target: string) {
  const el = document.getElementById(target);
  if (!el || !article?.contains(el)) return;
  scrollToY(el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET);
  el.focus({ preventScroll: true });
}

function Arrow({ up }: { up: boolean }) {
  return (
    <span
      aria-hidden
      className={cn("text-muted transition-transform duration-300 ease-osmo", up && "rotate-180")}
    >
      ↓
    </span>
  );
}

/**
 * Свёрнутая статья лонгрида с оглавлением. Десктоп: слева вводка и кнопка,
 * справа оглавление; мобайл - столбиком. Скрытие только визуальное - высота 0:
 * текст целиком в HTML сервера (Google разрешает такой раскрываемый контент),
 * пока свёрнут - inert, без фокуса. Строка оглавления (a[data-longread-jump])
 * раскрывает статью и ведёт к разделу; ссылка с якорем на раздел раскрывает
 * статью при загрузке.
 */
export function LongreadFold({
  lead,
  toc,
  children,
}: {
  lead: React.ReactNode;
  toc: React.ReactNode;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const root = useRef<HTMLDivElement>(null);
  const article = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  // Раздел, к которому перейти, когда статья получит высоту
  const pending = useRef<string | null>(null);

  useLayoutEffect(() => {
    if (!open || !pending.current) return;
    goTo(article.current, pending.current);
    pending.current = null;
  }, [open]);

  // Пришли по ссылке на раздел (#s-…) - раскрываем статью сразу
  useEffect(() => {
    const target = decodeURIComponent(window.location.hash.slice(1));
    const el = target && document.getElementById(target);
    if (el && article.current?.contains(el)) {
      pending.current = target;
      setOpen(true);
    }
  }, []);

  const onClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const a = (e.target as Element).closest<HTMLAnchorElement>("a[data-longread-jump]");
    // Ctrl/Cmd-клик по строке оглавления - как у обычной ссылки
    if (!a || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    const target = decodeURIComponent(a.hash.slice(1));
    if (open) {
      goTo(article.current, target);
      return;
    }
    pending.current = target;
    setOpen(true);
    reachGoal("longread_expand");
  };

  const toggle = () => {
    if (open) {
      setOpen(false);
      return;
    }
    setOpen(true);
    reachGoal("longread_expand");
  };

  // Нижняя кнопка: после сворачивания страница короче на всю статью -
  // возвращаем начало блока в поле зрения и фокус на верхнюю кнопку
  const collapse = () => {
    setOpen(false);
    requestAnimationFrame(() => {
      const top = root.current?.getBoundingClientRect().top ?? 0;
      scrollToY(top + window.scrollY - HEADER_OFFSET);
      toggleRef.current?.focus({ preventScroll: true });
    });
  };

  return (
    <div ref={root} onClick={onClick}>
      <div className="grid gap-y-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:grid-rows-[auto_1fr] lg:gap-x-16">
        <div className="max-w-2xl lg:col-start-1 lg:row-start-1">{lead}</div>
        <div className="max-w-2xl lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:max-w-none">
          {toc}
        </div>
        <div className="lg:col-start-1 lg:row-start-2">
          <button
            ref={toggleRef}
            type="button"
            aria-expanded={open}
            aria-controls={id}
            onClick={toggle}
            data-cursor
            className={button}
          >
            {open ? "Свернуть" : "Читать полностью"}
            <Arrow up={open} />
          </button>
        </div>
      </div>

      <div id={id} ref={article} inert={!open} className={open ? "mt-14" : "h-0 overflow-hidden"}>
        {children}
      </div>

      {open && (
        <button
          type="button"
          aria-expanded={open}
          aria-controls={id}
          onClick={collapse}
          data-cursor
          className={cn(button, "mt-12")}
        >
          Свернуть
          <Arrow up />
        </button>
      )}
    </div>
  );
}
