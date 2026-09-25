import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Chip, LeadDot } from "../../parts";
import type { SceneProps } from "../../types";
import { anim } from "../../vars";
import { ContextScene } from "./ContextScene";

/* Зона показов: схема города в единицах viewBox 480×300 (10 ед. = 1em).
   Районы, которые Google Ads выбирает списком, залиты, остальные закрыты
   радиусом вокруг точки - число и расклад как на странице города, границы
   условные, названий нет. Базовый стиль - финальный кадр. Движение: сетка
   улиц → хребет или река → районы заливаются → круги радиуса → пригороды
   или берега → объявление → звонок. Телефон: только карта. */

const T = {
  grid: 0.6,
  relief: 0.75,
  cells: 1,
  radius: 1.5,
  legend: 1.7,
  towns: 1.9,
  ad: 2.15,
  lead: 2.45,
};

type Rect = readonly [x: number, y: number, w: number, h: number];

/** Район: прямоугольник под маской контура; radius - вне справочника; bank - берег. */
type Cell = { r: Rect; radius?: boolean; bank?: "n" | "s" };

type City = {
  /** Префикс id масок: один город - один набор на документ. */
  id: string;
  /** Контур города: граница и маска районов и сетки. */
  outline: string;
  /** Рамка сетки улиц. */
  box: Rect;
  cells: Cell[];
  /** Точки радиуса; lead - точка звонка. */
  points: { x: number; y: number; r: number; lead?: boolean }[];
};

/** Ортогональная сетка улиц одним путём: шаг 13 ед. */
function streets([x, y, w, h]: Rect, step = 13): string {
  let d = "";
  for (let i = x; i <= x + w; i += step) d += `M${i} ${y}V${y + h}`;
  for (let j = y; j <= y + h; j += step) d += `M${x} ${j}H${x + w}`;
  return d;
}

/** Алматы: север - три района, середина - два и восток во всю высоту, юг у гор - два вне списка. */
const ALMATY: City = {
  id: "geo-alm",
  outline:
    "M124 40C135 36.5 158.7 35.3 176 35C193.3 34.7 211.3 38.2 228 38C244.7 37.8 259 35.3 276 34C293 32.7 316.3 29.7 330 30C343.7 30.3 352 29 358 36C364 43 365.2 56.3 366 72C366.8 87.7 362.7 110.7 363 130C363.3 149.3 368.5 172.7 368 188C367.5 203.3 368.3 215.7 360 222C351.7 228.3 336 225.7 318 226C300 226.3 273.3 223.8 252 224C230.7 224.2 210 227 190 227C170 227 145 226.8 132 224C119 221.2 115 220.7 112 210C109 199.3 114.7 177.7 114 160C113.3 142.3 108.7 121.3 108 104C107.3 86.7 107.3 66.7 110 56C112.7 45.3 113 43.5 124 40Z",
  box: [100, 22, 276, 214],
  cells: [
    { r: [100, 20, 96, 80] },
    { r: [200, 20, 72, 80] },
    { r: [276, 20, 104, 80] },
    { r: [100, 104, 96, 56] },
    { r: [200, 104, 72, 56] },
    { r: [276, 104, 104, 136] },
    { r: [100, 164, 68, 76], radius: true },
    { r: [172, 164, 100, 76], radius: true },
  ],
  points: [
    { x: 141, y: 194, r: 29 },
    { x: 222, y: 194, r: 29, lead: true },
  ],
};

/** Хребет по южному краю: линия переднего плана, её заливка цветом фона
 *  закрывает дальний план. */
const RIDGE = {
  front:
    "M40 292L66 280L82 284L106 264L120 272L146 250L160 260L176 254L202 236L220 254L236 248L258 262L278 248L300 234L318 252L334 246L356 264L380 258L406 276L434 290",
  back: "M112 270L136 250L152 256L182 238L198 246L216 236L240 250L262 242L286 234L304 244L330 240L352 254L372 250L398 266",
};
const RIDGE_FILL = `${RIDGE.front}L434 300L40 300Z`;

