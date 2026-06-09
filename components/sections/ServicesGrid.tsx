import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { IconBadge } from "@/components/ui/IconBadge";
import { Icon, type IconName } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

type ServiceCard = {
  title: string;
  text: string;
  href: string;
  featured?: boolean;
  icon?: IconName;
  price?: string;
  bullets?: string[];
};

/** Карточки-тарифы услуг (донор metatag #4): icon-бейдж, коралл-чек-буллеты,
 *  цена «от X» и «Подробнее». Вся карточка — ссылка на посадочную. */
export function ServicesGrid({ cards }: { cards: ServiceCard[] }) {
  return (
    <Reveal stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((c) => (
        <Link
          key={c.href}
          href={c.href}
          data-reveal
          className={cn(
            "group flex flex-col rounded-xl border border-border bg-bg p-7 shadow-card transition duration-300 ease-osmo hover:-translate-y-1 hover:border-ink hover:shadow-card-hover",
            c.featured && "bg-surface",
          )}
        >
          {c.icon && <IconBadge icon={c.icon} size="lg" className="mb-5" />}
          <h3 className="text-lg font-semibold tracking-tight text-ink">
            {c.title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-ink-2">{c.text}</p>

          {c.bullets && (
            <ul className="mt-5 space-y-2.5">
              {c.bullets.map((b) => (
                <li key={b} className="flex gap-2.5 text-sm text-ink-2">
                  <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-auto pt-6">
            {c.price && (
              <div className="text-base font-semibold tracking-tight text-ink">
                {c.price}
              </div>
            )}
            <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-ink">
              Подробнее
              <span
                aria-hidden
                className="transition-transform duration-300 ease-osmo group-hover:translate-x-1"
              >
                →
              </span>
            </span>
          </div>
        </Link>
      ))}
    </Reveal>
  );
}
