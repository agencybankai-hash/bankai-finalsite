import type { Metadata } from "next";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { IconBadge } from "@/components/ui/IconBadge";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Hero } from "@/components/sections/Hero";
import { ClientsBar } from "@/components/sections/ClientsBar";
import { TrustBar } from "@/components/sections/TrustBar";
import { FeatureGrid } from "@/components/sections/FeatureGrid";
import { CaseGrid } from "@/components/sections/CaseGrid";
import { CTASection } from "@/components/sections/CTASection";
import { Reveal } from "@/components/motion/Reveal";
import { ui } from "@/content/ui";
import { siteMetaEn } from "@/content/en/ui";
import {
  heroEn,
  clientsEn,
  trustStatsEn,
  systemEn,
  servicesEn,
  whyKzEn,
  casesPreviewEn,
  finalCtaEn,
} from "@/content/en/site";
import { pairAlternates } from "@/lib/i18n";

/* title/description/OG - из layout'а группы; здесь только hreflang-пара с RU. */
export const metadata: Metadata = {
  title: { absolute: siteMetaEn.title },
  description: siteMetaEn.description,
  alternates: pairAlternates("/", "/en", "en"),
};

const t = ui("en");

export default function EnHomePage() {
  return (
    <>
      {/* Визуал hero (HeroVisual) - с русскими подписями, поэтому на EN его нет */}
      <Hero
        title={heroEn.title}
        subtitle={heroEn.subtitle}
        badge={heroEn.badge}
        primary={heroEn.ctaPrimary}
        secondary={heroEn.ctaSecondary}
        badges={heroEn.badges}
        note={heroEn.note}
        visual={false}
      />

      <ClientsBar items={clientsEn.items} caption={clientsEn.caption} />

      <TrustBar items={trustStatsEn} />

      {/* Система - вместо молочной метафоры RU-версии короткий блок из 3 карточек */}
      <Section id="system" tone="surface">
        <SectionHeader
          eyebrow={systemEn.eyebrow}
          title={systemEn.title}
          lead={systemEn.lead}
          align="center"
        />
        <div className="mt-12">
          <FeatureGrid items={systemEn.items} />
        </div>
      </Section>

      {/* Услуги - карточки без ссылок: посадочных под каналы на EN нет */}
      <Section id="services">
        <SectionHeader
          eyebrow={servicesEn.eyebrow}
          title={servicesEn.title}
          lead={servicesEn.lead}
          align="center"
        />
        <Reveal stagger className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {servicesEn.cards.map((c) => (
            <div
              key={c.title}
              data-reveal
              className="flex flex-col rounded-xl border border-border bg-bg p-7 shadow-card"
            >
              <IconBadge icon={c.icon as IconName} size="lg" className="mb-5" />
              <h3 className="text-lg font-semibold tracking-tight text-ink">
                {c.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-2">{c.text}</p>
              <ul className="mt-5 space-y-2.5">
                {c.bullets.map((b) => (
                  <li key={b} className="flex gap-2.5 text-sm text-ink-2">
                    <Icon
                      name="check"
                      className="mt-0.5 h-4 w-4 shrink-0 text-accent"
                    />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-auto pt-6 text-base font-semibold tracking-tight text-ink">
                {c.terms}
              </div>
            </div>
          ))}
        </Reveal>
        <div className="mt-10 flex justify-center">
          <Button href={servicesEn.cta.href} size="lg" variant="accent">
            {servicesEn.cta.label}
          </Button>
        </div>
      </Section>

      {/* Почему команда из Казахстана */}
      <Section tone="surface">
        <SectionHeader
          eyebrow={whyKzEn.eyebrow}
          title={whyKzEn.title}
          lead={whyKzEn.lead}
        />
        <div className="mt-10">
          <FeatureGrid items={whyKzEn.items} columns={2} />
        </div>
      </Section>

      {/* Кейсы - те же данные, что на /en/cases, карточные поля переведены */}
      <Section>
        <SectionHeader
          eyebrow={casesPreviewEn.eyebrow}
          title={casesPreviewEn.title}
          lead={casesPreviewEn.lead}
        />
        <div className="mt-10">
          <CaseGrid items={casesPreviewEn.items} locale="en" />
        </div>
        <div className="mt-10 flex justify-center">
          <Button href={t.cases.href} variant="secondary">
            {t.cases.allCases}
          </Button>
        </div>
      </Section>

      <CTASection
        title={finalCtaEn.title}
        lead={finalCtaEn.lead}
        cta={finalCtaEn.cta}
      />
    </>
  );
}
