import { Fragment } from "react";
import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { Container } from "@/components/ui/Container";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Hero } from "@/components/sections/Hero";
import { Breadcrumbs, type Crumb } from "@/components/sections/Breadcrumbs";
import { ServicesGrid } from "@/components/sections/ServicesGrid";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { FAQ } from "@/components/sections/FAQ";
import { CTASection } from "@/components/sections/CTASection";
import { HeroIllustration } from "@/components/illustrations/HeroIllustration";
import { resolvePageVisual } from "@/components/illustrations/resolve";
import { agencyAstana as page } from "@/content/agency-astana";
import { finalCta } from "@/content/site";
import {
  breadcrumbLd,
  faqLd,
  geoNeutralAreas,
  ldJson,
  serviceLd,
} from "@/lib/jsonld";
import { pageMetadata } from "@/lib/metadata";

export const generateMetadata = pageMetadata({
  title: page.title,
  description: page.description,
  path: page.path,
});

const crumbs: Crumb[] = [
  { label: "Главная", href: "/" },
  { label: page.hero.title, href: page.path },
];

export default function AgencyAstanaPage() {
  const neutral = page.services.neutral;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={ldJson(
          serviceLd(page.hero.title, page.description, page.path, {
            serviceType: "Маркетинговое агентство",
            areaServed: ["Астана", "Казахстан", ...geoNeutralAreas],
            priceFrom: "350 000 ₸/мес",
          }),
        )}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={ldJson(faqLd(page.faq))}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={ldJson(
          breadcrumbLd(crumbs.map((c) => ({ name: c.label, path: c.href }))),
        )}
      />

      <Breadcrumbs items={crumbs} />

      <Hero
        title={page.hero.title}
        subtitle={page.hero.subtitle}
        primary={{ label: "Получить бесплатный аудит", href: "/contacts" }}
        secondary={{ label: "Смотреть кейсы", href: "/cases" }}
        badges={page.badges}
        visual={<HeroIllustration visual={resolvePageVisual(page.path)} />}
      />

      <div className="border-b border-border bg-surface">
        <Container>
          <p className="max-w-3xl py-8 text-lead text-ink-2">{page.intro}</p>
        </Container>
      </div>

      <Section>
        <SectionHeader
          eyebrow="Услуги"
          title={page.services.title}
          lead={page.services.lead}
        />
        <div className="mt-10">
          <ServicesGrid cards={page.services.cards} />
        </div>
        <p className="mt-8 text-base text-ink-2">
          {neutral.text}{" "}
          {neutral.links.map((l, i) => (
            <Fragment key={l.href}>
              <Link
                href={l.href}
                className="text-ink underline underline-offset-4 transition duration-300 ease-osmo hover:text-accent"
              >
                {l.label}
              </Link>
              {i < neutral.links.length - 1 ? ", " : "."}
            </Fragment>
          ))}
        </p>
      </Section>

      <Section tone="surface">
        <SectionHeader
          eyebrow="Процесс"
          title={page.remote.title}
          lead={page.remote.lead}
        />
        <div className="mt-10">
          <ProcessSteps steps={page.remote.steps} />
        </div>
      </Section>

      {/* Кейсы пересказаны под Астану, а не карточками с общими тизерами */}
      <Section>
        <SectionHeader eyebrow="Кейсы" title={page.proof.title} />
        <Reveal stagger className="mt-10 grid gap-5 lg:grid-cols-2">
          {page.proof.items.map((it) => (
            <Link
              key={it.slug}
              href={`/cases/${it.slug}`}
              data-reveal
              className="group flex flex-col rounded-xl border border-border bg-bg p-7 shadow-card transition duration-300 ease-osmo hover:-translate-y-1 hover:border-ink hover:shadow-card-hover"
            >
              <h3 className="text-lg font-semibold tracking-tight text-ink">
                {it.case}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-2">{it.text}</p>
              <span className="mt-5 text-sm font-medium text-ink group-hover:text-accent">
                Смотреть кейс →
              </span>
            </Link>
          ))}
        </Reveal>
      </Section>

      <Section tone="surface">
        <SectionHeader eyebrow="FAQ" title={page.faqTitle} align="center" />
        <div className="mt-8">
          <FAQ items={page.faq} />
        </div>
      </Section>

      <CTASection title={finalCta.title} lead={finalCta.lead} cta={finalCta.cta} />
    </>
  );
}
