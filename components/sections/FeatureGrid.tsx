import { cn, nbsp } from "@/lib/utils";
import { Disclosure } from "@/components/ui/Disclosure";
import { Glyph } from "@/components/ui/Glyph";
import { Reveal } from "@/components/motion/Reveal";
import type { Feature } from "@/content/types";
import { featureGlyph } from "./featureGlyph";

/* Хвост последнего неполного ряда растягивается на свободные колонки:
   у панели фон - цвет линий, пустая ячейка была бы серым пятном. */
const TAIL_SPAN = { 2: "lg:col-span-2", 3: "lg:col-span-3" } as const;

/**
 * «Что входит»: панель-спецификация. Одна рамка, пункты разделены тонкими
 * линиями, у каждого - тематический глиф (featureGlyph). Не сетка карточек:
 * рядом стоят «Коротко» и процесс, три одинаковые сетки подряд сливались.
 * На десктопе по два пункта в ряд (глиф слева), три пункта - в ряд по три
 * (глиф над названием). Подробности раскрываются внутри пункта, текст
 * всегда в разметке.
 */
export function FeatureGrid({
  items,
  columns,
}: {
  items: Feature[];
  /** Колонок на десктопе. По умолчанию: три пункта - в ряд, иначе по два. */
  columns?: 2 | 3;
}) {
  const cols = columns ?? (items.length === 3 ? 3 : 2);
  const stacked = cols === 3;
  const rest = items.length % cols;

  return (
    <Reveal
      as="ul"
      stagger
      className={cn(
        "grid gap-px overflow-hidden rounded-2xl border border-border bg-border",
        stacked ? "lg:grid-cols-3" : "lg:grid-cols-2",
      )}
    >
      {items.map((f, i) => (
        <li
          key={f.title}
          className={cn(
            "bg-bg p-6 sm:p-8",
            rest > 0 && i === items.length - 1 && TAIL_SPAN[(cols - rest + 1) as 2 | 3],
          )}
        >
          <div
            data-reveal
            className={cn(
              "grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-4 gap-y-3 sm:items-start sm:gap-x-5",
              stacked && "lg:grid-cols-1 lg:gap-y-4",
            )}
          >
            <Glyph
              name={featureGlyph(f)}
              className={cn(
                f.details ? "sm:row-span-3" : "sm:row-span-2",
                stacked && "lg:row-span-1",
              )}
            />
            <h3
              className={cn(
                "text-balance text-lg font-semibold tracking-tight text-ink sm:pt-2.5",
                stacked && "lg:pt-0",
              )}
            >
              {nbsp(f.title)}
            </h3>
            <p
              className={cn(
                "col-span-2 max-w-prose text-pretty text-sm leading-relaxed text-ink-2 sm:col-span-1 sm:col-start-2",
                stacked && "lg:col-start-1",
              )}
            >
              {nbsp(f.text)}
            </p>
            {f.details && (
              <Disclosure
                className={cn(
                  "col-span-2 mt-2 border-t border-border pt-3 sm:col-span-1 sm:col-start-2",
                  stacked && "lg:col-start-1",
                )}
                label={<span className="text-sm font-medium text-ink">Подробнее</span>}
                iconClassName="text-lg"
                panelClassName="whitespace-pre-line pt-3 text-sm leading-relaxed text-ink-2"
              >
                {nbsp(f.details)}
              </Disclosure>
            )}
          </div>
        </li>
      ))}
    </Reveal>
  );
}
