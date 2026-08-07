"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { siteMeta } from "@/content/site";
import { ui } from "@/content/ui";
import type { Locale } from "@/content/types";
import { switchHref } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/* Подпись языка - на нём самом, чтобы читалась в любой локали. */
const localeName: Record<Locale, string> = { ru: "Русский", en: "English" };

/** Переключатель локали: текущая - статикой, вторая - ссылкой на парную страницу. */
function LocaleSwitch({
  locale,
  href,
  className,
  onNavigate,
}: {
  locale: Locale;
  href: string;
  className?: string;
  onNavigate?: () => void;
}) {
  const other: Locale = locale === "en" ? "ru" : "en";
  return (
    <div className={cn("flex items-center gap-1.5 text-xs font-medium", className)}>
      <span className="text-ink">{locale.toUpperCase()}</span>
      <span aria-hidden className="text-border">
        /
      </span>
      <Link
        href={href}
        hrefLang={other}
        aria-label={localeName[other]}
        onClick={onNavigate}
        className="text-muted hover:text-ink"
      >
        {other.toUpperCase()}
      </Link>
    </div>
  );
}

export function Header({ locale = "ru" }: { locale?: Locale }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { nav, headerCta, home, tagline, menuLabel } = ui(locale);
  const otherLocaleHref = switchHref(pathname, locale);

  const isActive = (href: string) =>
    href === home ? pathname === home : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg/90 backdrop-blur">
      <Container>
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Логотип */}
          <Link href={home} className="flex items-center gap-2" onClick={() => setOpen(false)}>
            <span className="text-lg font-semibold tracking-tight text-ink">
              {siteMeta.name}
            </span>
            <span className="hidden text-xs text-muted sm:inline">
              {tagline}
            </span>
          </Link>

          {/* Десктоп-навигация */}
          <nav className="hidden items-center gap-1 lg:flex">
            {nav.map((item) =>
              item.children ? (
                <div key={item.href} className="group relative">
                  <Link
                    href={item.href}
                    className={cn(
                      "inline-flex h-9 items-center gap-1 rounded-md px-3 text-sm text-ink-2 hover:text-ink",
                      isActive(item.href) && "text-ink",
                    )}
                  >
                    {item.label}
                    <span aria-hidden className="text-muted">
                      ▾
                    </span>
                  </Link>
                  <div className="invisible absolute left-0 top-full w-64 translate-y-1 pt-2 opacity-0 transition duration-300 ease-osmo group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                    <ul className="rounded-xl border border-border bg-bg p-1">
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            className={cn(
                              "block rounded-lg px-3 py-2 text-sm text-ink-2 hover:bg-surface hover:text-ink",
                              pathname === child.href && "bg-surface text-ink",
                            )}
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "inline-flex h-9 items-center rounded-md px-3 text-sm text-ink-2 hover:text-ink",
                    isActive(item.href) && "text-ink",
                  )}
                >
                  {item.label}
                </Link>
              ),
            )}
          </nav>

          <div className="hidden items-center gap-4 lg:flex">
            <LocaleSwitch locale={locale} href={otherLocaleHref} />
            <Button href={headerCta.href} variant="accent">
              {headerCta.label}
            </Button>
          </div>

          {/* Бургер */}
          <button
            type="button"
            aria-label={menuLabel}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border text-ink lg:hidden"
          >
            <span className="text-lg">{open ? "✕" : "☰"}</span>
          </button>
        </div>
      </Container>

      {/* Мобильное меню: высота ограничена окном за вычетом шапки (h-16) */}
      {open && (
        <div
          data-lenis-prevent
          className="max-h-[calc(100dvh-4rem)] overflow-y-auto border-t border-border bg-bg lg:hidden"
        >
          <Container>
            <nav className="flex flex-col gap-1 py-4">
              {nav.map((item) => (
                <div key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "block rounded-md px-3 py-2 text-base font-medium text-ink",
                      isActive(item.href) && "bg-surface",
                    )}
                  >
                    {item.label}
                  </Link>
                  {item.children && (
                    <div className="ml-3 flex flex-col gap-1 border-l border-border pl-3">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={() => setOpen(false)}
                          className="block rounded-md px-3 py-2 text-sm text-ink-2 hover:text-ink"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div className="px-3 pt-3">
                <Button href={headerCta.href} variant="accent" className="w-full">
                  {headerCta.label}
                </Button>
              </div>
              <LocaleSwitch
                locale={locale}
                href={otherLocaleHref}
                className="justify-center px-3 pt-4 text-sm"
                onNavigate={() => setOpen(false)}
              />
            </nav>
          </Container>
        </div>
      )}
    </header>
  );
}
