import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Badge } from "@/components/ui/Badge";
import { Stat } from "@/components/ui/Stat";
import { CaseVisual } from "@/components/sections/CaseVisual";
import { CaseGrid } from "@/components/sections/CaseGrid";
import { CTASection } from "@/components/sections/CTASection";
import { cases, getCase } from "@/content/cases";
import { finalCta } from "@/content/site";
import { ui } from "@/content/ui";
import { pageMetadata } from "@/lib/metadata";
import type { CaseChannel, CaseStudy, Cta, StatItem } from "@/content/types";

type Params = { params: Promise<{ slug: string }> };

/* Лейблы каналов - из словаря локали (EN-копия страницы берёт ui("en")). */
const t = ui("ru").cases;

const channelWord: Record<CaseChannel, string> = {
  SEO: "SEO",
  Контекст: "контекстная реклама",
  Сайт: "разработка сайта",
};

/* Канал кейса → страница услуги: связь кейс→услуга, а не только услуга→кейс. */
const channelService: Record<CaseChannel, Cta> = {
  SEO: { label: "SEO-продвижение", href: "/services/seo" },
  Контекст: { label: "Контекстная реклама", href: "/services/context" },
  Сайт: { label: "Разработка сайтов", href: "/services/web" },
};

/* Гео для title: город, если он короткий, иначе страна. */
function shortGeo(geo: string) {
  const parts = geo
    .replace(/\s*\([^)]*\)/g, "")
    .split("·")
    .map((p) => p.trim());
  const last = parts[parts.length - 1];
  return last.length <= 24 ? last : parts[0];
}

/* Каналы и гео - запасной хвост title, когда цифр результата нет. */
function channelSummary(c: CaseStudy) {
  const channels = c.channels.map((ch) => channelWord[ch]).join(" + ");
  return `${channels}, ${shortGeo(c.geo)}`;
}

