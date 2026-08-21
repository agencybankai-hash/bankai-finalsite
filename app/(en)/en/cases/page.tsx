import { Section, SectionHeader } from "@/components/ui/Section";
import { Hero } from "@/components/sections/Hero";
import { TrustBar } from "@/components/sections/TrustBar";
import { CaseGrid } from "@/components/sections/CaseGrid";
import { CTASection } from "@/components/sections/CTASection";
import {
  westernCasesEn,
  regionalCasesEn,
  casesIntroEn,
  casesStatsEn,
  casesCtaEn,
} from "@/content/en/cases";
import { breadcrumbLd, ldJson } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/metadata";

export const generateMetadata = pageMetadata({
  title: "Case studies: SEO, PPC and web for US and global clients",
  description:
    "Results from projects in the US, Europe, Kazakhstan and Mongolia: leads, organic growth and revenue.",
  path: "/en/cases",
  locale: "en",
});

const breadcrumb = breadcrumbLd([
  { name: "Home", path: "/en" },
  { name: "Cases", path: "/en/cases" },
]);

export default function EnCasesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={ldJson(breadcrumb)}
      />

      {/* visual={false}: HeroVisual - иллюстрация с русскими подписями и без
          локали, на EN её показывать нельзя. Вернуть, когда у неё появится locale. */}
      <Hero
        title="Case studies: SEO, PPC and web for US and global clients"
        subtitle={`${casesIntroEn.title}. ${casesIntroEn.lead}`}
        badge="SEO · PPC · Web"
        visual={false}
      />

      <TrustBar items={casesStatsEn} />

      {westernCasesEn.length > 0 && (
        <Section>
          <SectionHeader
            title="Clients in the US and Europe"
            lead="Competitive markets: B2B SaaS, local services and manufacturing - from a two-year retainer to a launch from zero."
          />
          <div className="mt-10">
            <CaseGrid items={westernCasesEn} locale="en" />
          </div>
        </Section>
      )}

      {regionalCasesEn.length > 0 && (
        <Section tone="surface">
          <SectionHeader
            title="Kazakhstan and Mongolia"
            lead="Our home region: fintech lead generation in Kazakhstan and a corporate website for a Mongolian telecom holding."
          />
          <div className="mt-10">
            <CaseGrid items={regionalCasesEn} locale="en" />
          </div>
        </Section>
      )}

      <CTASection
        title={casesCtaEn.title}
        lead={casesCtaEn.lead}
        cta={casesCtaEn.cta}
      />
    </>
  );
}
