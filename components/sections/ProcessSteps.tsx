import { Reveal } from "@/components/motion/Reveal";
import { cn } from "@/lib/utils";
import type { Step } from "@/content/types";

/**
 * Процесс как путь: 4 шага на связной линии с узлами, финальный узел —
 * акцент (цель «Масштаб»). Reveal-каскад слева-направо «прочерчивает»
 * линию. На мобилке линия скрыта, шаги стопкой.
 */
export function ProcessSteps({ steps }: { steps: Step[] }) {
  return (
    <Reveal
      stagger
      className="relative grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4"
    >
      {/* Связующая линия (только lg), по центру узлов */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-0 right-0 top-[6px] hidden h-px bg-border lg:block"
      />
      {steps.map((s, i) => {
        const last = i === steps.length - 1;
        return (
          <div key={s.n} data-reveal className="relative">
            <div className="flex items-center gap-3">
              <span
                className={cn(
                  "relative z-10 h-3 w-3 shrink-0 rounded-full ring-4 ring-surface",
                  last ? "bg-accent" : "bg-ink",
                )}
              />
              <span className="text-label uppercase text-muted">{s.n}</span>
              {s.duration && (
                <span className="ml-auto rounded-full border border-border px-2.5 py-0.5 text-xs text-muted">
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
