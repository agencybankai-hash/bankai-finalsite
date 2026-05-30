"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import type { GuideSection } from "@/lib/guide-toc";

const HEADER_OFFSET = 88; // высота липкой шапки + воздух (≈ scroll-margin-top)

// Прыжок к разделу. Объектная форма с behavior - в этом окружении 2-арг
// scrollTo и нативный smooth-якорь ненадёжны; instant работает стабильно.
function scrollToY(targetY: number) {
  window.scrollTo({ top: Math.max(0, targetY), behavior: "instant" as ScrollBehavior });
}

export function GuideToc({ sections }: { sections: GuideSection[] }) {
  const [active, setActive] = useState("");

  useEffect(() => {
    if (!sections.length) return;
    // Активен последний заголовок, ушедший под шапку (надёжнее IO без слепых зон).
    const compute = () => {
      let current = sections[0].id;
      for (const s of sections) {
        const el = document.getElementById(s.id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= HEADER_OFFSET + 8) current = s.id;
        else break;
      }
      setActive(current);
    };
    compute();
    window.addEventListener("scroll", compute, { passive: true });
    window.addEventListener("resize", compute);
    return () => {
      window.removeEventListener("scroll", compute);
      window.removeEventListener("resize", compute);
    };
  }, [sections]);

  function onLinkClick(e: React.MouseEvent<HTMLAnchorElement>, id: string) {
    const el = document.getElementById(id);
    if (el) {
      // explicit-скролл: нативная навигация по якорю в App Router + smooth ненадёжна
      e.preventDefault();
      const y = el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
      scrollToY(y);
      history.pushState(null, "", `#${id}`);
      setActive(id);
    }
    const d = e.currentTarget.closest("details");
    if (d) d.open = false; // на мобайле закрываем «Содержание» после выбора
  }

  const list = (
    <ul className="space-y-0.5">
      {sections.map((s) => (
        <li key={s.id}>
          <a
            href={`#${s.id}`}
            onClick={(e) => onLinkClick(e, s.id)}
            className={cn(
              "block border-l-2 py-1 pl-3 text-sm leading-snug transition-colors",
              active === s.id
                ? "border-ink font-medium text-ink"
                : "border-transparent text-ink-2 hover:text-ink",
            )}
          >
            {s.label}
          </a>
        </li>
      ))}
    </ul>
  );

  return (
    <>
      {/* Мобайл/планшет: сворачиваемое «Содержание» */}
      <details className="rounded-xl border border-border bg-surface lg:hidden">
        <summary className="cursor-pointer select-none px-4 py-3 text-sm font-medium text-ink">
          Содержание
        </summary>
        <nav className="border-t border-border px-3 py-3">{list}</nav>
      </details>

      {/* Десктоп: липкий сайдбар */}
      <nav className="hidden lg:sticky lg:top-24 lg:block lg:max-h-[calc(100vh-7rem)] lg:overflow-auto">
        <div className="mb-3 text-xs font-medium uppercase tracking-wide text-muted">
          Содержание
        </div>
        {list}
      </nav>
    </>
  );
}
