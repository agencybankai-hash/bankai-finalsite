import Link from "next/link";
import { Pill } from "@/components/ui/Pill";
import { cn } from "@/lib/utils";
import { landings } from "@/content/landings";
import { introFacts } from "@/content/intro-facts";
import type { ServiceChannel, ServiceLanding } from "@/content/types";

export type Crumb = {
  label: string;
  href: string;
  /** Подпись текущей страницы в пилюле: город или подуслуга. В BreadcrumbList идёт label. */
  short?: string;
};

/**
 * Цепочка страницы услуги: Главная → канал → [подуслуга] → лендинг.
 * Один источник и для видимых крошек, и для BreadcrumbList - подписи родителей
 * гео-нейтральные (`navLabel`), а не `title` с городом. Подуслуга в цепочке -
 * у городовой версии подуслуги: «Создание лендинга в Алматы» → «Лендинги».
 * Пилюля текущей страницы - её город (тот же, что в чипе «Гео» интро-полосы)
 * или название подуслуги.
 */
export function serviceCrumbs(
  channel: ServiceChannel,
  landing: ServiceLanding,
): Crumb[] {
  const parent = landing.parent
    ? landings.find((l) => l.slug === landing.parent)
    : undefined;
  return [
    { label: "Главная", href: "/" },
    { label: channel.navLabel, href: `/services/${channel.slug}` },
    ...(parent
      ? [{ label: parent.navLabel ?? parent.hero.title, href: parent.path }]
      : []),
    {
      label: landing.hero.title,
      href: landing.path,
      short: introFacts(channel, landing).geo ?? landing.navLabel,
    },
  ];
}

/**
 * Хлебные крошки в hero, над заголовком: родители - ссылками, текущая
 * страница - пилюлей. На мобиле видны ссылка на родителя и пилюля, остальные
 * крошки скрыты только визуально - скринридер читает всю цепочку.
 */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const parent = items.length - 2;
  return (
    <nav aria-label="Хлебные крошки">
      <ol className="flex flex-wrap items-center gap-2 text-sm text-muted">
        {items.map((it, i) => {
          const last = i === items.length - 1;
          return (
            <li
              key={it.href}
              className={cn(
                "flex items-center gap-x-2",
                !last && i !== parent && "max-sm:sr-only",
              )}
            >
              {last ? (
                <span aria-current="page">
                  <Pill variant="soft" size="sm" className="uppercase tracking-wide">
                    {it.short ?? it.label}
                  </Pill>
                </span>
              ) : (
                <Link
                  href={it.href}
                  className="inline-flex items-center gap-1.5 py-1 text-ink-2 transition duration-300 ease-osmo hover:text-ink"
                >
                  {i === parent && (
                    <span aria-hidden className="sm:hidden">
                      ←
                    </span>
                  )}
                  {it.label}
                </Link>
              )}
              {!last && (
                <span aria-hidden className="max-sm:hidden">
                  /
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
