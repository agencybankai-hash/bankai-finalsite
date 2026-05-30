import Link from "next/link";
import { cn } from "@/lib/utils";

type ServiceCard = {
  title: string;
  text: string;
  href: string;
  featured?: boolean;
};

export function ServicesGrid({ cards }: { cards: ServiceCard[] }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((c) => (
        <Link
          key={c.href}
          href={c.href}
          className={cn(
            "group flex flex-col justify-between rounded-xl border border-border bg-bg p-6 hover:border-ink",
            c.featured && "sm:col-span-2 lg:col-span-1 bg-surface",
          )}
        >
          <div>
            <h3 className="text-base font-semibold text-ink">{c.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-2">{c.text}</p>
          </div>
          <span className="mt-6 text-sm font-medium text-ink">
            Подробнее →
          </span>
        </Link>
      ))}
    </div>
  );
}
