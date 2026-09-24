import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { HeroIllustration } from "@/components/illustrations/HeroIllustration";
import {
  resolveHeroVisual,
  resolvePageVisual,
  type ResolvedHeroVisual,
} from "@/components/illustrations/resolve";
import { ContactsHero } from "@/components/illustrations/pages/ContactsHero";
import { CasesHero } from "@/components/illustrations/pages/CasesHero";
import { Emblem } from "@/components/illustrations/emblems/Emblem";
import type { EmblemName } from "@/components/illustrations/emblems/names";
import { SystemMini } from "@/components/illustrations/infographics/SystemMini";
import { GuideSheet } from "@/components/illustrations/infographics/GuideSheet";
import { MetaphorCallout } from "@/components/sections/MetaphorCallout";
import { FunnelChain } from "@/components/sections/FunnelChain";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { LinkRow } from "@/components/sections/LinkGrid";
import { channels, getChannel } from "@/content/services";
import { landings } from "@/content/landings";
import type { HeroVisualKind } from "@/content/types";

/* Временная галерея иллюстраций для приёмки (только dev, удаляется до мёржа).
   ?only=seo|context|web|system|info|emblems - один трек в начале страницы. */

export const metadata: Metadata = { robots: { index: false, follow: false } };

type Track = "seo" | "context" | "web" | "system" | "info" | "emblems";

const TRACK_OF: Record<HeroVisualKind, Track> = {
  seo: "seo",
  "seo-store": "seo",
  "seo-regions": "seo",
  "seo-city": "seo",
  context: "context",
  "google-ads": "context",
  "yandex-direct": "context",
  "context-city": "context",
  web: "web",
  landing: "web",
  corporate: "web",
  ecommerce: "web",
  "web-city": "web",
  leadgen: "system",
};

const EMBLEMS: EmblemName[] = [
  "seo",
  "seo-store",
  "context",
  "google-ads",
  "yandex-direct",
  "web",
  "landing",
  "corporate",
  "ecommerce",
  "leadgen",
];

function Label({ children }: { children: React.ReactNode }) {
  return <div className="mb-3 font-mono text-xs text-muted">{children}</div>;
}

function HeroCell({ v, width = 490 }: { v: ResolvedHeroVisual; width?: number }) {
  return (
    <div style={{ width }}>
      <Label>
        {v.path} · {v.kind}
        {v.city ? ` · ${v.city}` : ""} · {width}px
      </Label>
      <HeroIllustration visual={v} />
    </div>
  );
}

