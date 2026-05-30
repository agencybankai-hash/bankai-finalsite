import type { Metadata } from "next";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Stat } from "@/components/ui/Stat";
import { MediaPlaceholder } from "@/components/ui/MediaPlaceholder";
import { Hero } from "@/components/sections/Hero";
import { FeatureGrid } from "@/components/sections/FeatureGrid";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { CTASection } from "@/components/sections/CTASection";
import { about } from "@/content/about";
import { process, finalCta } from "@/content/site";

export const metadata: Metadata = {
  title: "О нас",
  description: about.hero.lead,
};

export default function AboutPage() {
  return (
    <>
      <Hero
        title={about.hero.title}
        subtitle={about.hero.lead}
      />

      {/* История */}
      <Section>
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <SectionHeader title={about.story.title} />
            <div className="mt-8">
              <MediaPlaceholder label="Видео: о подходе (запись)" ratio="16/9" />
              <p className="mt-3 text-sm text-muted">
                Короткий ролик для тех, кому удобнее посмотреть, чем читать.
              </p>
            </div>
          </div>
          <div className="space-y-8">
            {about.story.blocks.map((b) => (
              <div key={b.heading}>
                <h3 className="text-base font-semibold text-ink">{b.heading}</h3>
                <p className="mt-2 text-base leading-relaxed text-ink-2">
                  {b.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Принципы */}
      <Section tone="surface">
        <SectionHeader title="Во что мы верим" />
        <div className="mt-10">
          <FeatureGrid items={about.principles} columns={2} />
        </div>
      </Section>

      {/* Цифры */}
      <Section>
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {about.stats.map((s) => (
            <Stat key={s.label} value={s.value} label={s.label} />
          ))}
        </div>
      </Section>

      {/* Команда */}
      <Section tone="surface">
        <SectionHeader
          title={about.team.title}
          lead={about.team.note}
        />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {about.team.members.map((m) => (
            <div
              key={m.role}
              className="rounded-xl border border-border bg-bg p-6"
            >
              <div className="h-14 w-14 rounded-full border border-dashed border-border bg-surface-2" />
              <div className="mt-4 text-base font-semibold text-ink">{m.role}</div>
              <div className="mt-1 text-sm text-ink-2">{m.note}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* Дальше - отдел продаж */}
      <Section>
        <div className="grid gap-8 lg:grid-cols-2">
          <SectionHeader title={about.beyond.title} />
          <div>
            <p className="text-base leading-relaxed text-ink-2">
              {about.beyond.text}
            </p>
            <p className="mt-4 text-base leading-relaxed text-ink-2">
              {about.beyond.text2}
            </p>
            <div className="mt-5 rounded-lg border-l-2 border-ink bg-surface-2 px-4 py-3">
              <p className="text-sm text-ink">{about.beyond.note}</p>
            </div>
          </div>
        </div>
      </Section>

      {/* Как мы работаем */}
      <Section tone="surface">
        <SectionHeader title={process.title} />
        <div className="mt-10">
          <ProcessSteps steps={process.steps} />
        </div>
      </Section>

      {/* Гео */}
      <Section>
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionHeader title={about.geo.title} />
            <p className="mt-4 text-base leading-relaxed text-ink-2">
              {about.geo.text}
            </p>
          </div>
          <MediaPlaceholder label="Гео присутствия: KZ + US" ratio="4/3" />
        </div>
      </Section>

      <CTASection title={finalCta.title} lead={finalCta.lead} cta={finalCta.cta} />
    </>
  );
}
