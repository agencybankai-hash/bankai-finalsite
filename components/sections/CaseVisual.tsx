import type { CaseStudy } from "@/content/types";

/*
  Оригинальные мок-визуалы для кейсов-образцов.
  НЕ скриншоты реальных проектов и НЕ копии чужих кейсов - схемы результата
  под цифры конкретного образца, на дизайн-токенах сайта (нейтральная палитра).
  Цвет не несёт смысла: иерархия - размером и контрастом ink / ink-2 / muted.
*/

const CAPTION = "Иллюстрация - схема результата под цифры кейса. Не реальный скриншот.";

function VisualCard({
  toolbar,
  caption = CAPTION,
  children,
}: {
  toolbar: string;
  caption?: string;
  children: React.ReactNode;
}) {
  return (
    <figure className="mx-auto max-w-4xl overflow-hidden rounded-xl border border-border bg-bg">
      <div className="flex items-center gap-2 border-b border-border bg-surface px-4 py-2.5">
        <span aria-hidden className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-border" />
          <span className="h-2.5 w-2.5 rounded-full bg-border" />
          <span className="h-2.5 w-2.5 rounded-full bg-border" />
        </span>
        <span className="ml-1 truncate text-xs text-muted">{toolbar}</span>
      </div>
      <div className="p-4 sm:p-6">{children}</div>
      <figcaption className="border-t border-border px-4 py-2.5 text-xs text-muted">
        {caption}
      </figcaption>
    </figure>
  );
}

/** Подпись метрики «до → после» в виде чипа. */
function DeltaChip({
  label,
  before,
  after,
}: {
  label: string;
  before: string;
  after: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-surface px-4 py-3">
      <div className="text-xs text-muted">{label}</div>
      <div className="mt-1 flex items-baseline gap-1.5">
        <span className="text-base text-muted">{before}</span>
        <span aria-hidden className="text-muted">
          →
        </span>
        <span className="text-xl font-semibold text-ink">{after}</span>
      </div>
    </div>
  );
}

/* ─────────────────────────  SEO  ───────────────────────── */
/* Линия роста органического трафика 3 100 → 14 900 + позиции. */
function SeoVisual() {
  // 9 точек, value→y по шкале 0..16000 в области y 40..230
  const points = [
    [50, 193],
    [119, 187],
    [188, 180],
    [256, 168],
    [325, 153],
    [394, 133],
    [463, 105],
    [531, 79],
    [600, 53],
  ];
  const line = points.map((p) => p.join(",")).join(" ");
  const area = `M50,230 L${line.replace(/ /g, " L")} L600,230 Z`;
  const grid = [40, 87.5, 135, 182.5, 230];
  const yLabels = ["16k", "12k", "8k", "4k", "0"];
  const xLabels = ["М1", "М2", "М3", "М4", "М5", "М6", "М7", "М8", "М9"];

  return (
    <VisualCard toolbar="Аналитика · органический трафик / мес · 9 месяцев">
      <svg
        viewBox="0 0 640 268"
        className="h-auto w-full"
        role="img"
        aria-label="График роста органического трафика с 3 100 до 14 900 визитов в месяц"
      >
        {grid.map((y, i) => (
          <g key={y}>
            <line
              x1="48"
              x2="612"
              y1={y}
              y2={y}
              className="text-border"
              stroke="currentColor"
              strokeWidth="1"
            />
            <text
              x="42"
              y={y + 3}
              textAnchor="end"
              className="text-muted"
              fill="currentColor"
              fontSize="10"
            >
              {yLabels[i]}
            </text>
          </g>
        ))}
        <path d={area} className="text-surface-2" fill="currentColor" />
        <polyline
          points={line}
          className="text-ink"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        <circle cx="50" cy="193" r="3.5" className="text-muted" fill="currentColor" />
        <circle cx="600" cy="53" r="4" className="text-ink" fill="currentColor" />
        <text x="58" y="210" className="text-muted" fill="currentColor" fontSize="11">
          3 100
        </text>
        <text
          x="596"
          y="44"
          textAnchor="end"
          className="text-ink"
          fill="currentColor"
          fontSize="13"
          fontWeight="600"
        >
          14 900
        </text>
        {points.map((p, i) => (
          <text
            key={i}
            x={p[0]}
            y="252"
            textAnchor="middle"
            className="text-muted"
            fill="currentColor"
            fontSize="10"
          >
            {xLabels[i]}
          </text>
        ))}
      </svg>
      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <DeltaChip label="Запросов в топ-10" before="40" after="1 950" />
        <DeltaChip label="Запросов в топ-3" before="5" after="420" />
        <DeltaChip label="Доля органики в продажах" before="9%" after="38%" />
      </div>
    </VisualCard>
  );
}

