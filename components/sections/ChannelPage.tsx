import Link from "next/link";
import { cn } from "@/lib/utils";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Hero } from "@/components/sections/Hero";
import { Breadcrumbs, serviceCrumbs } from "@/components/sections/Breadcrumbs";
import { IntroStrip } from "@/components/sections/IntroStrip";
import { AnswerBlock } from "@/components/sections/AnswerBlock";
import { FitSection } from "@/components/sections/FitSection";
import { FeatureGrid } from "@/components/sections/FeatureGrid";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { FunnelChain } from "@/components/sections/FunnelChain";
import { CaseGrid } from "@/components/sections/CaseGrid";
import { ProofCards } from "@/components/sections/ProofCards";
import { FaqSection } from "@/components/sections/FAQ";
import { CTASection } from "@/components/sections/CTASection";
import { Longread } from "@/components/sections/Longread";
import { LinkGrid } from "@/components/sections/LinkGrid";
import { MetaphorCallout } from "@/components/sections/MetaphorCallout";
import { ServicePricing } from "@/components/sections/ServicePricing";
import { Reveal } from "@/components/motion/Reveal";
import { HeroIllustration } from "@/components/illustrations/HeroIllustration";
import { resolveHeroVisual } from "@/components/illustrations/resolve";
import { SystemMini } from "@/components/illustrations/infographics/SystemMini";
import { GuideSheet } from "@/components/illustrations/infographics/GuideSheet";
import { cases } from "@/content/cases";
import { channelForms, getChannel } from "@/content/services";
import { cityLandingsOf, landings, subservicesOf } from "@/content/landings";
import { finalCta } from "@/content/site";
import { agencyAstana } from "@/content/agency-astana";
import { introFacts } from "@/content/intro-facts";
import type {
  CaseChannel,
  Cta,
  ServiceChannel,
  ServiceLanding,
} from "@/content/types";

const channelMap: Partial<Record<string, CaseChannel>> = {
  seo: "SEO",
  context: "Контекст",
  web: "Сайт",
};

// Услуга → подробный гайд по каналу
const guideSlugMap: Record<string, string> = {
  seo: "seo",
  context: "context",
  web: "landing",
  leadgen: "marketing",
};

const landingLink = (l: ServiceLanding): Cta => ({ label: l.hero.title, href: l.path });
const channelLink = (c: ServiceChannel): Cta => ({
  label: c.hero.title,
  href: `/services/${c.slug}`,
});

/* Городские страницы вне landings (свой маршрут) - в `related` их указывают путём. */
const staticCityPages: Cta[] = [
  { label: agencyAstana.hero.title, href: agencyAstana.path },
];

/** Смежная страница городовой: слаг лендинга или канала ("leadgen") либо путь страницы из staticCityPages. */
function relatedLink(slug: string): Cta | undefined {
  if (slug.startsWith("/")) return staticCityPages.find((p) => p.href === slug);
  const l = landings.find((x) => x.slug === slug);
  if (l) return landingLink(l);
  const c = getChannel(slug);
  return c && channelLink(c);
}

function uniqueLinks(links: (Cta | undefined)[], exclude: string): Cta[] {
  const seen = new Set([exclude]);
  return links.filter((l): l is Cta => {
    if (!l || seen.has(l.href)) return false;
    seen.add(l.href);
    return true;
  });
}

/**
 * Страница услуги. С `landing` та же страница работает посадочной внутри канала:
 * подуслугой (гео-нейтральная) или городовой. hero, ключевая фраза в H2, ответный
 * блок, FAQ и «кому подходит» берутся из лендинга, остальное наследуется от канала.
 */
