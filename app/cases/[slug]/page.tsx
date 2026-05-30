import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Badge } from "@/components/ui/Badge";
import { Stat } from "@/components/ui/Stat";
import { MediaPlaceholder } from "@/components/ui/MediaPlaceholder";
import { CaseVisual } from "@/components/sections/CaseVisual";
import { CaseGrid } from "@/components/sections/CaseGrid";
import { CTASection } from "@/components/sections/CTASection";
import { cases, getCase } from "@/content/cases";
import { finalCta } from "@/content/site";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return cases.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const c = getCase(slug);
  if (!c) return {};
  return { title: `${c.client} — кейс`, description: c.teaser };
}

export default async function CaseDetailPage({ params }: Params) {
  const { slug } = await params;
  const c = getCase(slug);
  if (!c) notFound();

  const pool = cases.filter((x) => Boolean(x.template) === Boolean(c.template));
  const related = pool.filter((x) => x.slug !== c.slug).slice(0, 3);

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
              {c.template && (
                <Badge className="border-ink bg-ink text-bg">Образец</Badge>
              )}
              {c.channels.map((ch) => (
                <Badge key={ch}>{ch}</Badge>
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
            {c.template && (
              <p className="mt-6 max-w-2xl rounded-lg border border-dashed border-border bg-surface px-4 py-3 text-sm leading-relaxed text-ink-2">
                Демонстрационный шаблон подачи. Цифры иллюстративные - заменяются
                реальными метриками проекта при упаковке кейса.
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
      <Section>
        {c.visual ? (
          <CaseVisual kind={c.visual} />
        ) : (
          <MediaPlaceholder
            label={`Скриншоты проекта — ${c.client}`}
            ratio="16/9"
          />
        )}
      </Section>

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
          {c.work.map((w) => (
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
            </div>
          ))}
        </div>
      </Section>

      {/* Результаты */}
      <Section tone="surface">
        <SectionHeader
          title="Цифры проекта"
          lead={
            c.template
              ? "Цифры иллюстративные - образец подачи результатов."
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
      {c.testimonial && (
        <Section>
          <figure className="mx-auto max-w-3xl text-center">
            <blockquote className="text-xl leading-relaxed text-ink sm:text-2xl">
              «{c.testimonial.quote}»
            </blockquote>
            <figcaption className="mt-6 text-sm text-ink-2">
              {c.testimonial.author} · {c.testimonial.role}
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
