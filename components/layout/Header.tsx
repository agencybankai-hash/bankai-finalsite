"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { nav, headerCta, siteMeta } from "@/content/site";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg/90 backdrop-blur">
      <Container>
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Логотип */}
          <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
            <span className="text-lg font-semibold tracking-tight text-ink">
              {siteMeta.name}
            </span>
            <span className="hidden text-xs text-muted sm:inline">
              {siteMeta.tagline}
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
                  <div className="invisible absolute left-0 top-full w-64 translate-y-1 pt-2 opacity-0 transition duration-300 ease-osmo group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
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

          <div className="hidden lg:block">
            <Button href={headerCta.href} variant="accent">
              {headerCta.label}
            </Button>
          </div>

          {/* Бургер */}
          <button
            type="button"
            aria-label="Меню"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border text-ink lg:hidden"
          >
            <span className="text-lg">{open ? "✕" : "☰"}</span>
          </button>
        </div>
      </Container>

      {/* Мобильное меню */}
      {open && (
        <div className="border-t border-border bg-bg lg:hidden">
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
            </nav>
          </Container>
        </div>
      )}
    </header>
  );
}
