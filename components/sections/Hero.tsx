import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { HeroVisual } from "@/components/sections/HeroVisual";
import { nbsp } from "@/lib/utils";
import type { Cta } from "@/content/types";

const NB = String.fromCharCode(160); // неразрывный пробел
const MDASH = String.fromCharCode(8212); // —

export function Hero({
  title,
  subtitle,
  primary,
  secondary,
  note,
  badges,
}: {
  title: string;
  subtitle?: string;
  primary?: Cta;
  secondary?: Cta;
  note?: string;
  badges?: string[];
}) {
  // Дефис-разделитель → em-dash, приклеенный к следующему слову (nbsp после
  // тире). Так тире не висит в конце строки, а ведёт value-prop на новой строке.
  const titleText = nbsp(title).replace(
    new RegExp(`[${NB} ]-[${NB} ]`, "g"),
    ` ${MDASH}${NB}`,
  );
  return (
    <section className="overflow-hidden border-b border-border">
      <Container>
        <div className="grid items-center gap-10 py-14 sm:py-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14 lg:py-24">
          {/* Левая колонка — текст */}
          <Reveal stagger trigger="load" delay={0.3}>
            <p data-reveal className="mb-5 text-label uppercase text-muted">
              SEO · Контекст · Сайты
            </p>
            {/* H1 — длинная SEO-строка (ключ+гео), не слоган: держим text-h1,
                не display, иначе строки выталкивают CTA за сгиб */}
            <SplitReveal as="h1" className="text-h1 text-ink">
              {titleText}
            </SplitReveal>
            {subtitle && (
              <p
                data-reveal
                className="mt-6 max-w-md text-base leading-relaxed text-ink-2"
              >
                {nbsp(subtitle)}
              </p>
            )}
            {(primary || secondary) && (
              <div data-reveal className="mt-8 flex flex-wrap gap-3">
                {primary && (
                  <Button href={primary.href} size="lg" variant="accent">
                    {primary.label}
                  </Button>
                )}
                {secondary && (
                  <Button href={secondary.href} size="lg" variant="secondary">
                    {secondary.label}
                  </Button>
                )}
              </div>
            )}
            {badges && badges.length > 0 && (
              <ul data-reveal className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
                {badges.map((b) => (
                  <li
                    key={b}
                    className="flex items-center gap-2 text-sm text-ink-2"
                  >
                    <span aria-hidden className="text-ink">
                      ✓
                    </span>
                    {b}
                  </li>
                ))}
              </ul>
            )}
            {note && (
              <p data-reveal className="mt-6 text-sm text-muted">
                {note}
              </p>
            )}
          </Reveal>

          {/* Правая колонка — визуал (на мобилке скрыт, текст важнее) */}
          <div className="hidden lg:block">
            <HeroVisual />
          </div>
        </div>
      </Container>
    </section>
  );
}
