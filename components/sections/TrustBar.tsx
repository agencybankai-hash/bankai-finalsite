import { Container } from "@/components/ui/Container";
import { Stat } from "@/components/ui/Stat";
import { Reveal } from "@/components/motion/Reveal";
import type { StatItem } from "@/content/types";

export function TrustBar({ items }: { items: StatItem[] }) {
  return (
    <div className="border-b border-border bg-surface">
      <Container>
        {/* Четыре в ряд - с lg, как цифры на /about: в четверти планшета
            «до -40%» не помещается. На телефоне у плитки поле меньше. */}
        <Reveal stagger className="grid grid-cols-2 gap-4 py-10 lg:grid-cols-4">
          {items.map((s) => (
            <div
              key={s.label}
              data-reveal
              className="rounded-xl border border-border bg-bg p-4 shadow-card sm:p-6"
            >
              <Stat value={s.value} label={s.label} animate />
            </div>
          ))}
        </Reveal>
      </Container>
    </div>
  );
}
