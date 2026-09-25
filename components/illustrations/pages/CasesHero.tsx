import { cases } from "@/content/cases";
import { pageCopy } from "@/content/visuals";
import { cn } from "@/lib/utils";
import { HeroFrame } from "../frame/HeroFrame";
import { Chip, LeadDot } from "../parts";
import { anim } from "../vars";

/* Сцена /cases: три результата из реальных кейсов. Цифра и подпись -
   дословно из cardMetrics (подпись без скобок-уточнений), мини-графики
   схематичные и без чисел. Кейс-образец, «в работе» или пропавший - строки нет. */

type Chart = "bars" | "curve" | "week";

const PICKS: { slug: string; metric: number; chart: Chart }[] = [
  { slug: "1kredit-kz", metric: 1, chart: "bars" },
  { slug: "sos-moving", metric: 0, chart: "curve" },
  { slug: "ski-resort-kz", metric: 0, chart: "week" },
];

const ROWS = PICKS.flatMap(({ slug, metric, chart }) => {
  const c = cases.find((x) => x.slug === slug);
  const m = c?.cardMetrics[metric];
  if (!c || !m || c.template || c.inProgress) return [];
  return [
    {
      slug,
      chart,
      name: c.client.split(" - ")[0],
      channels: c.channels,
      value: m.value,
      label: m.label.replace(/\s*\(.*\)\s*$/, ""),
    },
  ];
});

/** Таймлайн, с: строки каскадом → мини-графики (столбики, кривая, неделя) →
 *  точка заявки (1.6). Задержки строк явные: --i наследуется в графики. */
const ROW_IN = { delay: 0.6, step: 0.12 };
const at = (s: number) => Math.round(s * 100) / 100;
/** Кривая стартует, пока её строка ещё почти прозрачна: до старта кончик пути
 *  (dashoffset 1) рисовал бы точку. */
const CURVE_IN = { delay: 0.85, dur: 0.65 };

/** Рост с нуля: столбики. */
const BARS = [4, 9, 15, 23, 33, 45];
/** Неделя: точек в день (схема). */
const WEEK = [2, 2, 3, 2, 3, 2, 2];

/** Мини-график 10×5em (viewBox 100×50: 10 ед. = 1em). */
function MiniChart({ kind }: { kind: Chart }) {
  return (
    <svg
      viewBox="0 0 100 50"
      aria-hidden
      className="ill-detail h-[5em] w-[10em] shrink-0 overflow-visible"
    >
      {kind === "bars" &&
        BARS.map((h, i) => (
          <rect
            key={i}
            x={i * 17 + 1.5}
            y={48 - h}
            width="12"
            height={h}
            rx="1.6"
            className={cn("a-grow-y", i === BARS.length - 1 ? "text-ink" : "text-muted")}
            fill="currentColor"
            style={anim({ delay: 0.9, i, step: 0.06, dur: 0.5 })}
          />
        ))}
      {kind === "curve" && (
        <>
          <path
            d="M2 45 C22 44 34 39 50 30 S78 11 95 7"
            pathLength={1}
            className="a-draw text-ink-2"
            style={anim(CURVE_IN, { "--a-ease": "ease-in-out" })}
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          {/* Заливка под линией (сдвиг на полштриха - не перекрывает её) и точка - одним
              слоем, проявляются к концу прорисовки */}
          <g className="a-fade" style={anim({ delay: 1.3, dur: 0.4 })}>
            <path
              d="M2 46.2 C22 45.2 34 40.2 50 31.2 S78 12.2 95 8.2 V48 H2 Z"
              className="text-surface-2"
              fill="currentColor"
            />
            <circle cx="95" cy="7" r="3.2" className="text-ink" fill="currentColor" />
          </g>
        </>
      )}
      {kind === "week" &&
        WEEK.map((n, d) => (
          <g key={d} className="a-pop" style={anim({ delay: 1, i: d, step: 0.07 })}>
            {Array.from({ length: n }, (_, k) => (
              <circle
                key={k}
                cx={d * 14 + 8}
                cy={42 - k * 12}
                r="4.2"
                className={d === WEEK.length - 1 ? "text-ink" : "text-muted"}
                fill="currentColor"
              />
            ))}
          </g>
        ))}
      <path d="M0 49.5 H100" className="text-border" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

function CasesScene() {
  return (
    <div className="absolute inset-[1.2em] flex flex-col gap-[0.9em]">
      {ROWS.map((r, i) => (
        <div
          key={r.slug}
          className="a-rise flex min-h-0 flex-1 items-center gap-[1.4em] rounded-[1em] border border-border bg-surface px-[1.3em]"
          style={anim({ delay: at(ROW_IN.delay + i * ROW_IN.step) })}
        >
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-[0.6em]">
              <span className="ill-t-xl shrink-0 whitespace-nowrap font-semibold leading-[1.1] tracking-tight text-ink tabular-nums">
                {r.value}
              </span>
              {i === 0 && <LeadDot delay={1.6} />}
              <span className="ill-t-sm min-w-0 truncate text-muted">{r.label}</span>
            </div>
            <div className="mt-[0.5em] flex items-center gap-[0.8em]">
              <span className="ill-t-md shrink-0 font-medium text-ink-2">{r.name}</span>
              <span className="ill-detail flex min-w-0 gap-[0.35em]">
                {r.channels.map((ch) => (
                  <Chip key={ch} tone="outline">
                    {ch}
                  </Chip>
                ))}
              </span>
            </div>
          </div>
          <MiniChart kind={r.chart} />
        </div>
      ))}
    </div>
  );
}

/** Hero /cases: три результата из реальных кейсов (не образцы, не «в работе»). */
export function CasesHero() {
  return (
    <HeroFrame kind="cases" copy={pageCopy.cases}>
      <CasesScene />
    </HeroFrame>
  );
}
