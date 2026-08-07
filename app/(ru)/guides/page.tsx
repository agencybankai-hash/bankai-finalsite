import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Badge } from "@/components/ui/Badge";
import { Hero } from "@/components/sections/Hero";
import { Reveal } from "@/components/motion/Reveal";
import { nbsp } from "@/lib/utils";
import { guides } from "@/content/guides";

export const metadata: Metadata = {
  title: "Гайды по интернет-маркетингу, SEO, контексту и лендингам",
  description:
    "Бесплатные гайды Bankai: SEO, контекстная реклама, лендинги и связка каналов в систему лидогенерации. С формулами, порогами и чек-листами.",
  alternates: { canonical: "/guides" },
};

export default function GuidesPage() {
  return (
    <>
      <Hero
        title="Гайды по интернет-маркетингу: SEO, контекст, лендинги"
        subtitle="Раздаём всё, что знаем, бесплатно: как привести заявки через SEO, контекст и сайт. С формулами, порогами и чек-листами. Хотите - делайте сами, нужен подрядчик - вы знаете, к кому."
        badge="Гайды"
        visual={false}
      />

      <Section>
        <Reveal stagger className="grid gap-6 sm:grid-cols-2">
          {guides.map((g) => (
            <Link
              key={g.slug}
              href={`/guides/${g.slug}`}
              data-reveal
              className="group flex flex-col rounded-xl border border-border bg-bg p-7 shadow-card transition duration-300 ease-osmo hover:-translate-y-1 hover:border-ink hover:shadow-card-hover"
            >
              {g.badge && (
                <div className="flex flex-wrap gap-2">
                  <Badge>{g.badge}</Badge>
                </div>
              )}
              <h2 className="mt-6 text-xl font-semibold leading-snug tracking-tight text-ink sm:text-2xl">
                {nbsp(g.title)}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-ink-2">
                {nbsp(g.description)}
              </p>
              <span className="mt-auto inline-flex items-center gap-1.5 pt-6 text-sm font-medium text-ink">
                Читать гайд
                <span
                  aria-hidden
                  className="transition-transform duration-300 ease-osmo group-hover:translate-x-1"
                >
                  →
                </span>
              </span>
            </Link>
          ))}
        </Reveal>
      </Section>
    </>
  );
}
