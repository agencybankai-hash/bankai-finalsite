import type { Metadata } from "next";
import Link from "next/link";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Badge } from "@/components/ui/Badge";
import { nbsp } from "@/lib/utils";
import { guides } from "@/content/guides";

export const metadata: Metadata = {
  title: "Гайды по интернет-маркетингу, SEO, контексту и лендингам",
  description:
    "Бесплатные гайды Bankai: SEO, контекстная реклама, лендинги и связка каналов в систему лидогенерации. С формулами, порогами и чек-листами.",
};

export default function GuidesPage() {
  return (
    <Section>
      <SectionHeader
        title="Гайды"
        lead="Раздаём всё, что знаем, бесплатно: как привести заявки через SEO, контекст и сайт. С формулами, порогами и чек-листами. Хотите - делайте сами, нужен подрядчик - вы знаете, к кому."
      />
      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {guides.map((g) => (
          <Link
            key={g.slug}
            href={`/guides/${g.slug}`}
            className="group flex flex-col rounded-xl border border-border bg-bg p-6 transition-colors hover:border-ink sm:p-8"
          >
            {g.badge && <Badge>{g.badge}</Badge>}
            <h2 className="mt-4 text-xl font-semibold leading-snug tracking-tight text-ink sm:text-2xl">
              {nbsp(g.title)}
            </h2>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-2">
              {nbsp(g.description)}
            </p>
            <span className="mt-5 text-sm font-medium text-ink group-hover:underline">
              Читать гайд →
            </span>
          </Link>
        ))}
      </div>
    </Section>
  );
}
