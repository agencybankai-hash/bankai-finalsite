import Link from "next/link";
import { cn, nbsp, nbspValue } from "@/lib/utils";
import { Pill } from "@/components/ui/Pill";
import { Badge } from "@/components/ui/Badge";
import { Reveal } from "@/components/motion/Reveal";
import { ui } from "@/content/ui";
import type { CaseStudy, Locale, UiDict } from "@/content/types";

/** Строка списка: кейс и, если нужно, свои имя и текст под интент страницы. */
export type CaseListItem = {
  case: CaseStudy;
  /** Имя кейса на странице; по умолчанию client. */
  title?: string;
  /** Пересказ под страницу; по умолчанию teaser. */
  text?: string;
};

const hasDigit = (v: string) => /\d/.test(v);

/* Кегль главной цифры: число до 7 знаков - крупно, длиннее - на ступень
   меньше, слова («Дизайн + контроль») - как подзаголовок. */
function valueSize(value: string) {
  if (!hasDigit(value)) return "text-h3";
  return value.length <= 7 ? "text-h1" : "text-h2";
}

/** Колонка цифр: главная метрика крупно, вторая строкой под ней. */
function Metrics({ c, t }: { c: CaseStudy; t: UiDict["cases"] }) {
  const [main, second] = c.cardMetrics;

  /* У проекта в работе метрики - заглушки: на месте цифры статус, под ним что делаем. */
  if (c.inProgress) {
    return (
      <div>
        <div className="flex items-center gap-3 text-h3 text-ink">
          <span aria-hidden className="size-2.5 shrink-0 rounded-full bg-accent" />
          {t.inProgress}
        </div>
        {main && <p className="mt-2 text-sm leading-snug text-ink-2">{nbsp(main.label)}</p>}
      </div>
    );
  }

  return (
    <div>
      {c.template && <Badge className="mb-3">{t.template}</Badge>}
      {main && (
        <>
          <div
            className={cn(
              "font-semibold tabular-nums text-ink",
              valueSize(main.value),
              hasDigit(main.value) ? "whitespace-nowrap" : "text-balance",
            )}
          >
            {nbspValue(main.value)}
          </div>
          <p className="mt-2 text-sm leading-snug text-ink-2">{nbsp(main.label)}</p>
        </>
      )}
      {second && (
        <p className="mt-4 text-sm leading-snug text-ink-2">
          <span className="whitespace-nowrap font-semibold tabular-nums text-ink">
            {nbspValue(second.value)}
          </span>{" "}
          {nbsp(second.label)}
        </p>
      )}
    </div>
  );
}

/**
 * Кейсы строками результатов на хайрлайне: слева цифры кейса - главный
 * объект, справа клиент, каналы и три строки текста, ссылка на кейс.
 * Общая анатомия «Где это сработало» (CaseGrid) и доказательства на
 * страницах услуг (ProofCards). meta - строка «ниша · гео» под клиентом.
 */
export function CaseList({
  items,
  meta = false,
  locale = "ru",
  className,
}: {
  items: CaseListItem[];
  meta?: boolean;
  locale?: Locale;
  className?: string;
}) {
  const t = ui(locale).cases;

  return (
    <Reveal
      as="ul"
      stagger
      className={cn(
        "divide-y divide-border overflow-hidden rounded-2xl border border-border bg-bg",
        className,
      )}
    >
      {items.map(({ case: c, title, text }) => (
        <li key={c.slug} data-reveal>
          <Link
            href={`${t.href}/${c.slug}`}
            className="group grid gap-x-10 gap-y-5 p-6 transition-colors duration-300 ease-osmo hover:bg-surface focus-visible:bg-surface focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ink sm:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] sm:p-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)_auto] lg:gap-x-12 lg:px-9"
          >
            <Metrics c={c} t={t} />

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                <h3 className="text-lg font-semibold tracking-tight text-ink">
                  {nbsp(title ?? c.client)}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {c.channels.map((ch) => (
                    <Pill key={ch} variant="outline" size="sm">
                      {t.channels[ch]}
                    </Pill>
                  ))}
                </div>
              </div>
              {meta && (
                <p className="mt-2 text-xs leading-snug text-muted">
                  {c.industry} · {c.geo}
                </p>
              )}
              <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-ink-2">
                {nbsp(text ?? c.teaser)}
              </p>
            </div>

            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-ink sm:col-start-2 lg:col-start-3 lg:row-start-1 lg:self-center">
              {t.viewCase}
              <span
                aria-hidden
                className="transition-transform duration-300 ease-osmo group-hover:translate-x-1"
              >
                →
              </span>
            </span>
          </Link>
        </li>
      ))}
    </Reveal>
  );
}