/** Пригороды: дороги от границы города. */
const ROADS = "M72 196H112M366 190H396M244 38V22";

/** Астана: правый берег - три района, левый - один и два вне списка. */
const ASTANA: City = {
  id: "geo-ast",
  outline:
    "M122 42C134 38 160.3 36.3 180 36C199.7 35.7 220 40.3 240 40C260 39.7 281.3 34.3 300 34C318.7 33.7 340 33 352 38C364 43 369 48.7 372 64C375 79.3 369.7 108 370 130C370.3 152 374.7 178 374 196C373.3 214 373.3 229.3 366 238C358.7 246.7 347.7 247 330 248C312.3 249 282.3 243.7 260 244C237.7 244.3 216 250 196 250C176 250 154 247.3 140 244C126 240.7 117 242.3 112 230C107 217.7 111 190 110 170C109 150 106.3 128.3 106 110C105.7 91.7 105.3 71.3 108 60C110.7 48.7 110 46 122 42Z",
  box: [100, 26, 282, 230],
  cells: [
    { r: [96, 22, 98, 140], bank: "n" },
    { r: [198, 22, 90, 140], bank: "n" },
    { r: [292, 22, 90, 140], bank: "n" },
    { r: [96, 124, 98, 136], bank: "s", radius: true },
    { r: [198, 124, 90, 136], bank: "s" },
    { r: [292, 124, 90, 136], bank: "s", radius: true },
  ],
  points: [
    { x: 148, y: 202, r: 30 },
    { x: 334, y: 202, r: 30, lead: true },
  ],
};

/** Есиль с запада на восток; берега - маски районов по обе стороны русла. */
const RIVER = {
  d: "M-10 146C-1.7 145 23.3 139.3 40 140C56.7 140.7 73.3 151.3 90 150C106.7 148.7 123.3 134 140 132C156.7 130 173.3 135 190 138C206.7 141 223.3 150.3 240 150C256.7 149.7 273.3 137.3 290 136C306.7 134.7 323.3 142.3 340 142C356.7 141.7 373.3 134.3 390 134C406.7 133.7 423.3 140.3 440 140C456.7 139.7 481.7 133.3 490 132",
  n: "M-10 138C-1.7 137 23.3 131.3 40 132C56.7 132.7 73.3 143.3 90 142C106.7 140.7 123.3 126 140 124C156.7 122 173.3 127 190 130C206.7 133 223.3 142.3 240 142C256.7 141.7 273.3 129.3 290 128C306.7 126.7 323.3 134.3 340 134C356.7 133.7 373.3 126.3 390 126C406.7 125.7 423.3 132.3 440 132C456.7 131.7 481.7 125.3 490 124L490 -10L-10 -10Z",
  s: "M-10 154C-1.7 153 23.3 147.3 40 148C56.7 148.7 73.3 159.3 90 158C106.7 156.7 123.3 142 140 140C156.7 138 173.3 143 190 146C206.7 149 223.3 158.3 240 158C256.7 157.7 273.3 145.3 290 144C306.7 142.7 323.3 150.3 340 150C356.7 149.7 373.3 142.3 390 142C406.7 141.7 423.3 148.3 440 148C456.7 147.7 481.7 141.3 490 140L490 310L-10 310Z",
};

const CITIES: Record<string, City> = { Алматы: ALMATY, Астана: ASTANA };

/** Позиция узла в единицах viewBox. em - от сцены: у узла с at() не должно быть
 *  кегля ill-t-*, текст - во вложенном элементе. */
const at = (x: number, y: number) => ({ left: `${x / 10}em`, top: `${y / 10}em` });

/** Районы: границы всех - каркас с первого кадра, районы списком заливаются по
 *  очереди (сквозной порядок по городу); bank - только районы этого берега. */
