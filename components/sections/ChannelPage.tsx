import Link from "next/link";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/Container";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Pill } from "@/components/ui/Pill";
import { Icon } from "@/components/ui/Icon";
import { Hero } from "@/components/sections/Hero";
import { AnswerBlock } from "@/components/sections/AnswerBlock";
import { BulletList } from "@/components/sections/BulletList";
import { FeatureGrid } from "@/components/sections/FeatureGrid";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { FunnelChain } from "@/components/sections/FunnelChain";
import { CaseGrid } from "@/components/sections/CaseGrid";
import { FAQ } from "@/components/sections/FAQ";
import { CTASection } from "@/components/sections/CTASection";
import { Reveal } from "@/components/motion/Reveal";
import { cases } from "@/content/cases";
import { channelForms } from "@/content/services";
import { landings, landingsByChannel } from "@/content/landings";
import { finalCta } from "@/content/site";
import type {
  CaseChannel,
  Cta,
  ServiceChannel,
  ServiceLanding,
} from "@/content/types";

const channelMap: Record<string, CaseChannel> = {
  seo: "SEO",
  context: "Контекст",
  web: "Сайт",
};

// Услуга → подробный гайд по каналу
const guideSlugMap: Record<string, string> = {
  seo: "seo",
  context: "context",
  web: "landing",
};

/**
 * Страница услуги. С `landing` та же страница работает спутниковой посадочной
 * под НЧ-запрос: hero, ключевая фраза в H2, ответный блок, FAQ и «кому
 * подходит» берутся из лендинга, остальное наследуется от канала.
 */