export function ChannelPage({
  channel,
  landing,
  longread,
}: {
  channel: ServiceChannel;
  landing?: ServiceLanding;
  /** Текст лонгрида над футером (markdown). */
  longread?: string;
}) {
  const isCity = Boolean(landing) && landing?.kind !== "subservice";
  const tag = channelMap[channel.slug];
  const relatedCases = tag
    ? cases.filter((c) => c.channels.includes(tag)).slice(0, 3)
    : [];
  const guideSlug = guideSlugMap[channel.slug];
  // канал, выделенный на мини-схеме «Часть системы» (у лидгена карточки нет)
  const systemChannel = (["seo", "context", "web"] as const).find((s) => s === channel.slug);
  const forms =
    landing?.keyPhrase ??
    channelForms[channel.slug] ?? {
      acc: channel.navLabel,
      gen: channel.navLabel,
      prep: channel.navLabel,
    };
  const problem = landing?.problem ?? channel.problem;
  // «вести» сочетается с продвижением и рекламой, но не с созданием сайта
  const processPhrase =
    landing?.keyPhrase.process ??
    channelForms[channel.slug]?.process ??
    `ведём ${forms.acc}`;
  const source = landing ?? channel;
  const hero = source.hero;
  const includes = landing?.includes ?? channel.includes;
  const process = landing?.process ?? channel.process;
  const audience = landing?.audience ?? channel.audience;
  const faq = source.faq;
  /* Своя цена лендинга перекрывает сетку тарифов канала: у подуслуги
     «Лендинги» не должно быть карточки интернет-магазина с хаба. */
  const plans = landing
    ? (landing.plans ?? (landing.pricing ? undefined : channel.plans))
    : channel.plans;
  const pricing = landing?.pricing ?? channel.pricing;
  /* Гео в заголовке тарифов - только если оно уже есть в самой услуге или
     ключевой фразе лендинга; SEO-хаб гео-нейтральный, город ему не дописываем. */
  const pricingTitle = `Стоимость ${forms.gen}`;

  /* Перелинковка внизу:
     - хаб - блок «Подуслуги»; на его городовые страницы ведут ссылки из
       текста лонгрида хаба;
     - подуслуга - её городовые страницы («Опыт по городам и регионам»);
     - городовая - гео-нейтральная страница её услуги, та же услуга в других
       городах, затем смежные страницы из `related`. */
  const subserviceLinks = landing ? [] : subservicesOf(channel.slug).map(landingLink);
  const cityLinks =
    landing && !isCity ? cityLandingsOf(channel.slug, landing.slug).map(landingLink) : [];
  const serviceOfCity = landing?.parent
    ? landings.find((l) => l.slug === landing.parent)
    : undefined;
  const cityPageLinks =
    isCity && landing
      ? uniqueLinks(
          [
            serviceOfCity ? landingLink(serviceOfCity) : channelLink(channel),
            ...cityLandingsOf(channel.slug, landing.parent).map(landingLink),
            ...(landing.related ?? []).map(relatedLink),
          ],
          landing.path,
        )
      : [];

  return (
    <>
      {landing && <Breadcrumbs items={serviceCrumbs(channel, landing)} />}

      <Hero
        title={hero.title}
        subtitle={hero.subtitle}
        primary={{ label: "Получить бесплатный аудит", href: "/contacts" }}
        secondary={{ label: "Смотреть кейсы", href: "/cases" }}
        badges={channel.badges}
        visual={<HeroIllustration visual={resolveHeroVisual(channel, landing)} />}
      />

      {/* Прямой ответ на запрос */}
      {source.intro && (
        <IntroStrip text={source.intro} {...introFacts(channel, landing)} />
      )}

      {source.answer && <AnswerBlock answer={source.answer} />}

      {/* Метафора - только у канала, на лендингах дубль */}
      {!landing && channel.metaphor && (
        <MetaphorCallout channel={channel.slug} text={channel.metaphor} />
      )}

      {/* Кому подходит и кому не подойдёт */}
      <FitSection audience={audience} problem={problem} />

      {/* Что входит */}
      <Section>
        <SectionHeader
          eyebrow="Состав работ"
          title={`Что входит в ${forms.acc}`}
          align="center"
        />
        <div className="mt-10">
          <FeatureGrid items={includes} />
        </div>
      </Section>

      {/* Процесс */}
      <Section tone="surface">
        <SectionHeader
          eyebrow="Процесс"
          title={`Как мы ${processPhrase}`}
          align="center"
        />
        <div className="mt-10">
          <ProcessSteps steps={process} />
        </div>
      </Section>

      {/* Как даёт заявки - только у канала, на лендингах дублировать нечего */}
      {!landing && (
        <Section>
          <SectionHeader
            title={channel.funnel.title}
            lead={channel.funnel.lead}
          />
          <div className="mt-10">
            <FunnelChain
              chain={channel.funnel.chain}
              note={channel.funnel.note}
              channel={channel.slug}
            />
          </div>
        </Section>
      )}

      {/* Доказательство текстом под интент страницы */}
      {source.proof && (
        <Section tone="surface">
          <SectionHeader title={source.proof.title} />
          <ProofCards items={source.proof.items} className="mt-10" />
        </Section>
      )}

      {/* Кейсы по каналу - карточками только у канала */}
      {!landing && relatedCases.length > 0 && (
        <Section tone="surface">
          <SectionHeader title="Где это сработало" />
          <div className="mt-10">
            <CaseGrid items={relatedCases} />
          </div>
        </Section>
      )}

      {/* Тарифы */}
      <ServicePricing
        title={pricingTitle}
        plans={plans}
        price={pricing}
        note={source.pricingNote}
      />

      {/* Место канала в системе + открытый гайд - только у канала */}
      {!landing && (channel.partOfSystem || guideSlug) && (
        <Section tone="surface">
          <SectionHeader
            eyebrow="Прозрачность"
            title="Без чёрных ящиков"
            align="center"
          />
          <Reveal stagger className="mt-10 grid gap-5 sm:grid-cols-2">
            {channel.partOfSystem && (
              <div
                data-reveal
                className={cn(
                  "flex flex-col rounded-2xl border border-border bg-bg p-8 shadow-card",
                  !guideSlug && "sm:col-span-2",
                )}
              >
                {systemChannel && <SystemMini highlight={systemChannel} />}
                <h3 className="text-h3 text-ink">Часть системы</h3>
                <p className="mt-3 max-w-3xl text-base leading-relaxed text-ink-2">
                  {channel.partOfSystem}
                </p>
                <Link
                  href="/services/leadgen"
                  className="mt-auto pt-5 text-sm font-medium text-ink underline underline-offset-4"
                >
                  Смотреть лидогенерацию под ключ →
                </Link>
              </div>
            )}

            {guideSlug && (
              <div
                data-reveal
                className={cn(
                  "flex flex-col rounded-2xl border border-border bg-bg p-8 shadow-card",
                  !channel.partOfSystem && "sm:col-span-2",
                )}
              >
                <GuideSheet />
                <h3 className="text-h3 text-ink">Нет секретов</h3>
                <p className="mt-3 max-w-3xl text-base leading-relaxed text-ink-2">
                  Хотите разобраться сами? Мы выложили полный гайд по этому каналу
                  - с формулами, порогами и чек-листом. Бесплатно, без всяких
                  email.
                </p>
                <Link
                  href={`/guides/${guideSlug}`}
                  className="mt-auto pt-5 text-sm font-medium text-ink underline underline-offset-4"
                >
                  Читать гайд →
                </Link>
              </div>
            )}
          </Reveal>
        </Section>
      )}

      {/* Лендинг: только половина «Без чёрных ящиков» - гайд по каналу.
          «Часть системы» не дублируем, она живёт на странице канала. */}
      {landing && guideSlug && (
        <Section tone="surface">
          <Reveal className="flex flex-col gap-5 rounded-2xl border border-border bg-bg p-7 shadow-card transition duration-300 ease-osmo hover:border-ink hover:shadow-card-hover sm:flex-row sm:items-center sm:justify-between">
            <GuideSheet compact />
            <div>
              <h2 className="text-h3 text-ink">Нет секретов</h2>
              <p className="mt-3 max-w-xl text-base leading-relaxed text-ink-2">
                Хотите разобраться сами? Мы выложили полный гайд по этому каналу
                - с формулами, порогами и чек-листом. Бесплатно, без всяких
                email.
              </p>
            </div>
            <Button href={`/guides/${guideSlug}`} size="lg" variant="secondary">
              Читать гайд
            </Button>
          </Reveal>
        </Section>
      )}

      {/* FAQ */}
      <FaqSection title={`Частые вопросы о ${forms.prep}`} items={faq} />

      {(subserviceLinks.length > 0 || cityLinks.length > 0) && (
        <Section tone="surface">
          <div className="space-y-14">
            {subserviceLinks.length > 0 && (
              <LinkGrid title="Подуслуги" links={subserviceLinks} />
            )}
            {cityLinks.length > 0 && (
              <LinkGrid title="Опыт по городам и регионам" links={cityLinks} />
            )}
          </div>
        </Section>
      )}

      {cityPageLinks.length > 0 && (
        <Section tone="surface">
          <LinkGrid title="Смежные страницы" links={cityPageLinks} />
        </Section>
      )}

      <CTASection title={finalCta.title} lead={finalCta.lead} cta={finalCta.cta} />

      {/* Лонгрид - последний блок страницы, прямо над футером */}
      {longread && <Longread markdown={longread} />}
    </>
  );
}