function Cells({ cells, bank }: { cells: Cell[]; bank?: Cell["bank"] }) {
  let order = 0;
  return cells.map((c, i) => {
    const [x, y, w, h] = c.r;
    const n = c.radius ? -1 : order++;
    if (bank && c.bank !== bank) return null;
    return (
      <g key={i}>
        <rect x={x} y={y} width={w} height={h} rx={6} className="stroke-ink/15" strokeWidth={1} />
        {n >= 0 && (
          <rect
            x={x}
            y={y}
            width={w}
            height={h}
            rx={6}
            className="a-fade fill-ink/12"
            style={anim({ delay: T.cells, i: n, step: 0.08, dur: 0.5 })}
          />
        )}
      </g>
    );
  });
}

/** Подпись на карте: точка-кольцо и название сбоку. */
function Town({
  x,
  y,
  side,
  children,
}: {
  x: number;
  y: number;
  side: "left" | "right";
  children: ReactNode;
}) {
  return (
    <span className="absolute" style={at(x, y)}>
      <span className="absolute h-[0.9em] w-[0.9em] -translate-x-1/2 -translate-y-1/2 rounded-full border-[0.2em] border-ink-2 bg-bg" />
      <span
        className={cn(
          "ill-t-sm absolute top-0 -translate-y-1/2 whitespace-nowrap leading-none text-ink-2",
          side === "left" ? "right-[0.8em]" : "left-[0.8em]",
        )}
      >
        {children}
      </span>
    </span>
  );
}

/** Подпись без точки: центр по x, верх по y. */
function Caption({
  x,
  y,
  className,
  children,
}: {
  x: number;
  y: number;
  className?: string;
  children: ReactNode;
}) {
  return (
    <span className="absolute" style={at(x, y)}>
      <span
        className={cn(
          "ill-t-sm absolute left-0 top-0 -translate-x-1/2 whitespace-nowrap leading-none text-muted",
          className,
        )}
      >
        {children}
      </span>
    </span>
  );
}

function Legend() {
  return (
    <div
      className="a-fade ill-detail absolute right-0 top-0 flex flex-col items-start gap-[0.55em]"
      style={anim({ delay: T.legend })}
    >
      <span className="ill-t-sm flex items-center gap-[0.5em] leading-none text-muted">
        <span className="h-[0.85em] w-[0.85em] rounded-[0.2em] bg-ink/12" />
        районы списком
      </span>
      <span className="ill-t-sm flex items-center gap-[0.5em] leading-none text-muted">
        <span className="h-[0.85em] w-[0.85em] rounded-full border border-dashed border-ink-2" />
        радиус
      </span>
    </div>
  );
}

/** Объявление над картой: его видят только в зоне показов. */
function AdOverlay({ query, lang }: { query: string; lang: boolean }) {
  return (
    <div
      className="a-rise ill-detail absolute left-0 top-0 max-w-[21em] rounded-[0.9em] border border-ink/15 bg-surface-2 px-[0.9em] py-[0.7em]"
      style={anim({ delay: T.ad }, { "--a-y": "-0.8em" })}
    >
      <div className="flex items-center gap-[0.4em]">
        <Chip tone="outline" className="border-ink/40 font-semibold text-ink">
          Реклама
        </Chip>
        {lang && <Chip tone="outline">RU · KZ</Chip>}
      </div>
      <p className="ill-t-sm mt-[0.55em] truncate leading-tight text-ink-2">{query}</p>
    </div>
  );
}

