import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { cn } from "@/lib/utils";

type ServiceCard = {
  title: string;
  text: string;
  href: string;
  featured?: boolean;
};

export function ServicesGrid({ cards }: { cards: ServiceCard[] }) {
  return (
    <Reveal stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((c) => (
        <Link
          key={c.href}
          href={c.href}
          data-reveal
          className={cn(
            "group flex flex-col justify-between rounded-xl border border-border bg-bg p-7 transition duration-300 ease-osmo hover:-translate-y-1 hover:border-ink",
            c.featured && "bg-surface",
          )}
        >
          <div>
            <h3 className="text-lg font-semibold tracking-tight text-ink">
              {c.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-2">{c.text}</p>
          </div>
          <span className="mt-8 inline-flex items-center gap-1.5 text-sm font-medium text-ink">
            Подробнее
            <span
              aria-hidden
              className="transition-transform duration-300 ease-osmo group-hover:translate-x-1"
            >
              →
            </span>
          </span>
        </Link>
      ))}
    </Reveal>
  );
}
