import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Pill } from "@/components/ui/Pill";
import { HeroVisual } from "@/components/sections/HeroVisual";
import { cn, nbsp } from "@/lib/utils";
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
  badge = "SEO · Контекст · Сайты",
  visual = true,
}: {
  title: string;
  subtitle?: string;
  primary?: Cta;
  secondary?: Cta;
  note?: string;
  badges?: string[];
  /** Пилюля над заголовком; null — без пилюли. */
  badge?: string | null;
  /** Правая колонка: true - общий визуал главной (только десктоп); узел - свой
   *  визуал страницы (сам решает мобильную версию); false - без визуала. */
  visual?: React.ReactNode;
}) {
  const visualNode = visual === true ? <HeroVisual /> : visual;
  const hasVisual = Boolean(visualNode);
  // Дефис-разделитель → em-dash, приклеенный к следующему слову (nbsp после
  // тире). Так тире не висит в конце строки, а ведёт value-prop на новой строке.
  const titleText = nbsp(title).replace(
    new RegExp(`[${NB} ]-[${NB} ]`, "g"),
    ` ${MDASH}${NB}`,
  );
  return (
    <section className="overflow-hidden border-b border-border">
      <Container>
        <div
          className={cn(
            "grid items-center gap-10 py-14 sm:py-16 lg:gap-14 lg:py-24",
            hasVisual && "lg:grid-cols-[1.05fr_0.95fr]",
          )}
        >
          {/* Левая колонка — текст. Появление на CSS (.rise): контент виден
              с первой краски, LCP не ждёт JS; каскад задержками rise-N. */}
          <div>
            {badge && (
              <div className="fade-rise rise-1 mb-5">
                <Pill variant="soft" size="sm" className="uppercase tracking-wide">
                  {badge}
                </Pill>
              </div>
            )}
            {/* H1 — длинная SEO-строка (ключ+гео), не слоган: размер text-hero
                (меньше h1), чтобы строка ложилась в 3 строки и не давила колонку */}
            <h1 className="rise rise-2 text-hero text-ink">{titleText}</h1>
            {subtitle && (
              <p
                className={cn(
                  "rise rise-3 mt-6 text-base leading-relaxed text-ink-2",
                  hasVisual ? "max-w-md" : "max-w-2xl",
                )}
              >
                {nbsp(subtitle)}
              </p>
            )}
            {(primary || secondary) && (
              <div className="fade-rise rise-4 mt-8 flex flex-wrap gap-3">
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
              <ul className="fade-rise rise-5 mt-8 flex flex-wrap gap-x-6 gap-y-2">
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
              <p className="fade-rise rise-6 mt-6 text-sm text-muted">
                {note}
              </p>
            )}
          </div>

          {/* Правая колонка — визуал. Общий визуал главной на мобилке скрыт;
              тематический визуал страницы сам решает мобильную версию. */}
          {/* min-w-0: колонка сетки не растягивается по min-content визуала */}
          {hasVisual && (
            <div className={cn("min-w-0", visual === true && "hidden lg:block")}>
              {visualNode}
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
