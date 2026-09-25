/*
  Лента-поток FunnelChain: форма по каналу - сужение (реклама), ворота ТОПа
  (SEO), «тот же трафик → ×2» (сайт), три дорожки (лидген).
  Координаты: вдоль ленты 0..1000 (карточки - четверти, станции в центрах
  125/375/625/875, переходы у стыков 250/500/750), поперёк - px толщины области.
  SVG растянут (preserveAspectRatio="none"): обводки non-scaling-stroke,
  точки станций и подписи - HTML, по сетке карточек.
  Десктоп (sm+) - лента над карточками, телефон - вертикальная колонка слева.
*/

type Pt = readonly [number, number];
type Edge = readonly [number, number];

type Ribbon = {
  from: number;
  to: number;
  /** Кромки [верх, низ] на участке каждой из 4 карточек. */
  stages: readonly Edge[];
  /** Пунктирный контур без заливки - «было». */
  ghost?: boolean;
};

export type FunnelShape = {
  /** Толщина области ленты, px (ширина колонки на телефоне). */
  size: number;
  ribbons: Ribbon[];
  /** Поперечная позиция точки-станции по карточкам; null - станцию обозначает другое. */
  stations: (number | null)[];
  /** Ворота ТОП-10: позиция вдоль ленты. */
  gate?: number;
  /** Подписи над стыками карточек: 1 - между шагами 1 и 2 и т.д. */
  notes?: { at: 1 | 2 | 3; text: string }[];
  /** Дорожки у станции 2: подписи (десктоп) или точки (телефон). */
  lanes?: { c: number; text: string }[];
  /** Подписи у правого конца лент. */
  ends?: { c: number; text: string; strong?: boolean }[];
};

const SHAPES: Record<string, FunnelShape> = {
  // Бюджет → Клики → Заявки → Сделки: поток сужается на каждом шаге
  context: {
    size: 48,
    ribbons: [
      {
        from: 0,
        to: 1000,
        stages: [
          [4, 44],
          [9.5, 38.5],
          [16, 32],
          [19.5, 28.5],
        ],
      },
    ],
    stations: [24, 24, 24, 24],
    notes: [
      { at: 1, text: "₸ за клик" },
      { at: 3, text: "CRM" },
    ],
  },
  // ТОП-10 → Клики → Заявки → Выручка: поток начинается за воротами выдачи
  seo: {
    size: 48,
    ribbons: [
      {
        from: 125,
        to: 1000,
        stages: [
          [9.5, 38.5],
          [9.5, 38.5],
          [16, 32],
          [19.5, 28.5],
        ],
      },
    ],
    stations: [null, 24, 24, 24],
    gate: 125,
    notes: [{ at: 1, text: "0 ₸ за клик" }],
  },
  // Трафик → Конверсия → Заявки → x2: не воронка - тот же поток, заявок вдвое больше
  web: {
    size: 48,
    ribbons: [
      {
        from: 560,
        to: 930,
        stages: [
          [33, 45],
          [33, 45],
          [33, 45],
          [33, 45],
        ],
        ghost: true,
      },
      {
        from: 0,
        to: 930,
        stages: [
          [12, 36],
          [12, 36],
          [6, 30],
          [6, 30],
        ],
      },
    ],
    stations: [24, 24, 18, 18],
    notes: [{ at: 1, text: "тот же трафик" }],
    ends: [
      { c: 18, text: "×2", strong: true },
      { c: 39, text: "было" },
    ],
  },
  // Аудит → 3 канала → Заявки → Выручка: линия делится на дорожки и сходится в ленту
  leadgen: {
    size: 56,
    ribbons: [
      {
        from: 0,
        to: 560,
        stages: [
          [25, 31],
          [4, 10],
          [10, 16],
          [10, 16],
        ],
      },
      {
        from: 0,
        to: 560,
        stages: [
          [25, 31],
          [25, 31],
          [25, 31],
          [25, 31],
        ],
      },
      {
        from: 0,
        to: 560,
        stages: [
          [25, 31],
          [46, 52],
          [40, 46],
          [40, 46],
        ],
      },
      {
        from: 560,
        to: 1000,
        stages: [
          [10, 46],
          [10, 46],
          [10, 46],
          [14, 42],
        ],
      },
    ],
    stations: [28, null, 28, 28],
    lanes: [
      { c: 7, text: "сайт" },
      { c: 28, text: "SEO" },
      { c: 49, text: "реклама" },
    ],
  },
};

