import Link from "next/link";
import { Container } from "@/components/ui/Container";
import type { ServiceChannel, ServiceLanding } from "@/content/types";

export type Crumb = { label: string; href: string };

/**
 * Цепочка страницы услуги: Главная → канал → лендинг.
 * Один источник и для видимых крошек, и для BreadcrumbList - подпись родителя
 * берём гео-нейтральной (`navLabel`), а не из `title` с городом.
 */
export function serviceCrumbs(
  channel: ServiceChannel,
  landing: ServiceLanding,
): Crumb[] {
  return [
    { label: "Главная", href: "/" },
    { label: channel.navLabel, href: `/services/${channel.slug}` },
    { label: landing.hero.title, href: landing.path },
  ];
}

/** Видимые хлебные крошки: последний элемент - текущая страница, не ссылка. */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Хлебные крошки" className="border-b border-border bg-surface">
      <Container>
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 py-3 text-sm text-muted">
          {items.map((it, i) => {
            const last = i === items.length - 1;
            return (
              <li key={it.href} className="flex items-center gap-x-2">
                {last ? (
                  <span aria-current="page">{it.label}</span>
                ) : (
                  <Link
                    href={it.href}
                    className="text-ink-2 transition duration-300 ease-osmo hover:text-ink"
                  >
                    {it.label}
                  </Link>
                )}
                {!last && <span aria-hidden>/</span>}
              </li>
            );
          })}
        </ol>
      </Container>
    </nav>
  );
}
