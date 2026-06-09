import { SplitReveal } from "@/components/motion/SplitReveal";
import type { Testimonial } from "@/content/types";

/**
 * Отзывы: цитата — фокус, раскрывается построчно из-под маски на скролле
 * (донор Osmo «Line Reveal Testimonials»). Аватары убраны (отзывы
 * обезличены), акцент-штрих сверху. Атрибуция под разделителем.
 */
export function Testimonials({ items }: { items: Testimonial[] }) {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {items.map((t) => (
        <figure
          key={t.role}
          className="flex flex-col rounded-xl border border-border bg-bg p-7 shadow-card"
        >
          <div aria-hidden className="mb-5 flex gap-0.5 text-accent">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} className="text-sm">
                ★
              </span>
            ))}
          </div>
          <blockquote className="flex-1">
            <SplitReveal
              as="p"
              trigger="scroll"
              className="text-lg leading-relaxed text-ink"
            >
              «{t.quote}»
            </SplitReveal>
          </blockquote>
          <figcaption className="mt-8 border-t border-border pt-5">
            <div className="text-sm font-medium text-ink">{t.author}</div>
            <div className="mt-0.5 text-sm text-ink-2">{t.role}</div>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
