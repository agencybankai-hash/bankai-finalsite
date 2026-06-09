import type { Metadata } from "next";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Hero } from "@/components/sections/Hero";
import { TrustBar } from "@/components/sections/TrustBar";
import { CaseGrid } from "@/components/sections/CaseGrid";
import { CTASection } from "@/components/sections/CTASection";
import {
  kzCases,
  intlCases,
  inProgressCases,
  templateCases,
  casesIntro,
  casesStats,
} from "@/content/cases";
import { finalCta } from "@/content/site";

export const metadata: Metadata = {
  title: "Кейсы",
  description:
    "Результаты проектов на рынках Казахстана и США: заявки, рост трафика и выручки.",
};

export default function CasesPage() {
  return (
    <>
      <Hero
        title={casesIntro.title}
        subtitle={casesIntro.lead}
      />

      <TrustBar items={casesStats} />

      {kzCases.length > 0 && (
        <Section>
          <SectionHeader
            title="Кейсы в Казахстане"
            lead="Проекты на домашнем рынке - Алматы и регионы Казахстана."
          />
          <div className="mt-10">
            <CaseGrid items={kzCases} />
          </div>
        </Section>
      )}

      {intlCases.length > 0 && (
        <Section tone="surface">
          <SectionHeader
            title="Кейсы на зарубежных рынках"
            lead="Проекты на конкурентных рынках США, России и Монголии - от B2B SaaS до сервисного бизнеса и разработки."
          />
          <div className="mt-10">
            <CaseGrid items={intlCases} />
          </div>
        </Section>
      )}

      {inProgressCases.length > 0 && (
        <Section>
          <SectionHeader
            title="Сейчас в работе"
            lead="Проекты в активной работе - задача и подход уже здесь, результаты в цифрах обновим по завершении."
          />
          <div className="mt-10">
            <CaseGrid items={inProgressCases} />
          </div>
        </Section>
      )}

      {templateCases.length > 0 && (
        <Section tone="surface">
          <SectionHeader
            title="Образцы подачи кейсов"
            lead="Демонстрационные шаблоны под рынок Казахстана - SEO, контекст, разработка и комбинированный. Цифры иллюстративные; показывают структуру и подачу сильного кейса."
          />
          <div className="mt-10">
            <CaseGrid items={templateCases} />
          </div>
        </Section>
      )}

      <CTASection title={finalCta.title} lead={finalCta.lead} cta={finalCta.cta} />
    </>
  );
}
