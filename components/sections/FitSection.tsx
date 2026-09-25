import { Fragment } from "react";
import { nbsp } from "@/lib/utils";
import { Section } from "@/components/ui/Section";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/motion/Reveal";

const NB = String.fromCharCode(160);

// Слово через дефис («B2B-услуги», «январь-август») не рвётся на дефисе.
const HYPHENATED = /(\S+-\S+)/;

/** Числа не рвутся: разряды «300 000», число с единицей «1,6 млн ₸», «100-200 тыс. ₸». */
function bindNumbers(text: string): string {
  return text
    .replace(/(\d) (?=\d{3}(?!\d)|₸|(?:млн|млрд|тыс\.)(?![а-яё]))/gu, "$1" + NB)
    .replace(/(млн|млрд|тыс\.) ₸/gu, "$1" + NB + "₸");
}

/** Пункт с разметкой «**ключ** пояснение»: ключ полужирным, пояснение обычным. */
function Item({ text }: { text: string }) {
  return text.split("**").map((part, i) => {
    const words = bindNumbers(nbsp(part))
      .split(HYPHENATED)
      .map((w, j) => (j % 2 ? <span key={j} className="whitespace-nowrap">{w}</span> : w));
    return i % 2 ? (
      <strong key={i} className="font-semibold text-ink">
        {words}
      </strong>
    ) : (
      <Fragment key={i}>{words}</Fragment>
    );
  });
}

/**
 * «Кому подходит» и «Кому не подойдёт» одной секцией-сравнением.
 * «Подходит» - главный список: кегль крупнее, коралловые галочки.
 * «Не подойдёт» - тихая карточка сбоку, кегль мельче. Оба заголовка - H2,
 * как у двух прежних секций.
 */
export function FitSection({
  audience,
  problem,
}: {
  audience: string[];
  problem: { title: string; items: string[] };
}) {
  return (
    <Section tone="surface">
      <Reveal stagger className="grid items-start gap-10 lg:grid-cols-12 lg:gap-12">
        <div data-reveal className="lg:col-span-7">
          <h2 className="text-h3 text-ink">Кому подходит</h2>
          <ul className="mt-8 space-y-5">
            {audience.map((item) => (
              <li
                key={item}
                className="flex gap-3.5 text-base leading-relaxed text-ink-2 lg:gap-4 lg:text-lg"
              >
                <span
                  aria-hidden
                  className="mt-px inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent lg:mt-0.5 lg:h-7 lg:w-7"
                >
                  <Icon name="check" className="h-3.5 w-3.5" strokeWidth={2.25} />
                </span>
                <p className="text-pretty">
                  <Item text={item} />
                </p>
              </li>
            ))}
          </ul>
        </div>

        <div
          data-reveal
          className="rounded-2xl border border-border bg-bg p-6 shadow-card sm:p-8 lg:col-span-5"
        >
          <h2 className="text-balance text-lg font-semibold tracking-tight text-ink">
            {nbsp(problem.title)}
          </h2>
          <ul className="mt-5 space-y-3.5">
            {problem.items.map((item) => (
              <li key={item} className="flex gap-3 text-sm leading-relaxed text-ink-2">
                <Icon name="x" className="mt-0.5 h-4 w-4 shrink-0 text-muted" strokeWidth={2} />
                <p className="text-pretty">
                  <Item text={item} />
                </p>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </Section>
  );
}
