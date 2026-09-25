import type { CSSProperties } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { InView } from "@/components/motion/InView";
import { anim } from "@/components/illustrations/vars";
import { cn, keepHyphens, nbsp } from "@/lib/utils";
import type { Step } from "@/content/types";

/* Отрезок линии тянется к следующему узлу после проявления шага. */
const LINE = { delay: 0.4, step: 0.15, dur: 0.35 };

/**
 * Процесс как путь к цели: узлы шагов на одной линии, финальный узел -
 * акцент (цель), остальные нейтральные. Срок - подпись над названием шага.
 * Десктоп (lg): рельс через все узлы. С 5 шагов описания встают по очереди
 * над линией и под ней: сетка из n + 1 колонки, шаг занимает две, узел - в
 * первой, поэтому ряд всегда полный при любом числе шагов. До 4 шагов -
 * один ряд под линией. До lg - вертикальный таймлайн.
 * Движение (область InView): отрезок вытягивается к следующему узлу за
 * 0.35 с, после проявления шага - 0.4 + i × 0.15 с; вертикаль - сверху вниз.
 */
export function ProcessSteps({ steps }: { steps: Step[] }) {
  const n = steps.length;
  const alt = n > 4;

  return (
    <InView className="ig-scope" style={{ "--cols": alt ? n + 1 : n } as CSSProperties}>
      <Reveal
        as="ol"
        stagger
        className={cn(
          "max-w-2xl lg:grid lg:max-w-none lg:grid-cols-[repeat(var(--cols),minmax(0,1fr))] lg:gap-x-6 lg:gap-y-5",
          alt ? "lg:grid-rows-[auto_2.25rem_auto]" : "lg:grid-rows-[2.25rem_auto]",
        )}
      >
        {steps.map((s, i) => {
          const goal = i === n - 1;
          const up = alt && i % 2 === 0;
          return (
            <li
              key={s.n}
              data-reveal
              style={{ "--c": i + 1 } as CSSProperties}
              className={cn(
                "relative grid grid-cols-[2.25rem_minmax(0,1fr)] gap-x-4 pb-8 last:pb-0",
                "lg:row-start-1 lg:grid-cols-1 lg:grid-rows-subgrid lg:gap-x-0 lg:pb-0",
                alt
                  ? "lg:row-span-3 lg:[grid-column:var(--c)/span_2]"
                  : "lg:row-span-2 lg:[grid-column:var(--c)]",
              )}
            >
              {/* До lg: вертикаль от узла до следующего шага. a-grow-y растёт
                  от нижнего края - точку роста переносим наверх. */}
              {!goal && (
                <span
                  aria-hidden
                  className="a-grow-y pointer-events-none absolute bottom-0 left-4.5 top-9 w-px bg-border lg:hidden"
                  style={{ ...anim({ ...LINE, i }), transformOrigin: "50% 0" }}
                />
              )}
              <div className={cn("relative", alt && "lg:row-start-2")}>
                <span
                  aria-hidden
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-full border text-xs font-semibold tabular-nums",
                    goal ? "border-accent bg-accent text-accent-fg" : "border-border bg-bg text-ink",
                  )}
                >
                  {s.n}
                </span>
                {/* lg: отрезок рельса до следующего узла. При чередовании шаг
                    шириной в две колонки, соседний узел - на его середине плюс
                    полгэпа (gap-x-6); без чередования - сразу за гэпом. */}
                {!goal && (
                  <span
                    aria-hidden
                    className={cn(
                      "a-grow-x pointer-events-none absolute left-9 top-1/2 hidden h-px bg-border lg:block",
                      alt ? "right-[calc(50%-0.75rem)]" : "-right-6",
                    )}
                    style={anim({ ...LINE, i })}
                  />
                )}
                {/* Черешок от узла к описанию - через gap-y-5 */}
                {alt && (
                  <span
                    aria-hidden
                    className={cn(
                      "pointer-events-none absolute left-4.5 hidden h-5 w-px bg-border lg:block",
                      up ? "bottom-full" : "top-full",
                    )}
                  />
                )}
              </div>
              <div
                className={cn(
                  "pt-1 lg:pr-2 lg:pt-0",
                  alt && (up ? "lg:row-start-1 lg:self-end" : "lg:row-start-3"),
                )}
              >
                {s.duration && <p className="text-sm text-muted">{nbsp(s.duration)}</p>}
                <h3 className="mt-0.5 text-lg font-semibold leading-snug tracking-tight text-ink">
                  {keepHyphens(nbsp(s.title))}
                </h3>
                <p className="mt-2 text-pretty text-sm leading-relaxed text-ink-2">{nbsp(s.text)}</p>
              </div>
            </li>
          );
        })}
      </Reveal>
    </InView>
  );
}