export function funnelShape(channel: string): FunnelShape | undefined {
  return SHAPES[channel];
}

/* ── Геометрия ── */

const JOINTS = [250, 500, 750] as const; // стыки карточек
const EASE = 60; // полуширина S-перехода у стыка

const stageAt = (a: number) => (a < JOINTS[0] ? 0 : a < JOINTS[1] ? 1 : a < JOINTS[2] ? 2 : 3);

type Piece = { to: Pt; c1?: Pt; c2?: Pt };

/** Кромка ленты (k: 0 - верхняя, 1 - нижняя) от from до to: полки и S-переходы. */
function edge(r: Ribbon, k: 0 | 1): { start: Pt; pieces: Piece[] } {
  const s0 = stageAt(r.from);
  const s1 = stageAt(r.to - 0.01);
  const v = (i: number) => r.stages[i][k];
  const pieces: Piece[] = [];
  for (let i = s0; i < s1; i++) {
    const j = JOINTS[i];
    pieces.push({ to: [j - EASE, v(i)] });
    pieces.push({ c1: [j, v(i)], c2: [j, v(i + 1)], to: [j + EASE, v(i + 1)] });
  }
  pieces.push({ to: [r.to, v(s1)] });
  return { start: [r.from, v(s0)], pieces };
}

function geometry(vertical: boolean) {
  const p = ([a, c]: Pt) => (vertical ? `${c} ${a}` : `${a} ${c}`);
  const run = (e: ReturnType<typeof edge>) =>
    `M${p(e.start)}` +
    e.pieces.map((q) => (q.c1 && q.c2 ? `C${p(q.c1)} ${p(q.c2)} ${p(q.to)}` : `L${p(q.to)}`)).join("");
  return {
    /** Замкнутый контур ленты (заливка / пунктир «было»). */
    shape(r: Ribbon) {
      const top = edge(r, 0);
      const bottom = edge(r, 1);
      const pts = [bottom.start, ...bottom.pieces.map((q) => q.to)];
      let back = "";
      for (let j = bottom.pieces.length - 1; j >= 0; j--) {
        const q = bottom.pieces[j];
        back += q.c1 && q.c2 ? `C${p(q.c2)} ${p(q.c1)} ${p(pts[j])}` : `L${p(pts[j])}`;
      }
      return `${run(top)}L${p(pts[pts.length - 1])}${back}Z`;
    },
    /** Только продольные кромки: торцы открыты, дорожки вливаются в ленту без шва. */
    edges(r: Ribbon) {
      return run(edge(r, 0)) + run(edge(r, 1));
    },
    line(a0: number, c0: number, a1: number, c1: number) {
      return `M${p([a0, c0])}L${p([a1, c1])}`;
    },
  };
}

/** Лента целиком (рисунок растянут на область). */
function BandSvg({ shape, vertical }: { shape: FunnelShape; vertical: boolean }) {
  const g = geometry(vertical);
  const { size, ribbons, gate } = shape;
  return (
    <svg
      viewBox={vertical ? `0 0 ${size} 1000` : `0 0 1000 ${size}`}
      preserveAspectRatio="none"
      className="block h-full w-full overflow-visible"
    >
      {ribbons.map(
        (r, i) =>
          !r.ghost && (
            <path key={`f${i}`} d={g.shape(r)} className="text-surface-2" fill="currentColor" />
          ),
      )}
      {ribbons.map((r, i) =>
        r.ghost ? (
          <path
            key={`e${i}`}
            d={g.shape(r)}
            className="text-muted"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray="3 3"
            vectorEffect="non-scaling-stroke"
          />
        ) : (
          <path
            key={`e${i}`}
            d={g.edges(r)}
            className="text-border"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
        ),
      )}
      {gate !== undefined && (
        <path
          d={g.line(gate, 3, gate, size - 3)}
          className="text-ink"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      )}
    </svg>
  );
}

