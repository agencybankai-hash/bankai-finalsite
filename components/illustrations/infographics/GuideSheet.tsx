import { cn } from "@/lib/utils";
import { InView } from "@/components/motion/InView";
import { anim } from "../vars";

/* Длины строк-скелетонов чек-листа (доля свободной ширины строки). */
const ROWS = ["86%", "62%", "74%", "48%"];

/** Отогнутый уголок: срез в цвет подложки карточки + клапан. Единица = px. */
function Fold({ s }: { s: number }) {
  const e = s - 0.5;
  return (
    <svg
      viewBox={`0 0 ${s} ${s}`}
      aria-hidden
      className="absolute -right-px -top-px overflow-visible"
      style={{ width: s, height: s }}
    >
      <path d={`M0 0H${s}V${s}Z`} className="text-bg" fill="currentColor" />
      <path d={`M0.5 0.5V${e}H${e}Z`} className="text-surface-2" fill="currentColor" />
      <path
        d={`M0.5 0.5V${e}H${e}M0.5 0.5L${e} ${e}`}
        className="text-border"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Отмеченный пункт: рамка + галочка. Галочки прорисовываются по очереди
    (после проявления карточки Reveal): с 0.5 с, шаг 120 мс. */
function Checkbox({ compact, i }: { compact: boolean; i: number }) {
  return (
    <span
      className={cn(
        "relative shrink-0 rounded-[3px] border border-ink/30 bg-bg",
        compact ? "h-2 w-2" : "h-2.5 w-2.5",
      )}
    >
      <svg viewBox="0 0 10 10" className="absolute inset-0 h-full w-full overflow-visible">
        <path
          d="M2 5.3 4.2 7.4 8.4 2.6"
          pathLength={1}
          className="a-draw text-ink"
          style={anim({ delay: 0.5, i, step: 0.12, dur: 0.3 })}
          fill="none"
          stroke="currentColor"
          strokeWidth={compact ? 1.8 : 1.6}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

/** Лист: ярлык «гайд» со строкой заголовка и 4 отмеченных пункта. */
function Sheet({ compact }: { compact: boolean }) {
  return (
    <div
      className={cn(
        "relative rounded-sm border border-border bg-bg",
        compact ? "h-26 w-22 px-2.5 pt-3" : "h-full w-full px-4 pt-2.5",
      )}
    >
      <Fold s={compact ? 12 : 16} />
      <div className="flex items-center gap-2">
        <span className="rounded-full bg-surface-2 px-1.5 text-xs leading-4 font-medium text-ink-2">
          гайд
        </span>
        {!compact && <span className="h-1.5 w-20 rounded-full bg-ink/60" />}
      </div>
      <ul className={cn("flex flex-col", compact ? "mt-3 gap-[5px]" : "mt-2 gap-1")}>
        {ROWS.map((w, i) => (
          <li key={w} className={cn("flex items-center", compact ? "gap-1.5" : "gap-2")}>
            <Checkbox compact={compact} i={i} />
            <span className="h-1.5 rounded-full bg-ink/10" style={{ width: w }} />
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Лист гайда с чек-листом для карточки «Нет секретов» (без коралла).
 * Обычный - полоса 96px: лист выходит из-под линии основания (низ срезан).
 * compact - целый лист ~88px для горизонтальной карточки посадочной.
 */
export function GuideSheet({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <InView aria-hidden className="ig-scope shrink-0">
        <Sheet compact />
      </InView>
    );
  }
  return (
    <InView aria-hidden className="ig-scope mb-6 h-24">
      <div className="h-full max-w-72">
        <Sheet compact={false} />
      </div>
    </InView>
  );
}
