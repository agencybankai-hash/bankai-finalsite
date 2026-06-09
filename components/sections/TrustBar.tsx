import { Container } from "@/components/ui/Container";
import { Stat } from "@/components/ui/Stat";
import { Reveal } from "@/components/motion/Reveal";
import type { StatItem } from "@/content/types";

export function TrustBar({ items }: { items: StatItem[] }) {
  return (
    <div className="border-b border-border bg-surface">
      <Container>
        <Reveal stagger className="grid grid-cols-2 gap-4 py-10 sm:grid-cols-4">
          {items.map((s) => (
            <div
              key={s.label}
              data-reveal
              className="rounded-xl border border-border bg-bg p-6 shadow-card"
            >
              <Stat value={s.value} label={s.label} animate />
            </div>
          ))}
        </Reveal>
      </Container>
    </div>
  );
}
