import { Section, SectionHeader } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { IconBadge } from "@/components/ui/IconBadge";
import { FloatCard } from "@/components/ui/FloatCard";
import type { IconName } from "@/components/ui/Icon";
import { Hero } from "@/components/sections/Hero";
import { TrustBar } from "@/components/sections/TrustBar";
import { ClientsBar } from "@/components/sections/ClientsBar";
import { BulletList } from "@/components/sections/BulletList";
import { SystemSection } from "@/components/sections/SystemSection";
import { FeatureGrid } from "@/components/sections/FeatureGrid";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { CaseExplorer } from "@/components/sections/CaseExplorer";
import { ServicesGrid } from "@/components/sections/ServicesGrid";
import { Testimonials } from "@/components/sections/Testimonials";
import { Pricing } from "@/components/sections/Pricing";
import { FAQ } from "@/components/sections/FAQ";
import { CTASection } from "@/components/sections/CTASection";
import { LeadMagnet } from "@/components/sections/LeadMagnet";
import { Reveal } from "@/components/motion/Reveal";
import {
  hero,
  trustStats,
  problem,
  system,
  servicesPreview,
  homeAudience,
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

// Иконки под боли (донор #3 — карточки с icon-бейджами)
const problemIcons: IconName[] = ["gauge", "target", "chart"];

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

      {/* Проблема — донор #3: текст слева, карточки-боли справа */}
      <Section>
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <div>
            <SectionHeader title={problem.title} lead={problem.lead} />
            <div className="mt-8">
              <Button href="/contacts" size="lg" variant="accent">
                Получить бесплатный аудит
              </Button>
            </div>
          </div>
          <div className="relative">
            <Reveal stagger className="space-y-4">
              {problem.groups.map((g, i) => (
                <div
                  key={g.label}
                  data-reveal
                  className="rounded-xl border border-border bg-bg p-6 shadow-card"
                >
                  <div className="flex items-center gap-3">
                    <IconBadge icon={problemIcons[i]} />
                    <h3 className="text-base font-semibold text-ink">{g.label}</h3>
                  </div>
                  <BulletList items={g.items} columns={1} className="mt-4" />
                </div>
              ))}
            </Reveal>
            <div className="pointer-events-none absolute -right-3 -top-6 hidden w-44 lg:block">
              <FloatCard
                float
                label="Заявки утекают"
                value="−37%"
                icon="trending"
              />
            </div>
          </div>
        </div>
      </Section>

      {/* Система - молочная метафора */}
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

      {/* Кому подходим - квалификация аудитории между системой и оффером */}
      <Section>
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          <SectionHeader eyebrow="Кому подходим" title={homeAudience.title} />
          <Reveal>
            <BulletList
              items={homeAudience.items}
              variant="check"
              columns={1}
              className="lg:mt-2"
            />
          </Reveal>
        </div>
      </Section>

      {/* Услуги - 3 канала (перелинковка на посадочные + выбор канала) */}
      <Section>
        <SectionHeader
          eyebrow="Услуги"
          title={servicesPreview.title}
          lead={servicesPreview.lead}
          align="center"
        />
        <div className="mt-12">
          <ServicesGrid cards={servicesPreview.cards} />
        </div>
      </Section>

      {/* Кейсы — донор #6: pill-фильтры + карточки */}
      <Section>
        <SectionHeader eyebrow="Кейсы" title="Результаты клиентов" />
        <div className="mt-10">
          <CaseExplorer items={homeCases} allHref="/cases" />
        </div>
      </Section>

      {/* Отзывы */}
      <Section tone="surface">
        <SectionHeader eyebrow="Отзывы" title="Что говорят клиенты" align="center" />
        <div className="mt-10">
          <Testimonials items={testimonials} />
        </div>
      </Section>

      {/* Что вы получаете */}
      <Section>
        <SectionHeader eyebrow="Что входит" title={homeIncludes.title} align="center" />
        <div className="mt-10">
          <FeatureGrid items={homeIncludes.items} />
        </div>
      </Section>

      {/* Процесс */}
      <Section tone="surface">
        <SectionHeader eyebrow="Процесс" title={process.title} align="center" />
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
          <div className="grid grid-cols-2 gap-4 lg:pl-8">
            {trustStats.map((s) => (
              <div
                key={s.label}
                className="rounded-xl border border-border bg-bg p-5 shadow-card"
              >
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
          eyebrow="Гарантии"
          title={guarantee.title}
          lead={guarantee.lead}
          align="center"
        />
        <div className="mt-10">
          <FeatureGrid items={guarantee.items} />
        </div>
      </Section>

      {/* Тарифы */}
      <Section>
        <SectionHeader
          eyebrow="Тарифы"
          title="Прозрачные тарифы"
          lead="Платите по тарифу за каждый канал, рекламный бюджет - отдельно и напрямую, без скрытых наценок. Это инвестиция: на старте считаем, за сколько окупится, и не берёмся, если в вашей нише не окупается."
          align="center"
        />
        <div className="mt-10">
          <Pricing />
        </div>
      </Section>

      <LeadMagnet />

      {/* FAQ */}
      <Section>
        <SectionHeader eyebrow="FAQ" title="Частые вопросы" align="center" />
        <div className="mt-8">
          <FAQ items={homeFaq} />
        </div>
      </Section>

      <CTASection title={finalCta.title} lead={finalCta.lead} cta={finalCta.cta} />
    </>
  );
}
