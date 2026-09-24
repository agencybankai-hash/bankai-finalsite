import { Reveal } from "@/components/motion/Reveal";
import { LeadDot } from "@/components/illustrations/parts";
import {
  ColumnStation,
  FunnelBand,
  FunnelColumn,
  columnPad,
  funnelShape,
} from "@/components/illustrations/infographics/FunnelBand";
import { cn } from "@/lib/utils";
import type { StatItem } from "@/content/types";

/**
 * Мини-воронка «канал → заявки» на страницах каналов: 4 карточки шагов и
 * лента-поток по форме канала (FunnelBand). С sm лента над карточками,
 * станции - по центрам карточек; на телефоне карточки стопкой, лента -
 * колонкой слева. Коралловая точка - перед итогом последнего шага.
 */
export function FunnelChain({
  chain,
  note,
  channel,
}: {
  chain: StatItem[];
  note?: string;
  /** Слаг канала: форма ленты-потока (сужение, «×2», три дорожки). */
  channel?: string;
}) {
  const shape = channel ? funnelShape(channel) : undefined;
  const last = chain.length - 1;
  return (
    <div>
      {shape && <FunnelBand shape={shape} />}
      <Reveal
        stagger
        className={cn(
          "relative grid gap-3 sm:grid-cols-4",
          shape ? cn("auto-rows-fr", columnPad(shape)) : "grid-cols-2",
        )}
      >
        {shape && <FunnelColumn shape={shape} />}
        {chain.map((c, i) => (
          <div
            key={c.label}
            data-reveal
            className="relative rounded-xl border border-border bg-bg p-5 shadow-card"
          >
            {shape && <ColumnStation shape={shape} i={i} />}
            <div className="text-xs text-muted">Шаг {i + 1}</div>
            <div className="mt-2 flex items-center gap-2 text-xl font-semibold text-ink">
              {shape && i === last && <LeadDot className="h-2 w-2" delay={1.3} />}
              {c.value}
            </div>
            <div className="mt-1 text-xs leading-snug text-ink-2">{c.label}</div>
          </div>
        ))}
      </Reveal>
      {note && <p className="mt-4 text-sm text-muted">{note}</p>}
    </div>
  );
}
