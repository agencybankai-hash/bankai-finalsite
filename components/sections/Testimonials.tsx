import { Reveal } from "@/components/motion/Reveal";
import type { Testimonial } from "@/content/types";

/**
 * Отзывы: цитата — фокус, карточка мягко проявляется на скролле
 * (построчная маска в DS зарезервирована за крупными заголовками).
 * Аватары убраны (отзывы обезличены). Атрибуция под разделителем.
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
            <Reveal as="p" className="text-lg leading-relaxed text-ink">
              «{t.quote}»
            </Reveal>
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
