import Link from "next/link";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Hero } from "@/components/sections/Hero";
import { TrustBar } from "@/components/sections/TrustBar";
import { ClientsBar } from "@/components/sections/ClientsBar";
import { BulletList } from "@/components/sections/BulletList";
import { SystemSection } from "@/components/sections/SystemSection";
import { FeatureGrid } from "@/components/sections/FeatureGrid";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { CaseGrid } from "@/components/sections/CaseGrid";
import { Testimonials } from "@/components/sections/Testimonials";
import { Pricing } from "@/components/sections/Pricing";
import { FAQ } from "@/components/sections/FAQ";
import { CTASection } from "@/components/sections/CTASection";
import { LeadMagnet } from "@/components/sections/LeadMagnet";
import {
  hero,
  trustStats,
  problem,
  system,
  homeIncludes,
  process,
  companyBlock,
  guarantee,
  finalCta,
  clients,
} from "@/content/site";
import { homeCases } from "@/content/cases";
import { testimonials } from "@/content/testimonials";
import { homeFaq } from "@/content/faq";

export default function Home() {
  return (
    <>
      <Hero
        title={hero.title}
        subtitle={hero.subtitle}
        primary={hero.ctaPrimary}
        secondary={hero.ctaSecondary}
        badges={hero.badges}
        note={hero.note}
      />

      <ClientsBar items={clients.items} caption={clients.caption} />

      <TrustBar items={trustStats} />

      {/* Проблема */}
      <Section>
        <SectionHeader title={problem.title} lead={problem.lead} />
        <div className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {problem.groups.map((g) => (
            <div key={g.label}>
              <h3 className="text-base font-semibold text-ink">{g.label}</h3>
              <BulletList items={g.items} columns={1} className="mt-5" />
            </div>
          ))}
        </div>
      </Section>

      {/* Система - яблочная метафора */}
      <Section id="services" tone="surface">
        <SectionHeader eyebrow="Как это работает" title={system.title} lead={system.lead} />
        <div className="mt-12">
          <SystemSection layers={system.layers} result={system.result} />
        </div>
        <div className="mt-5 rounded-xl border-l-2 border-ink bg-bg p-5">
          <p className="max-w-3xl text-sm leading-relaxed text-ink-2">
            {system.targeted}
          </p>
        </div>
      </Section>

      {/* Кейсы */}
      <Section>
        <SectionHeader title="Результаты клиентов" />
        <div className="mt-10">
          <CaseGrid items={homeCases} />
        </div>
        <div className="mt-10">
          <Link
            href="/cases"
            className="text-sm font-medium text-ink underline underline-offset-4"
          >
            Все кейсы →
          </Link>
        </div>
      </Section>

      {/* Отзывы */}
      <Section tone="surface">
        <SectionHeader title="Что говорят клиенты" />
        <div className="mt-10">
          <Testimonials items={testimonials} />
        </div>
      </Section>

      {/* Что вы получаете */}
      <Section>
        <SectionHeader title={homeIncludes.title} />
        <div className="mt-10">
          <FeatureGrid items={homeIncludes.items} />
        </div>
      </Section>

      {/* Процесс */}
      <Section tone="surface">
        <SectionHeader title={process.title} />
        <div className="mt-10">
          <ProcessSteps steps={process.steps} />
        </div>
      </Section>

      {/* О компании */}
      <Section>
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionHeader title={companyBlock.title} />
            <p className="mt-4 max-w-xl text-base leading-relaxed text-ink-2">
              {companyBlock.text}
            </p>
            <div className="mt-6">
              <Button href={companyBlock.cta.href} variant="secondary">
                {companyBlock.cta.label}
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6 lg:pl-8">
            {trustStats.map((s) => (
              <div key={s.label}>
                <div className="text-2xl font-semibold text-ink">{s.value}</div>
                <div className="mt-1 text-sm text-ink-2">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Что мы гарантируем */}
      <Section tone="surface">
        <SectionHeader
          title={guarantee.title}
          lead={guarantee.lead}
        />
        <div className="mt-10">
          <FeatureGrid items={guarantee.items} />
        </div>
      </Section>

      {/* Тарифы */}
      <Section>
        <SectionHeader
          title="Прозрачные тарифы"
          lead="Платите по тарифу за каждый канал, рекламный бюджет - отдельно и напрямую, без скрытых наценок. Это инвестиция: на старте считаем, за сколько окупится, и не беремся, если в вашей нише не окупается."
        />
        <div className="mt-10">
          <Pricing />
        </div>
      </Section>

      <LeadMagnet />

      {/* FAQ */}
      <Section>
        <SectionHeader title="Частые вопросы" />
        <div className="mt-8">
          <FAQ items={homeFaq} />
        </div>
      </Section>

      <CTASection title={finalCta.title} lead={finalCta.lead} cta={finalCta.cta} />
    </>
  );
}
