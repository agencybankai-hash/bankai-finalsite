import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Badge } from "@/components/ui/Badge";
import { Stat } from "@/components/ui/Stat";
import { CaseGrid } from "@/components/sections/CaseGrid";
import { CTASection } from "@/components/sections/CTASection";
import { casesEn, getCaseEn, caseUiEn, casesCtaEn } from "@/content/en/cases";
import { ui } from "@/content/ui";
import { pairAlternates } from "@/lib/i18n";
import type { CaseChannel, CaseStudy } from "@/content/types";

type Params = { params: Promise<{ slug: string }> };

/* Лейблы каналов - из EN-словаря обвязки; подписи секций - из caseUiEn. */
const t = ui("en").cases;

const channelWord: Record<CaseChannel, string> = {
  SEO: "SEO",
  Контекст: "paid search",
  Сайт: "web development",
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

/* Краткий результат из заголовка кейса; если его нет - каналы и гео. */
function caseSummary(c: CaseStudy) {
  const lead = c.headline
    ? c.headline.split(/:| - /)[0].replace(/\s*\([^)]*\)/g, "").trim()
    : "";
  if (lead.length > 16) return lead;
  const channels = c.channels.map((ch) => channelWord[ch]).join(" + ");
  return `${channels}, ${shortGeo(c.geo)}`;
}

function metaDescription(text: string) {
  if (text.length <= 160) return text;
  const cut = text.slice(0, 160);
  return `${cut.slice(0, cut.lastIndexOf(" ")).replace(/[,.;:-]$/, "")}...`;
}

/* EN-версия - выжимка: существуют только кейсы из content/en/cases.ts. */
export function generateStaticParams() {
  return casesEn.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const c = getCaseEn(slug);
  if (!c) return {};
  return {
    title: `${c.client}: ${caseSummary(c)} - case study`,
    description: metaDescription(c.teaser),
    /* Слаги EN-кейсов зеркалят RU, поэтому пара считается напрямую. */
    alternates: pairAlternates(`/cases/${c.slug}`, `/en/cases/${c.slug}`, "en"),
    robots: { index: true, follow: true },
  };
}

export default async function EnCaseDetailPage({ params }: Params) {
  const { slug } = await params;
  const c = getCaseEn(slug);
  if (!c) notFound();

  const related = casesEn.filter((x) => x.slug !== c.slug).slice(0, 3);
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
            <Link href={t.href} className="text-sm text-ink-2 hover:text-ink">
              {caseUiEn.back}
            </Link>
            <div className="mt-6 flex flex-wrap items-center gap-2">
              {c.channels.map((ch) => (
                <Badge key={ch}>{t.channels[ch]}</Badge>
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
            <dl className="mt-8 grid grid-cols-2 gap-6 border-t border-border pt-6 sm:grid-cols-4">
              <div>
                <dt className="text-xs uppercase tracking-wide text-muted">
                  {caseUiEn.industry}
                </dt>
                <dd className="mt-1 text-sm text-ink">{c.industry}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-muted">
                  {caseUiEn.geo}
                </dt>
                <dd className="mt-1 text-sm text-ink">{c.geo}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-muted">
                  {caseUiEn.size}
                </dt>
                <dd className="mt-1 text-sm text-ink">{c.size}</dd>
              </div>
              {c.timeframe && (
                <div>
                  <dt className="text-xs uppercase tracking-wide text-muted">
                    {caseUiEn.timeframe}
                  </dt>
                  <dd className="mt-1 text-sm text-ink">{c.timeframe}</dd>
                </div>
              )}
            </dl>
          </div>
        </Container>
      </section>

      {/* Задача и стратегия */}
      <Section tone="surface">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <SectionHeader title={caseUiEn.challenge} />
            <p className="mt-4 text-base leading-relaxed text-ink-2">
              {c.challenge}
            </p>
          </div>
          <div>
            <SectionHeader title={caseUiEn.strategy} />
            <p className="mt-4 text-base leading-relaxed text-ink-2">
              {c.strategy}
            </p>
          </div>
        </div>

        {c.diagnosis && (
          <div className="mt-12 rounded-xl border border-border bg-bg p-6 sm:p-8">
            <div className="text-sm font-medium uppercase tracking-wide text-muted">
              {c.diagnosis.title ?? caseUiEn.diagnosis}
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
        <SectionHeader title={caseUiEn.work} />
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
                  <span className="font-medium text-ink">{caseUiEn.why}</span>
                  {w.why}
                </p>
              )}
            </div>
          ))}
        </div>
      </Section>

      {/* Результаты */}
      <Section tone="surface">
        <SectionHeader title={caseUiEn.results} lead={caseUiEn.resultsLead} />
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
            title={c.honesty.title ?? caseUiEn.honesty}
            lead={caseUiEn.honestyLead}
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
            <SectionHeader title={caseUiEn.conclusion} />
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
              &ldquo;{testimonial.quote}&rdquo;
            </blockquote>
            <figcaption className="mt-6 text-sm text-ink-2">
              {testimonial.author} · {testimonial.role}
            </figcaption>
          </figure>
        </Section>
      )}

      {/* Похожие кейсы */}
      <Section tone="surface">
        <SectionHeader title={caseUiEn.related} />
        <div className="mt-10">
          <CaseGrid items={related} locale="en" />
        </div>
      </Section>

      <CTASection
        title={casesCtaEn.title}
        lead={casesCtaEn.lead}
        cta={casesCtaEn.cta}
      />
    </>
  );
}
