import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Blobs } from "@/components/ui/Blobs";
import { nbsp } from "@/lib/utils";
import { leadMagnet } from "@/content/site";

const channelGuides = [
  { label: "SEO", href: "/guides/seo" },
  { label: "Контекст", href: "/guides/context" },
  { label: "Лендинг", href: "/guides/landing" },
];

export function LeadMagnet() {
  return (
    <Section tone="ink" leading className="relative overflow-hidden">
      <Blobs tone="dark" />
      <Container>
        <div className="relative grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="text-h2 text-ink">{nbsp(leadMagnet.title)}</h2>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-ink-2">
              {nbsp(leadMagnet.text)}
            </p>
            <div className="mt-8">
              <Button href={leadMagnet.cta.href} size="lg" variant="accent">
                {leadMagnet.cta.label}
              </Button>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
              <span className="text-muted">Или по каналам:</span>
              {channelGuides.map((g) => (
                <Link
                  key={g.href}
                  href={g.href}
                  className="font-medium text-ink underline underline-offset-4 hover:text-ink-2"
                >
                  {g.label}
                </Link>
              ))}
            </div>
            <p className="mt-6 max-w-md text-sm text-muted">
              {nbsp(leadMagnet.note)}
            </p>
          </div>

          <ul className="space-y-3 rounded-2xl border border-border bg-surface p-7 shadow-float">
            {leadMagnet.bullets.map((b) => (
              <li
                key={b}
                className="flex gap-3 text-sm leading-relaxed text-ink-2"
              >
                <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                {nbsp(b)}
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </Section>
  );
}