export function ChannelPage({
  channel,
  landing,
}: {
  channel: ServiceChannel;
  landing?: ServiceLanding;
}) {
  const tag = channelMap[channel.slug];
  const relatedCases = cases.filter((c) => c.channels.includes(tag)).slice(0, 3);
  const guideSlug = guideSlugMap[channel.slug];
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
    (channel.slug === "web" ? "делаем сайты" : `ведём ${forms.acc}`);
  const hero = landing?.hero ?? channel.hero;
  const includes = landing?.includes ?? channel.includes;
  const process = landing?.process ?? channel.process;
  const audience = landing?.audience ?? channel.audience;
  const faq = landing?.faq ?? channel.faq;
  // У лендинга гео уже внутри ключевой фразы - город второй раз не добавляем.
  const pricingTitle = landing
    ? `Стоимость ${forms.gen}`
    : `Стоимость ${forms.gen} в Алматы`;

  /* Перелинковка: у лендинга - смежные лендинги плюс родительская услуга,
     у канала - его спутники. Спутников нет - секции нет. */
  const relatedLinks: Cta[] = landing
    ? [
        ...(landing.related ?? [])
          .map((s) => landings.find((l) => l.slug === s))
          .filter((l): l is ServiceLanding => Boolean(l))
          .map((l) => ({ label: l.hero.title, href: l.path })),
        { label: channel.title, href: `/services/${channel.slug}` },
      ]
    : landingsByChannel(channel.slug).map((l) => ({
        label: l.hero.title,
        href: l.path,
      }));

  return (
    <>
      <Hero
        title={hero.title}
        subtitle={hero.subtitle}
        primary={{ label: "Получить бесплатный аудит", href: "/contacts" }}
        secondary={{ label: "Смотреть кейсы", href: "/cases" }}
        badges={channel.badges}
      />

      {/* Прямой ответ на запрос лендинга */}
      {landing?.intro && (
        <div className="border-b border-border bg-surface">
          <Container>
            <p className="max-w-3xl py-8 text-lead text-ink-2">
              {landing.intro}
            </p>
          </Container>
        </div>
      )}

      {landing && <AnswerBlock answer={landing.answer} />}

      {/* Метафора - только у канала, на лендингах дубль */}
      {!landing && channel.metaphor && (
        <div className="border-b border-border bg-surface">
          <Container>
            <div className="max-w-3xl py-8">
              <div className="rounded-lg border-l-2 border-ink bg-surface-2 px-4 py-3.5">
                <div className="text-xs uppercase tracking-wide text-muted">
                  По-простому
                </div>
                <p className="mt-1 text-base leading-relaxed text-ink">
                  {channel.metaphor}
                </p>
              </div>
            </div>
          </Container>
        </div>
      )}

      {/* Для кого */}
      <Section>
        <SectionHeader title="Кому подходит" />
        <div className="mt-8">
          <BulletList items={audience} variant="check" />
        </div>
      </Section>

      {/* Проблема */}
      <Section tone="surface">
        <SectionHeader title={problem.title} />
        <div className="mt-8">
          <BulletList items={problem.items} />
        </div>
      </Section>

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
            <FunnelChain chain={channel.funnel.chain} note={channel.funnel.note} />
          </div>
        </Section>
      )}

      {/* Лендинг: доказательство текстом под интент */}
      {landing?.proof && (
        <Section tone="surface">
          <SectionHeader title={landing.proof.title} />
          <Reveal stagger className="mt-10 grid gap-5 lg:grid-cols-2">
            {landing.proof.items.map((it) => (
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
      <Section>
        <SectionHeader
          eyebrow="Тарифы"
          title={pricingTitle}
          align="center"
        />
        {channel.plans ? (
          <Reveal stagger className="mt-10 grid gap-5 lg:grid-cols-3">
            {channel.plans.map((p) => (
              <div
                key={p.name}
                data-reveal
                className={cn(
                  "flex flex-col rounded-xl border bg-bg p-7 shadow-card transition duration-300 ease-osmo hover:-translate-y-1 hover:shadow-card-hover",
                  p.featured ? "border-accent" : "border-border hover:border-ink",
                )}
              >
                {p.featured && (
                  <Pill variant="soft" size="sm" className="mb-3 self-start">
                    Популярно
                  </Pill>
                )}
                <h3 className="text-lg font-semibold tracking-tight text-ink">
                  {p.name}
                </h3>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-3xl font-semibold tracking-tight text-ink">
                    {p.price}
                  </span>
                  {p.sub && <span className="text-sm text-muted">{p.sub}</span>}
                </div>
                <ul className="mt-6 space-y-2.5">
                  {p.includes.map((i) => (
                    <li key={i} className="flex gap-2.5 text-sm text-ink-2">
                      <Icon
                        name="check"
                        className="mt-0.5 h-4 w-4 shrink-0 text-accent"
                      />
                      <span>{i}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </Reveal>
        ) : (
          <Reveal className="mt-10 flex flex-col gap-4 rounded-xl border border-border bg-bg p-7 shadow-card transition duration-300 ease-osmo hover:border-ink hover:shadow-card-hover sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-semibold tracking-tight text-ink">
                  {channel.pricing.value}
                </span>
                <span className="text-sm text-muted">{channel.pricing.sub}</span>
              </div>
              {channel.pricing.note && (
                <p className="mt-2 max-w-md text-sm text-ink-2">
                  {channel.pricing.note}
                </p>
              )}
            </div>
            <Button href="/contacts" size="lg">
              Узнать точную смету
            </Button>
          </Reveal>
        )}
        {landing?.pricingNote && (
          <Reveal className="mt-8">
            <p className="mx-auto max-w-2xl text-center text-sm leading-relaxed text-ink-2">
              {landing.pricingNote}
            </p>
          </Reveal>
        )}
      </Section>

      {/* Место канала в системе + открытый гайд - только у канала */}
      {!landing && (
      <Section tone="surface">
        <SectionHeader
          eyebrow="Прозрачность"
          title="Без чёрных ящиков"
          align="center"
        />
        <Reveal stagger className="mt-10 grid gap-5 sm:grid-cols-2">
          <div
            data-reveal
            className={cn(
              "flex flex-col rounded-2xl border border-border bg-bg p-8 shadow-card",
              !guideSlug && "sm:col-span-2",
            )}
          >
            <h3 className="text-h3 text-ink">Часть системы</h3>
            <p className="mt-3 max-w-3xl text-base leading-relaxed text-ink-2">
              {channel.partOfSystem}
            </p>
            <Link
              href="/#services"
              className="mt-auto pt-5 text-sm font-medium text-ink underline underline-offset-4"
            >
              Смотреть лидогенерацию под ключ →
            </Link>
          </div>

          {guideSlug && (
            <div
              data-reveal
              className="flex flex-col rounded-2xl border border-border bg-bg p-8 shadow-card"
            >
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

      {/* FAQ */}
      <Section>
        <SectionHeader
          eyebrow="FAQ"
          title={`Частые вопросы о ${forms.prep}`}
          align="center"
        />
        <div className="mt-8">
          <FAQ items={faq} />
        </div>
      </Section>

      {/* Смежные страницы */}
      {relatedLinks.length > 0 && (
        <Section tone="surface">
          <SectionHeader title="Смежные страницы" />
          <Reveal stagger className="mt-8 grid gap-3 sm:grid-cols-2">
            {relatedLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                data-reveal
                className="flex items-center justify-between gap-4 rounded-xl border border-border bg-bg px-5 py-4 text-base text-ink shadow-card transition duration-300 ease-osmo hover:border-ink hover:shadow-card-hover"
              >
                <span>{l.label}</span>
                <span aria-hidden className="text-muted">
                  →
                </span>
              </Link>
            ))}
          </Reveal>
        </Section>
      )}

      <CTASection title={finalCta.title} lead={finalCta.lead} cta={finalCta.cta} />
    </>
  );
}
