import { readFile } from "node:fs/promises";
import path from "node:path";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { GuideArticle } from "@/components/sections/GuideArticle";
import { GuideToc } from "@/components/sections/GuideToc";
import { GuideOutroCta } from "@/components/sections/GuideOutroCta";
import { extractSections } from "@/lib/guide-toc";
import { guides, getGuide } from "@/content/guides";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return guides.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const g = getGuide(slug);
  if (!g) return {};
  return { title: g.title, description: g.description };
}

export default async function GuidePage({ params }: Params) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) notFound();

  // Статически ограничиваем путь подпапкой content/guides (динамично - только имя файла),
  // иначе Turbopack трассирует весь проект в бандл.
  const raw = await readFile(
    path.join(process.cwd(), "content/guides", guide.file),
    "utf8",
  );

  // Делим на тело гайда и финальный блок «Что дальше»: между ними - бонус-гейт.
  const marker = "\n## Что дальше";
  const i = raw.indexOf(marker);
  const body = i >= 0 ? raw.slice(0, i).trimEnd() : raw;
  const outro = i >= 0 ? raw.slice(i).trim() : "";

  const sections = extractSections(body);

  return (
    <>
      <Section>
        <div className="mx-auto max-w-3xl lg:max-w-5xl">
          <Link href="/" className="text-sm text-ink-2 hover:text-ink">
            ← На главную
          </Link>
          {guide.badge && (
            <div className="mt-6">
              <Badge>{guide.badge}</Badge>
            </div>
          )}
          <div className="mt-8 lg:grid lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-10">
            <div className="mb-8 lg:mb-0">
              <GuideToc sections={sections} />
            </div>
            <div className="min-w-0">
              <GuideArticle markdown={body} />
            </div>
          </div>
        </div>
      </Section>

      <GuideOutroCta bonus={guide.bonus} />

      {outro && (
        <Section>
          <div className="mx-auto max-w-3xl">
            <GuideArticle markdown={outro} />
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button href="/contacts" size="lg">
                Получить бесплатный аудит
              </Button>
              <Button href="/guides" variant="secondary" size="lg">
                Все гайды
              </Button>
            </div>
          </div>
        </Section>
      )}
    </>
  );
}
