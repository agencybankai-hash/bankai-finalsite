import { cn, keepHyphens, nbsp, nbspValue } from "@/lib/utils";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import type { ServiceLanding } from "@/content/types";

type Stage = { label?: string; value: string };

/** «рост позиций - через 1-2 месяца, заявки - с 3-4 месяца» → этапы. Новый этап
 *  начинает только сегмент с « - » или «: », запятые внутри этапа не режут;
 *  сегмент без « - » - этап без подписи. */
function timelineStages(timeline: string): Stage[] {
  return timeline.split(/, (?=[^,]*(?: - |: ))/).map((part) => {
    const i = part.indexOf(" - ");
    return i > 0 ? { label: part.slice(0, i), value: part.slice(i + 3) } : { value: part };
  });
}

/**
 * Ответный блок лендинга: прямой структурированный ответ на запрос. Слева
 * заголовок и итог - сроки по этапам и цена, справа лента нумерованных шагов;
 * на мобиле итог идёт после шагов. Не сетка карточек: ниже на странице сетками
 * идут «Что входит» и «Процесс». Читается и человеком, и AI Overview.
 */
export function AnswerBlock({ answer }: { answer: ServiceLanding["answer"] }) {
  const stages = answer.timeline ? timelineStages(answer.timeline) : [];
  const last = answer.steps.length - 1;

  return (
    <Section>
      <div className="grid gap-y-10 lg:grid-cols-12 lg:grid-rows-[auto_1fr] lg:gap-x-16">
        <SectionHeader
          eyebrow="Коротко"
          title={answer.title}
          lead={answer.lead}
          className="lg:col-span-5"
        />

        <Reveal
          as="ol"
          stagger
          className="lg:col-span-7 lg:col-start-6 lg:row-span-2 lg:row-start-1 lg:pt-2"
        >
          {answer.steps.map((s, i) => (
            <li
              key={s.title}
              data-reveal
              className="relative grid grid-cols-[2.25rem_minmax(0,1fr)] gap-x-4 pb-7 last:pb-0 sm:gap-x-5"
            >
              {i < last && (
                <span aria-hidden className="absolute bottom-0 left-4.5 top-9 w-px bg-border" />
              )}
              <span
                aria-hidden
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-bg text-xs font-semibold tabular-nums text-ink"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="pt-1.5">
                <h3 className="text-base font-semibold tracking-tight text-ink sm:text-lg">
                  {keepHyphens(nbsp(s.title))}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-2 sm:text-base">
                  {nbsp(s.text)}
                </p>
              </div>
            </li>
          ))}
        </Reveal>

        {(stages.length > 0 || answer.priceFrom) && (
          <Reveal className="rounded-2xl border border-border bg-surface p-6 sm:max-w-md sm:p-7 lg:col-span-5 lg:row-start-2 lg:max-w-none lg:self-start">
            <dl>
              {stages.length > 0 && (
                <>
                  <dt className="text-label uppercase text-muted">Сроки</dt>
                  <dd className="mt-4">
                    <dl className="divide-y divide-border">
                      {stages.map((st) => (
                        <div
                          key={st.value}
                          className="grid grid-cols-[fit-content(50%)_minmax(0,1fr)] gap-x-4 py-2.5 first:pt-0 last:pb-0 sm:gap-x-6"
                        >
                          {st.label ? (
                            <>
                              <dt className="text-sm text-ink-2 first-letter:uppercase">{nbsp(st.label)}</dt>
                              <dd className="text-right text-sm font-semibold text-ink">
                                {nbspValue(st.value)}
                              </dd>
                            </>
                          ) : (
                            <>
                              <dt className="sr-only">Срок</dt>
                              <dd className="col-span-2 text-sm text-ink-2 first-letter:uppercase">
                                {nbsp(st.value)}
                              </dd>
                            </>
                          )}
                        </div>
                      ))}
                    </dl>
                  </dd>
                </>
              )}
              {answer.priceFrom && (
                <>
                  <dt className={cn("text-label uppercase text-muted", stages.length > 0 && "mt-7")}>
                    Стоимость
                  </dt>
                  <dd className="mt-3 text-h3 text-ink">от {nbspValue(answer.priceFrom)}</dd>
                </>
              )}
            </dl>
          </Reveal>
        )}
      </div>
    </Section>
  );
}