/* ──────────────────────  Контекст  ────────────────────── */
/* KPI-плитки + нисходящая линия CPL 18 000 → 5 200 ₸ + сплит каналов. */
function ContextVisual() {
  const cpl = [
    [40, 150],
    [154, 190],
    [268, 222],
    [382, 244],
    [496, 262],
    [610, 270],
  ];
  const line = cpl.map((p) => p.join(",")).join(" ");
  const area = `M40,288 L${line.replace(/ /g, " L")} L610,288 Z`;

  return (
    <VisualCard toolbar="Рекламный кабинет · контекст · сводка за сезон">
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-lg border border-border bg-surface px-3 py-3 text-center">
          <div className="text-xl font-semibold text-ink sm:text-2xl">5 200 ₸</div>
          <div className="mt-1 text-xs text-muted">CPL · ↓ 71%</div>
        </div>
        <div className="rounded-lg border border-border bg-surface px-3 py-3 text-center">
          <div className="text-xl font-semibold text-ink sm:text-2xl">86</div>
          <div className="mt-1 text-xs text-muted">заявок / мес</div>
        </div>
        <div className="rounded-lg border border-border bg-surface px-3 py-3 text-center">
          <div className="text-xl font-semibold text-ink sm:text-2xl">6,8x</div>
          <div className="mt-1 text-xs text-muted">ROAS</div>
        </div>
      </div>

      <div className="mt-5 text-xs text-muted">Стоимость заявки по неделям, ₸</div>
      <svg
        viewBox="0 0 640 300"
        className="mt-1 h-auto w-full"
        role="img"
        aria-label="Снижение стоимости заявки с 18 000 до 5 200 тенге"
      >
        {[150, 196, 242, 288].map((y) => (
          <line
            key={y}
            x1="40"
            x2="610"
            y1={y}
            y2={y}
            className="text-border"
            stroke="currentColor"
            strokeWidth="1"
          />
        ))}
        <path d={area} className="text-surface-2" fill="currentColor" />
        <polyline
          points={line}
          className="text-ink"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        <circle cx="40" cy="150" r="4" className="text-ink" fill="currentColor" />
        <circle cx="610" cy="270" r="4" className="text-ink" fill="currentColor" />
        <text x="48" y="142" className="text-ink" fill="currentColor" fontSize="13" fontWeight="600">
          18 000
        </text>
        <text x="602" y="262" textAnchor="end" className="text-ink" fill="currentColor" fontSize="13" fontWeight="600">
          5 200
        </text>
      </svg>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-lg border border-border bg-surface px-4 py-3">
          <div className="text-xs text-muted">CPL · Google Ads</div>
          <div className="mt-1 text-lg font-semibold text-ink">4 800 ₸</div>
        </div>
        <div className="rounded-lg border border-border bg-surface px-4 py-3">
          <div className="text-xs text-muted">CPL · Яндекс.Директ</div>
          <div className="mt-1 text-lg font-semibold text-ink">5 600 ₸</div>
        </div>
      </div>
    </VisualCard>
  );
}

/* ──────────────────────  Разработка  ──────────────────── */
/* Браузерные макеты «Было / Стало» + конверсия и отказы. */
function BrowserFrame({
  label,
  speed,
  variant,
}: {
  label: string;
  speed: string;
  variant: "before" | "after";
}) {
  const dim = variant === "before";
  return (
    <div className="flex-1 overflow-hidden rounded-lg border border-border bg-bg">
      <div className="flex items-center gap-1.5 border-b border-border bg-surface px-3 py-2">
        <span aria-hidden className="flex gap-1">
          <span className="h-2 w-2 rounded-full bg-border" />
          <span className="h-2 w-2 rounded-full bg-border" />
          <span className="h-2 w-2 rounded-full bg-border" />
        </span>
        <span className="ml-1 h-2.5 flex-1 rounded bg-surface-2" />
        <span className="rounded border border-border px-1.5 py-0.5 text-[10px] text-muted">
          {speed}
        </span>
      </div>
      <div className={dim ? "space-y-2 p-3 opacity-50" : "p-3"}>
        {dim ? (
          <>
            <div className="h-3 w-2/3 rounded bg-surface-2" />
            <div className="h-2 w-full rounded bg-surface-2" />
            <div className="h-2 w-5/6 rounded bg-surface-2" />
            <div className="h-16 w-full rounded bg-surface-2" />
            <div className="h-2 w-1/2 rounded bg-surface-2" />
          </>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <div className="h-3 w-16 rounded bg-ink" />
              <div className="h-2.5 w-20 rounded bg-surface-2" />
            </div>
            <div className="mt-2 h-3 w-3/4 rounded bg-surface-2" />
            <div className="mt-3 grid grid-cols-3 gap-1.5">
              <div className="h-10 rounded bg-surface-2" />
              <div className="h-10 rounded bg-surface-2" />
              <div className="h-10 rounded bg-surface-2" />
            </div>
            <div className="mt-3 flex items-center gap-1.5">
              <div className="h-6 w-24 rounded bg-ink" />
              <div className="h-6 w-6 rounded border border-border" />
            </div>
          </>
        )}
      </div>
      <div className="border-t border-border px-3 py-1.5 text-center text-[11px] text-muted">
        {label}
      </div>
    </div>
  );
}

