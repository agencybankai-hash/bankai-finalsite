import { Reveal } from "@/components/motion/Reveal";
import type { StatItem } from "@/content/types";

/** Мини-воронка «канал → заявки» на под-страницах услуг. */
export function FunnelChain({
  chain,
  note,
}: {
  chain: StatItem[];
  note?: string;
}) {
  return (
    <div>
      <Reveal stagger className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {chain.map((c, i) => (
          <div
            key={c.label}
            data-reveal
            className="rounded-xl border border-border bg-bg p-5 shadow-card"
          >
            <div className="text-xs text-muted">Шаг {i + 1}</div>
            <div className="mt-2 text-xl font-semibold text-ink">{c.value}</div>
            <div className="mt-1 text-xs leading-snug text-ink-2">{c.label}</div>
          </div>
        ))}
      </Reveal>
      {note && <p className="mt-4 text-sm text-muted">{note}</p>}
    </div>
  );
}
