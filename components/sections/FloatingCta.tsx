"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { contacts, headerCta, floatingCta } from "@/content/site";

/* Скрываем там, где CTA избыточен: страница контактов (форма) и легал. */
const HIDDEN_PREFIXES = ["/contacts", "/privacy", "/terms"];

export function FloatingCta() {
  const pathname = usePathname();
  const [closed, setClosed] = useState(false);
  // Десктоп-карточку показываем после ухода hero (~0.8 экрана), чтобы не
  // дублировать hero-CTA и не конфликтовать с правой колонкой hero.
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () =>
      setScrolled(window.scrollY > window.innerHeight * 0.8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  if (HIDDEN_PREFIXES.some((p) => pathname.startsWith(p))) return null;

  return (
    <>
      {/* Спейсер: чтобы фикс-бар на мобилке не перекрывал футер */}
      <div className="h-20 lg:hidden" aria-hidden />

      {/* Десктоп: баннер-композиция (инвертированная карточка) — после hero */}
      {scrolled && !closed && (
        <div className="fixed bottom-6 right-6 z-40 hidden w-80 rounded-2xl bg-ink p-5 text-bg shadow-xl shadow-ink/25 lg:block">
          <div className="flex items-start justify-between gap-3">
            <span className="inline-flex items-center rounded-full border border-bg/25 px-2.5 py-1 text-xs font-medium uppercase tracking-wide text-bg/80">
              {floatingCta.eyebrow}
            </span>
            <button
              type="button"
              aria-label="Закрыть"
              onClick={() => setClosed(true)}
              className="-mr-1 -mt-1 inline-flex h-7 w-7 items-center justify-center rounded-md text-bg/50 hover:bg-bg/10 hover:text-bg"
            >
              ✕
            </button>
          </div>

          <p className="mt-4 text-xl font-semibold leading-tight">
            {floatingCta.title}
          </p>

          <ul className="mt-4 space-y-2.5 rounded-xl bg-bg/5 p-4">
            {floatingCta.items.map((it) => (
              <li
                key={it}
                className="flex gap-2.5 text-sm leading-snug text-bg/75"
              >
                <span
                  aria-hidden
                  className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-bg/15 text-[10px] font-semibold text-bg"
                >
                  ✓
                </span>
                {it}
              </li>
            ))}
          </ul>

          <Link
            href={headerCta.href}
            className="group mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-bg px-4 text-sm font-semibold text-ink hover:bg-surface"
          >
            {headerCta.label}
            <span
              aria-hidden
              className="transition-transform group-hover:translate-x-0.5"
            >
              →
            </span>
          </Link>
        </div>
      )}

      {/* Мобилка: фиксированный нижний бар */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-bg/95 backdrop-blur lg:hidden">
        <div
          className="flex gap-3 px-4 py-3"
          style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
        >
          <Link
            href={headerCta.href}
            className="inline-flex h-11 flex-1 items-center justify-center rounded-lg bg-ink px-4 text-sm font-medium text-bg hover:bg-ink-2"
          >
            {headerCta.label}
          </Link>
          <a
            href={contacts.telegramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 flex-1 items-center justify-center rounded-lg border border-border bg-bg px-4 text-sm font-medium text-ink hover:bg-surface"
          >
            Telegram
          </a>
        </div>
      </div>
    </>
  );
}