export default async function IllustrationsGallery({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  if (process.env.NODE_ENV === "production") notFound();
  const only = (await searchParams).only as Track | undefined;
  const show = (t: Track) => !only || only === t;

  const all = [
    ...channels.map((c) => resolveHeroVisual(c)),
    ...landings.map((l) => resolveHeroVisual(getChannel(l.channel)!, l)),
    resolvePageVisual("/marketingovoe-agentstvo-astana"),
  ];
  const heroes = all.filter((v) => show(TRACK_OF[v.kind]));
  const isHub = (v: ResolvedHeroVisual) =>
    v.path.startsWith("/services/") && v.path.split("/").length === 3;
  const bases = heroes.filter(isHub);
  const rest = heroes.filter((v) => !isHub(v));

  return (
    <>
      {heroes.length > 0 && (
        <Section>
          <h1 className="text-h3 text-ink">Hero: хабы - 1280 / 1024 / телефон</h1>
          <div className="mt-12 flex flex-wrap items-start gap-x-12 gap-y-20">
            {bases.map((v) => (
              <HeroCell key={v.path} v={v} />
            ))}
            {bases.map((v) => (
              <HeroCell key={`${v.path}-1024`} v={v} width={429} />
            ))}
            {bases.map((v) => (
              <HeroCell key={`${v.path}-m`} v={v} width={335} />
            ))}
          </div>
        </Section>
      )}

      {show("system") && (
        <Section>
          <h2 className="text-h3 text-ink">Hero страниц: /contacts и /cases</h2>
          <div className="mt-12 flex flex-wrap items-start gap-x-12 gap-y-20">
            <div className="w-[490px]">
              <Label>/contacts · 490px</Label>
              <ContactsHero />
            </div>
            <div className="w-[490px]">
              <Label>/cases · 490px</Label>
              <CasesHero />
            </div>
            <div className="w-[335px]">
              <Label>/cases · телефон</Label>
              <CasesHero />
            </div>
          </div>
        </Section>
      )}

      {rest.length > 0 && (
        <Section tone="surface">
          <h2 className="text-h3 text-ink">Hero: посадочные и Астана</h2>
          <div className="mt-12 flex flex-wrap items-start gap-x-12 gap-y-20">
            {rest.map((v) => (
              <HeroCell key={v.path} v={v} />
            ))}
          </div>
        </Section>
      )}

      {show("emblems") && (
        <Section>
          <h2 className="text-h3 text-ink">Эмблемы</h2>
          <div className="mt-10 grid gap-3 sm:grid-cols-2">
            {EMBLEMS.map((name) => (
              <div
                key={name}
                className="group flex items-center gap-4 rounded-xl border border-border bg-bg px-5 py-4"
              >
                <Emblem name={name} />
                <Emblem name={name} geo />
                <Emblem name={name} size="lg" />
                <span className="font-mono text-xs text-muted">{name}</span>
              </div>
            ))}
          </div>
          <div className="mt-10 grid gap-3 sm:grid-cols-2">
            <LinkRow href="/services/leadgen" label="Лидогенерация под ключ" />
            <LinkRow href="/services/seo/prodvizhenie-saitov-almaty" label="Продвижение сайтов в Алматы" />
            <LinkRow href="/services/context/nastroika-yandex-direct" label="Настройка и ведение Яндекс Директа" />
            <LinkRow href="/services/web/sozdanie-internet-magazina-almaty" label="Создание интернет-магазина в Алматы" />
          </div>
        </Section>
      )}

      {show("info") && (
        <>
          {channels
            .filter((c) => c.metaphor)
            .map((c) => (
              <MetaphorCallout key={c.slug} channel={c.slug} text={c.metaphor!} />
            ))}

          {channels.map((c) => (
            <Section key={c.slug}>
              <Label>FunnelChain · {c.slug}</Label>
              <h2 className="text-h3 text-ink">{c.funnel.title}</h2>
              <div className="mt-10">
                <FunnelChain chain={c.funnel.chain} note={c.funnel.note} channel={c.slug} />
              </div>
            </Section>
          ))}

          <Section tone="surface">
            <h2 className="text-h3 text-ink">Без чёрных ящиков</h2>
            <div className="mt-10 grid gap-5 sm:grid-cols-2">
              {(["seo", "context", "web"] as const).map((s) => (
                <div key={s} className="flex flex-col rounded-2xl border border-border bg-bg p-8 shadow-card">
                  <SystemMini highlight={s} />
                  <h3 className="text-h3 text-ink">Часть системы · {s}</h3>
                </div>
              ))}
              <div className="flex flex-col rounded-2xl border border-border bg-bg p-8 shadow-card">
                <GuideSheet />
                <h3 className="text-h3 text-ink">Нет секретов</h3>
              </div>
            </div>
            <div className="mt-5 flex flex-col gap-5 rounded-2xl border border-border bg-bg p-7 shadow-card sm:flex-row sm:items-center sm:justify-between">
              <GuideSheet compact />
              <div>
                <h3 className="text-h3 text-ink">Нет секретов · посадочная</h3>
              </div>
            </div>
          </Section>

          <Section>
            <Label>ProcessSteps · seo (7 шагов)</Label>
            <ProcessSteps steps={getChannel("seo")!.process} />
          </Section>
        </>
      )}

      <Container className="py-10">
        <Label>конец галереи</Label>
      </Container>
    </>
  );
}
