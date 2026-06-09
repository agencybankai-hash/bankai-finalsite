import Link from "next/link";
import { Pill } from "@/components/ui/Pill";
import { Reveal } from "@/components/motion/Reveal";
import type { CaseStudy } from "@/content/types";

/**
 * Карточки кейсов без превью-картинки (реальных нет): визуальный фокус —
 * на результате (метрики крупно), это и есть «картинка» для секции
 * «Результаты». Hover-lift + стрелка, reveal-каскад.
 */
export function CaseGrid({ items }: { items: CaseStudy[] }) {
  return (
    <Reveal stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((c) => (
        <Link
          key={c.slug}
          href={`/cases/${c.slug}`}
          data-reveal
          className="group flex flex-col rounded-xl border border-border bg-bg p-7 shadow-card transition duration-300 ease-osmo hover:-translate-y-1 hover:border-ink hover:shadow-card-hover"
        >
          <div className="flex flex-wrap gap-2">
            {c.template && (
              <Pill variant="solid" size="sm">
                Образец
              </Pill>
            )}
            {c.inProgress && (
              <Pill size="sm" className="bg-accent text-accent-fg">
                В работе
              </Pill>
            )}
            {c.channels.map((ch) => (
              <Pill key={ch} variant="outline" size="sm">
                {ch}
              </Pill>
            ))}
          </div>

          <h3 className="mt-6 text-xl font-semibold tracking-tight text-ink">
            {c.client}
          </h3>
          <div className="mt-1 text-sm text-muted">
            {c.industry} · {c.geo}
          </div>
          <p className="mt-3 text-sm leading-relaxed text-ink-2">{c.teaser}</p>

          <div className="mt-auto grid grid-cols-2 gap-4 border-t border-border pt-6">
            {c.cardMetrics.map((m) => (
              <div key={m.label}>
                <div className="text-2xl font-semibold tracking-tight text-ink">
                  {m.value}
                </div>
                <div className="mt-1 text-xs leading-snug text-ink-2">
                  {m.label}
                </div>
              </div>
            ))}
          </div>

          <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-ink">
            Смотреть кейс
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