/* Метрика карточки как результат в title: без скобочных уточнений. */
function metricPhrase(m: StatItem) {
  return `${m.value} ${m.label}`
    .replace(/\s*\([^)]*\)/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/* Layout дописывает « · Bankai» (9 символов), поэтому свой хвост - до 50. */
const TITLE_MAX = 50;
const DESC_MAX = 155;

/**
 * Title кейса: клиент + ключевой результат из cardMetrics. Кандидаты идут от
 * самого информативного к самому короткому, берём первый, влезающий в лимит.
 */
function metaTitle(c: CaseStudy) {
  const client = c.client.split(" - ")[0].trim();
  const short = client.split(/\s(?:и|×)\s|,/)[0].trim();
  const metrics = c.cardMetrics
    .filter((m) => /\d/.test(m.value))
    .map(metricPhrase);
  const bases = [
    ...metrics.map((m) => `${client}: ${m}`),
    ...(short === client ? [] : metrics.map((m) => `${short}: ${m}`)),
    `${client}: ${channelSummary(c)}`,
    client,
  ];
  const variants = bases.flatMap((b) => [`${b} - кейс`, b]);
  return (
    variants.find((v) => v.length <= TITLE_MAX) ??
    client.slice(0, TITLE_MAX).replace(/\s+\S*$/, "")
  );
}

/* Description: обрезаем по границе предложения, иначе по слову с многоточием. */
function metaDescription(text: string) {
  const t = text.replace(/\s+/g, " ").trim();
  if (t.length <= DESC_MAX) return t;
  const head = t.slice(0, DESC_MAX);
  const sentence = Math.max(
    head.lastIndexOf(". "),
    head.lastIndexOf("! "),
    head.lastIndexOf("? "),
  );
  if (sentence >= 110) return head.slice(0, sentence + 1);
  const cut = t.slice(0, DESC_MAX - 3);
  return `${cut.slice(0, cut.lastIndexOf(" ")).replace(/[,.;:-]+$/, "")}...`;
}

export function generateStaticParams() {
  return cases.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata(
  { params }: Params,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { slug } = await params;
  const c = getCase(slug);
  if (!c) return {};
  /* hreflang - только у кейсов с EN-версией; остальным pageMetadata оставит один canonical. */
  return {
    ...(await pageMetadata({
      title: metaTitle(c),
      description: metaDescription(c.teaser),
      path: `/cases/${c.slug}`,
    })(params, parent)),
    ...(c.template && { robots: { index: false, follow: false } }),
  };
}

export default async function CaseDetailPage({ params }: Params) {
  const { slug } = await params;
  const c = getCase(slug);
  if (!c) notFound();

  const related = cases
    .filter((x) => x.slug !== c.slug && !x.inProgress)
    .sort((a, b) => Number(Boolean(a.template)) - Number(Boolean(b.template)))
    .slice(0, 3);
  const testimonial =
    c.testimonial &&
    !c.testimonial.quote.startsWith("[") &&
    !c.testimonial.author.startsWith("[")
      ? c.testimonial
      : null;

  return (
    <>
      {/* Шапка кейса */}
      <section className="border-b border-border">
        <Container>
          <div className="py-14 sm:py-20">
            <Link href="/cases" className="text-sm text-ink-2 hover:text-ink">
              ← Все кейсы
            </Link>
            <div className="mt-6 flex flex-wrap items-center gap-2">
              {c.inProgress && (
                <Badge className="border-accent! bg-accent! text-accent-fg!">
                  В работе
                </Badge>
              )}
              {c.channels.map((ch) => (
                <Link
                  key={ch}
                  href={channelService[ch].href}
                  title={channelService[ch].label}
                  className="transition duration-300 ease-osmo hover:opacity-80"
                >
                  <Badge className="hover:border-ink hover:text-ink">
                    {t.channels[ch]}
                  </Badge>
                </Link>
              ))}
            </div>
            <h1 className="mt-4 text-2xl font-semibold leading-tight tracking-tight text-ink sm:text-3xl">
              {c.client}
            </h1>
            {c.headline && (
              <p className="mt-3 max-w-3xl text-2xl font-semibold leading-snug tracking-tight text-ink sm:text-3xl lg:text-4xl">
                {c.headline}
              </p>
            )}
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-2">
              {c.teaser}
            </p>
            {c.inProgress && (
              <p className="mt-6 max-w-2xl rounded-lg border border-dashed border-accent bg-surface px-4 py-3 text-sm leading-relaxed text-ink-2">
                Проект в работе. Здесь - задача и план; результаты в цифрах
                обновим после завершения и запуска.
              </p>
            )}
            <dl className="mt-8 grid grid-cols-2 gap-6 border-t border-border pt-6 sm:grid-cols-4">
              <div>
                <dt className="text-xs uppercase tracking-wide text-muted">
                  Индустрия
                </dt>
                <dd className="mt-1 text-sm text-ink">{c.industry}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-muted">Гео</dt>
                <dd className="mt-1 text-sm text-ink">{c.geo}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-muted">
                  Профиль
                </dt>
                <dd className="mt-1 text-sm text-ink">{c.size}</dd>
              </div>
              {c.timeframe && (
                <div>
                  <dt className="text-xs uppercase tracking-wide text-muted">
                    Срок
                  </dt>
                  <dd className="mt-1 text-sm text-ink">{c.timeframe}</dd>
                </div>
              )}
            </dl>
          </div>
        </Container>
      </section>

      {/* Превью проекта */}
      {c.visual && (
        <Section>
          <CaseVisual kind={c.visual} />
        </Section>
      )}

      {/* Задача и стратегия */}
      <Section tone="surface">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <SectionHeader title="Задача" />
            <p className="mt-4 text-base leading-relaxed text-ink-2">
              {c.challenge}
            </p>
          </div>
          <div>
            <SectionHeader title="Стратегия" />
            <p className="mt-4 text-base leading-relaxed text-ink-2">
              {c.strategy}
            </p>
          </div>
        </div>

        {c.diagnosis && (
          <div className="mt-12 rounded-xl border border-border bg-bg p-6 sm:p-8">
            <div className="text-sm font-medium uppercase tracking-wide text-muted">
              {c.diagnosis.title ?? "Что было плохо на старте"}
            </div>
            <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
              {c.diagnosis.items.map((it) => (
                <li key={it} className="flex gap-2.5 text-sm text-ink-2">
                  <span aria-hidden className="text-muted">
                    —
                  </span>
                  <span>{it}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Section>

      {/* Тезис-инсайт */}
      {c.thesis && (
        <Section>
          <figure className="mx-auto max-w-3xl">
            {c.thesis.label && (
              <figcaption className="text-sm font-medium uppercase tracking-wide text-muted">
                {c.thesis.label}
              </figcaption>
            )}
            <blockquote className="mt-3 text-2xl font-semibold leading-snug tracking-tight text-ink sm:text-3xl">
              {c.thesis.text}
            </blockquote>
          </figure>
        </Section>
      )}

      {/* Что сделали */}
      <Section>
        <SectionHeader title="Работа по каналам" />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {c.work.map((w) => {
            /* Блоки работы называются свободно - ссылку вешаем только там,
               где название совпало с каналом (SEO / Контекст / Сайт). */
            const service = channelService[w.channel as CaseChannel];
            return (
              <div
                key={w.channel}
                className="rounded-xl border border-border bg-bg p-6"
              >
                <Badge>{w.channel}</Badge>
                <ul className="mt-4 space-y-2.5">
                  {w.points.map((p) => (
                    <li key={p} className="flex gap-2.5 text-sm text-ink-2">
                      <span aria-hidden className="text-muted">
                        —
                      </span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
                {w.why && (
                  <p className="mt-4 border-t border-border pt-4 text-sm leading-relaxed text-ink-2">
                    <span className="font-medium text-ink">Почему так: </span>
                    {w.why}
                  </p>
                )}
                {service && (
                  <div className="mt-4 border-t border-border pt-4">
                    <Link
                      href={service.href}
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-ink transition duration-300 ease-osmo hover:text-accent"
                    >
                      Услуга: {service.label}
                      <span aria-hidden>→</span>
                    </Link>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Section>

      {/* Результаты */}
      <Section tone="surface">
        <SectionHeader
          title={c.inProgress ? "Результаты" : "Цифры проекта"}
          lead={
            c.inProgress
              ? "Проект в работе - результаты в цифрах обновим после завершения."
              : "Метрики реальные; часть закрыта по NDA и показывается на встрече."
          }
        />
        <div className="mt-10 space-y-10">
          {c.results.map((g) => (
            <div key={g.group}>
              <div className="text-sm font-medium uppercase tracking-wide text-muted">
                {g.group}
              </div>
              <div className="mt-4 grid grid-cols-2 gap-6 sm:grid-cols-4">
                {g.items.map((it) =>
                  it.before !== undefined && it.after !== undefined ? (
                    <div key={it.label}>
                      <div className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
                        <span className="text-xl text-muted sm:text-2xl">
                          {it.before}
                        </span>
                        <span aria-hidden className="mx-1.5 text-muted">
                          →
                        </span>
                        {it.after}
                      </div>
                      <div className="mt-1 text-sm text-ink-2">{it.label}</div>
                    </div>
                  ) : (
                    <Stat
                      key={it.label}
                      value={it.value ?? ""}
                      label={it.label}
                    />
                  ),
                )}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Что не сработало и риски */}
      {c.honesty && (
        <Section>
          <SectionHeader
            title={c.honesty.title ?? "Что не сработало и риски"}
            lead="Решения, которые мы отвергли, и риски, которые заложили заранее."
          />
          <ul className="mt-10 max-w-3xl space-y-4">
            {c.honesty.items.map((it) => (
              <li
                key={it}
                className="flex gap-3 border-l-2 border-border pl-4 text-base leading-relaxed text-ink-2"
              >
                {it}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* Вывод */}
      {c.conclusion && (
        <Section tone="surface">
          <div className="max-w-3xl">
            <SectionHeader title="Вывод" />
            <p className="mt-4 text-base leading-relaxed text-ink-2">
              {c.conclusion}
            </p>
          </div>
        </Section>
      )}

      {/* Отзыв */}
      {testimonial && (
        <Section>
          <figure className="mx-auto max-w-3xl text-center">
            <blockquote className="text-xl leading-relaxed text-ink sm:text-2xl">
              «{testimonial.quote}»
            </blockquote>
            <figcaption className="mt-6 text-sm text-ink-2">
              {testimonial.author} · {testimonial.role}
            </figcaption>
          </figure>
        </Section>
      )}

      {/* Похожие кейсы */}
      <Section tone="surface">
        <SectionHeader title="Похожие проекты" />
        <div className="mt-10">
          <CaseGrid items={related} />
        </div>
      </Section>

      <CTASection title={finalCta.title} lead={finalCta.lead} cta={finalCta.cta} />
    </>
  );
}
