import { Reveal } from "@/components/motion/Reveal";
import { cn } from "@/lib/utils";
import type { Step } from "@/content/types";

/**
 * Процесс как путь: шаги на связной линии с узлами, финальный узел —
 * акцент (цель «Масштаб»). На lg (4 колонки) каждый узел соединён со
 * следующим в той же строке - отрезок живёт в шаге и появляется с ним;
 * последний в строке и последний шаг без отрезка. На мобилке и sm линии
 * нет, шаги стопкой / сеткой.
 */
export function ProcessSteps({ steps }: { steps: Step[] }) {
  return (
    <Reveal
      stagger
      className="relative grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4"
    >
      {steps.map((s, i) => {
        const last = i === steps.length - 1;
        const linked = !last && i % 4 !== 3;
        return (
          <div key={s.n} data-reveal className="relative">
            {/* Отрезок до следующего узла строки (только lg): от края кружка через
                колонку и зазор gap-x-8 до левого края соседнего кружка */}
            {linked && (
              <span
                aria-hidden
                className="pointer-events-none absolute -right-8 left-9 top-[18px] hidden h-px bg-border lg:block"
              />
            )}
            <div className="flex items-center gap-3">
              <span
                className={cn(
                  "relative z-10 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold ring-4 ring-surface",
                  last
                    ? "bg-accent text-accent-fg"
                    : "bg-accent-soft text-accent",
                )}
              >
                {s.n}
              </span>
              {s.duration && (
                // Непрозрачный фон цвета секции + z-10: связующая линия проходит
                // за биркой и не должна просвечивать (как ring-surface у кружка).
                <span className="relative z-10 ml-auto rounded-full border border-border bg-surface px-2.5 py-0.5 text-xs text-muted">
                  {s.duration}
                </span>
              )}
            </div>
            <h3 className="mt-5 text-h3 text-ink">{s.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-2">{s.text}</p>
          </div>
        );
      })}
    </Reveal>
  );
}