function WebVisual() {
  return (
    <VisualCard toolbar="Сайт · до и после редизайна">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
        <BrowserFrame label="Было" speed="6,0 с" variant="before" />
        <div
          aria-hidden
          className="hidden items-center justify-center text-2xl text-muted sm:flex"
        >
          →
        </div>
        <BrowserFrame label="Стало" speed="1,4 с" variant="after" />
      </div>
      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <DeltaChip label="Конверсия в заявку" before="0,8%" after="2,6%" />
        <DeltaChip label="Показатель отказов" before="71%" after="38%" />
        <DeltaChip label="Заявок на КП / мес" before="12" after="34" />
      </div>
    </VisualCard>
  );
}

/* ────────────────────  Комбинированный  ──────────────── */
/* Воронка клик→заявка→оплата + сплит каналов по доле оплат. */
function CombinedVisual() {
  const funnel = [
    { label: "Клики / трафик", w: "100%" },
    { label: "Заявки", w: "46%" },
    { label: "Оплаты", w: "22%" },
  ];
  const channels = [
    { label: "Контекст", pct: 44 },
    { label: "Органика", pct: 33 },
    { label: "Прямые / сарафан", pct: 23 },
  ];
  return (
    <VisualCard toolbar="Сквозная аналитика · воронка и доля оплат по каналам">
      <div className="grid grid-cols-2 gap-3">
        <DeltaChip label="Оплат / мес" before="65" after="150" />
        <div className="rounded-lg border border-border bg-surface px-4 py-3">
          <div className="text-xs text-muted">Стоимость оплаты</div>
          <div className="mt-1 text-xl font-semibold text-ink">−47%</div>
        </div>
      </div>

      <div className="mt-5 space-y-2">
        <div className="text-xs text-muted">Воронка: клик → заявка → оплата</div>
        {funnel.map((s, i) => (
          <div key={s.label} className="flex items-center gap-3">
            <div className="h-8 flex-1 rounded bg-surface-2">
              <div
                className={
                  i === funnel.length - 1
                    ? "flex h-8 items-center rounded bg-ink px-3 text-xs font-medium text-bg"
                    : "flex h-8 items-center rounded bg-surface-2 px-3 text-xs text-ink-2 ring-1 ring-inset ring-border"
                }
                style={{ width: s.w }}
              >
                {s.label}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5">
        <div className="text-xs text-muted">Доля оплат по каналам</div>
        <div className="mt-2 flex h-8 overflow-hidden rounded border border-border">
          {channels.map((c, i) => (
            <div
              key={c.label}
              className={
                i === 0
                  ? "flex items-center justify-center bg-ink text-[11px] font-medium text-bg"
                  : i === 1
                    ? "flex items-center justify-center bg-surface-2 text-[11px] text-ink-2"
                    : "flex items-center justify-center bg-surface text-[11px] text-muted"
              }
              style={{ width: `${c.pct}%` }}
            >
              {c.pct}%
            </div>
          ))}
        </div>
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-2">
          {channels.map((c) => (
            <span key={c.label}>
              {c.label} — {c.pct}%
            </span>
          ))}
        </div>
      </div>
    </VisualCard>
  );
}

const VISUALS: Record<NonNullable<CaseStudy["visual"]>, () => React.ReactElement> = {
  seo: SeoVisual,
  context: ContextVisual,
  web: WebVisual,
  combined: CombinedVisual,
};

export function CaseVisual({ kind }: { kind: NonNullable<CaseStudy["visual"]> }) {
  const Component = VISUALS[kind];
  return <Component />;
}
