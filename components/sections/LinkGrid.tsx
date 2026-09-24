import Link from "next/link";
import { cn } from "@/lib/utils";
import { SectionHeader } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { Emblem } from "@/components/illustrations/emblems/Emblem";
import { emblemForHref } from "@/components/illustrations/resolve";
import type { Cta } from "@/content/types";

/** Строка-ссылка на услугу: эмблема темы страницы, подпись, стрелка. */
export function LinkRow({
  href,
  label,
  className,
  reveal = false,
}: {
  href: string;
  label: string;
  className?: string;
  /** Цель каскада Reveal-обёртки. */
  reveal?: boolean;
}) {
  const emblem = emblemForHref(href);
  return (
    <Link
      href={href}
      data-reveal={reveal || undefined}
      className={cn(
        "group flex items-center gap-4 rounded-xl border border-border bg-bg px-5 py-4 text-base text-ink shadow-card transition duration-300 ease-osmo hover:border-ink hover:shadow-card-hover",
        className,
      )}
    >
      {emblem && <Emblem name={emblem.name} geo={emblem.geo} />}
      <span className="min-w-0 flex-1">{label}</span>
      <span
        aria-hidden
        className="text-muted transition-transform duration-300 ease-osmo group-hover:translate-x-1"
      >
        →
      </span>
    </Link>
  );
}

/** Сетка ссылок внизу страницы услуги: подуслуги, города, смежные страницы. */
export function LinkGrid({ title, links }: { title: string; links: Cta[] }) {
  return (
    <div>
      <SectionHeader title={title} />
      <Reveal stagger className="mt-8 grid gap-3 sm:grid-cols-2">
        {links.map((l) => (
          <LinkRow key={l.href} href={l.href} label={l.label} reveal />
        ))}
      </Reveal>
    </div>
  );
}
