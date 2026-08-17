import { cn, nbspValue } from "@/lib/utils";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import type { ServiceLanding } from "@/content/types";
import { gridTail } from "./gridTail";

/**
 * Ответный блок лендинга: прямой структурированный ответ на запрос -
 * нумерованные этапы, срок и цена одной строкой. Стоит вверху страницы,
 * чтобы ответ читался и человеком, и AI Overview. Без декора.
 */
export function AnswerBlock({ answer }: { answer: ServiceLanding["answer"] }) {
  return (
    <Section>
      <SectionHeader eyebrow="Коротко" title={answer.title} lead={answer.lead} />
      <Reveal stagger className="mt-10 grid gap-5 sm:grid-cols-4 lg:grid-cols-6">
        {answer.steps.map((s, i) => (
          <div
            key={s.title}
            data-reveal
            className={cn(
              "rounded-xl border border-border bg-bg p-6 shadow-card transition duration-300 ease-osmo hover:-translate-y-1 hover:border-ink hover:shadow-card-hover sm:col-span-2",
              gridTail(i, answer.steps.length, 3),
            )}
          >
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-accent-soft text-sm font-semibold text-accent">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="mt-5 text-lg font-semibold tracking-tight text-ink">
              {s.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-2">{s.text}</p>
          </div>
        ))}
      </Reveal>

      {(answer.timeline || answer.priceFrom) && (
        <Reveal className="mt-8 border-t border-border pt-6">
          <dl className="flex flex-col gap-3 text-sm sm:flex-row sm:gap-10">
            {answer.timeline && (
              <div className="flex gap-2">
                <dt className="font-medium text-ink">Сроки:</dt>
                <dd className="text-ink-2">{answer.timeline}</dd>
              </div>
            )}
            {answer.priceFrom && (
              <div className="flex gap-2">
                <dt className="font-medium text-ink">Стоимость:</dt>
                <dd className="text-ink-2">от {nbspValue(answer.priceFrom)}</dd>
              </div>
            )}
          </dl>
        </Reveal>
      )}
    </Section>
  );
}
