import Link from "next/link";
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
import { finalCta, serviceChannelsNav } from "@/content/site";
import { breadcrumbLd, ldJson } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/metadata";

export const generateMetadata = pageMetadata({
  title: "Кейсы по SEO, рекламе и сайтам в Казахстане и США",
  description:
    "Результаты проектов на рынках Казахстана и США: заявки, рост трафика и выручки.",
  path: "/cases",
});

const breadcrumb = breadcrumbLd([
  { name: "Главная", path: "/" },
  { name: "Кейсы", path: "/cases" },
]);

export default function CasesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={ldJson(breadcrumb)}
      />

      <Hero
        title="Кейсы по SEO, рекламе и сайтам в Казахстане и США"
        subtitle={`${casesIntro.title}. ${casesIntro.lead}`}
      />

      <TrustBar items={casesStats} />

      {/* Проза хаба: что считается результатом + выход на страницы услуг */}
      <Section>
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <SectionHeader title="Что мы считаем результатом" />
            <div className="mt-4 space-y-4 text-base leading-relaxed text-ink-2">
              <p>
                Каждый кейс здесь - связка из одного-трёх каналов: SEO,
                контекстной рекламы и сайта. Мы показываем задачу на входе, что
                именно делали и какие цифры получились: сколько заявок, по какой
                цене, что стало с трафиком и выручкой там, где клиент разрешил
                её назвать.
              </p>
              <p>
                Ниши разные - финтех, переезды, горнолыжный курорт, B2B SaaS, -
                но порядок работы один: сначала считаем экономику заявки, потом
                выбираем канал, и только потом запускаем. Поэтому кейсы читаются
                как разбор решений, а не как витрина цифр: рядом с результатом
                есть и то, что не сработало.
              </p>
              <p>
                Позиций и сроков мы не обещаем ни в кейсах, ни в договоре -
                отвечаем за заявки и за то, что видно в цифрах.
              </p>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-ink">
              Услуги, из которых собраны эти результаты
            </h2>
            <p className="mt-3 text-base leading-relaxed text-ink-2">
              Тот же набор работ, описанный по каналам: что входит, сколько
              занимает и сколько стоит.
            </p>
            <div className="mt-6 space-y-3">
              {serviceChannelsNav.map((s) => (
                <Link
                  key={s.href}
                  href={s.href}
                  className="flex items-center justify-between gap-4 rounded-xl border border-border bg-bg px-5 py-4 text-base text-ink shadow-card transition duration-300 ease-osmo hover:border-ink hover:shadow-card-hover"
                >
                  <span>{s.label}</span>
                  <span aria-hidden className="text-muted">
                    →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {kzCases.length > 0 && (
        <Section>
          <SectionHeader
            title="Кейсы в Казахстане"
            lead="Проекты на домашнем рынке - Алматы и регионы Казахстана."
          />
          <div className="mt-10">
            <CaseGrid items={[...kzCases, ...templateCases]} />
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

      <CTASection title={finalCta.title} lead={finalCta.lead} cta={finalCta.cta} />
    </>
  );
}