/** Точка-станция (обёртка - позиция, внутренний span - будущий pop). */
function Dot({ style, className }: { style: React.CSSProperties; className?: string }) {
  return (
    <span
      aria-hidden
      className={`absolute -translate-x-1/2 -translate-y-1/2 ${className ?? ""}`}
      style={style}
    >
      <span className="block h-1.5 w-1.5 rounded-full bg-ink" />
    </span>
  );
}

/**
 * Лента над карточками (sm+): строка подписей, область ленты и станции,
 * выровненные по сетке карточек (grid-cols-4 gap-3, как у FunnelChain).
 */
export function FunnelBand({ shape }: { shape: FunnelShape }) {
  return (
    <div aria-hidden className="mb-4 hidden sm:block">
      {shape.notes && (
        <div className="relative mb-2 h-4">
          {shape.notes.map((n) => (
            <span
              key={n.text}
              className="absolute top-0 -translate-x-1/2 whitespace-nowrap text-xs leading-4 text-muted"
              style={{ left: `${n.at * 25}%` }}
            >
              {n.text}
            </span>
          ))}
        </div>
      )}
      <div className="relative" style={{ height: shape.size }}>
        {/* обёртка ленты - будущее раскрытие слева направо */}
        <div className="absolute inset-0">
          <BandSvg shape={shape} vertical={false} />
        </div>
        <div className="absolute inset-0 grid grid-cols-4 gap-3">
          {shape.stations.map((c, i) => (
            <div key={i} className="relative">
              {c !== null && <Dot style={{ left: "50%", top: c }} />}
              {i === 1 &&
                shape.lanes?.map((l) => (
                  <span
                    key={l.text}
                    className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full bg-bg px-1.5 text-xs leading-4 text-ink-2"
                    style={{ top: l.c }}
                  >
                    {l.text}
                  </span>
                ))}
            </div>
          ))}
        </div>
        {shape.ends?.map((e) => (
          <span
            key={e.text}
            className={`absolute -translate-y-1/2 whitespace-nowrap leading-none ${
              e.strong ? "text-sm font-semibold text-ink" : "text-xs text-muted"
            }`}
            style={{ left: `calc(${ribbonEnd(shape) / 10}% + 0.5rem)`, top: e.c }}
          >
            {e.text}
          </span>
        ))}
      </div>
    </div>
  );
}

const ribbonEnd = (shape: FunnelShape) => Math.max(...shape.ribbons.map((r) => r.to));

/* Отступ стопки карточек под колонку ленты: size + gap-3. */
const COLUMN_PAD: Record<number, string> = { 48: "pl-15", 56: "pl-17" };

export function columnPad(shape: FunnelShape): string {
  return `${COLUMN_PAD[shape.size] ?? "pl-15"} sm:pl-0`;
}

/** Вертикальная лента слева от стопки карточек (телефон). Кладётся в relative-сетку. */
export function FunnelColumn({ shape }: { shape: FunnelShape }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-y-0 left-0 sm:hidden"
      style={{ width: shape.size }}
    >
      <BandSvg shape={shape} vertical />
    </div>
  );
}

/**
 * Станция карточки i на телефоне: точка на колонке ленты напротив центра карточки.
 * Сдвиг от левого края карточки: позиция поперёк колонки минус (колонка + gap-3 + рамка).
 */
export function ColumnStation({ shape, i }: { shape: FunnelShape; i: number }) {
  const c = shape.stations[i];
  const at = c !== null ? [c] : i === 1 && shape.lanes ? shape.lanes.map((l) => l.c) : [];
  return at.map((x) => (
    <Dot key={x} className="top-1/2 sm:hidden" style={{ left: x - shape.size - 13 }} />
  ));
}