/** Зона показов городской страницы контекста. Города без схемы - базовая сцена. */
export function GeoScene({ v }: SceneProps) {
  const city = v.city ? CITIES[v.city] : undefined;
  if (!city) return <ContextScene v={v} />;

  const astana = city === ASTANA;
  const lead = city.points.find((p) => p.lead)!;
  const clip = (s: string) => `url(#${city.id}-${s})`;

  return (
    <>
      <svg
        viewBox="0 0 480 300"
        aria-hidden
        className="absolute inset-0 h-full w-full"
        fill="none"
      >
        <defs>
          <clipPath id={`${city.id}-city`}>
            <path d={city.outline} />
          </clipPath>
          {astana && (
            <>
              <clipPath id={`${city.id}-n`}>
                <path d={RIVER.n} />
              </clipPath>
              <clipPath id={`${city.id}-s`}>
                <path d={RIVER.s} />
              </clipPath>
            </>
          )}
        </defs>

        <g clipPath={clip("city")}>
          {astana ? (
            <>
              <g clipPath={clip("n")}>
                <Cells cells={city.cells} bank="n" />
              </g>
              <g clipPath={clip("s")}>
                <Cells cells={city.cells} bank="s" />
              </g>
            </>
          ) : (
            <Cells cells={city.cells} />
          )}
          <path
            d={streets(city.box)}
            className="a-fade stroke-ink/8"
            strokeWidth={1}
            style={anim({ delay: T.grid, dur: 0.6 })}
          />
        </g>

        {astana ? (
          <path
            d={RIVER.d}
            pathLength={1}
            className="a-draw stroke-surface-2"
            strokeWidth={13}
            strokeLinecap="butt"
            style={anim({ delay: T.relief, dur: 0.9 })}
          />
        ) : (
          <>
            <path
              d={RIDGE.back}
              pathLength={1}
              className="a-draw stroke-ink/20"
              strokeWidth={1.4}
              strokeLinejoin="round"
              style={anim({ delay: T.relief + 0.15, dur: 0.9 })}
            />
            <path d={RIDGE_FILL} className="fill-bg" />
            <path
              d={RIDGE.front}
              pathLength={1}
              className="a-draw stroke-ink/40"
              strokeWidth={1.6}
              strokeLinejoin="round"
              strokeLinecap="round"
              style={anim({ delay: T.relief, dur: 0.9 })}
            />
            <path
              d={ROADS}
              className="a-fade ill-detail stroke-ink/30"
              strokeWidth={1.2}
              strokeDasharray="2 3"
              style={anim({ delay: T.towns })}
            />
          </>
        )}

        <path d={city.outline} className="stroke-ink/35" strokeWidth={1.5} />

        {city.points.map((p, i) => (
          <g key={i} className="a-pop" style={anim({ delay: T.radius, i, step: 0.12, dur: 0.6 })}>
            <circle
              cx={p.x}
              cy={p.y}
              r={p.r}
              className="fill-ink/5 stroke-ink-2"
              strokeWidth={1.3}
              strokeDasharray="3 3.5"
            />
            <circle cx={p.x} cy={p.y} r={3.2} className="fill-ink" />
          </g>
        ))}
      </svg>

      {astana ? (
        <div className="a-fade ill-detail absolute inset-0" style={anim({ delay: T.towns })}>
          <Caption x={240} y={10}>
            правый берег
          </Caption>
          <Caption x={240} y={264}>
            левый берег
          </Caption>
          <Caption x={420} y={112} className="text-ink-2">
            Есиль
          </Caption>
        </div>
      ) : (
        <div className="a-fade ill-detail absolute inset-0" style={anim({ delay: T.towns })}>
          <Town x={72} y={196} side="left">
            Каскелен
          </Town>
          <Town x={396} y={190} side="right">
            Талгар
          </Town>
          <Caption x={244} y={8} className="text-ink-2">
            Конаев ↑
          </Caption>
          <span className="absolute right-0 top-[20.6em]">
            <Chip tone="dashed">своя кампания</Chip>
          </span>
        </div>
      )}

      <AdOverlay query={v.copy.query ?? ""} lang={astana} />
      <Legend />

      <span className="absolute" style={at(lead.x, lead.y)}>
        <LeadDot
          delay={T.lead}
          className="absolute h-[max(8px,1.1em)] w-[max(8px,1.1em)] -translate-x-1/2 -translate-y-1/2"
        />
        <span
          className="a-fade ill-t-sm absolute left-[0.9em] top-0 -translate-y-1/2 whitespace-nowrap leading-none text-ink"
          style={anim({ delay: T.lead + 0.05 })}
        >
          звонок
        </span>
      </span>
    </>
  );
}
