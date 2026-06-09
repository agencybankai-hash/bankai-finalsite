import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Blobs } from "@/components/ui/Blobs";
import { Reveal } from "@/components/motion/Reveal";
import type { Cta } from "@/content/types";

export function CTASection({
  title,
  lead,
  cta,
}: {
  title: string;
  lead: string;
  cta: Cta;
}) {
  return (
    <Section tone="ink" leading className="relative overflow-hidden">
      <Blobs tone="dark" />
      <Container>
        <Reveal stagger className="relative mx-auto max-w-2xl text-center">
          <h2 data-reveal className="text-h2 text-ink">
            {title}
          </h2>
          <p data-reveal className="mt-4 text-lead text-ink-2">
            {lead}
          </p>
          <div data-reveal className="mt-8 flex justify-center">
            <Button href={cta.href} size="lg" variant="accent">
              {cta.label}
            </Button>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
