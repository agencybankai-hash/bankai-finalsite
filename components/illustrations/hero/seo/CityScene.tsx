import { cn } from "@/lib/utils";
import { Bar, Chip, LeadDot, SearchBar } from "../../parts";
import type { SceneProps } from "../../types";
import { anim } from "../../vars";

/* Городская выдача: слева локальный блок карт (плитка с улицами, три метки,
   карточка компании со звонком), справа органика - сайт поднимается с шестой
   строки на вторую. Номеров позиций нет: позиций не обещаем. Телефон - только
   блок карт. Базовый стиль - финальный кадр. */

/** Таймлайн, с: строки и плитка → метки падают по очереди → карточка выезжает →
 *  сайт поднимается → звонок. */
const T = {
  rows: 0.6,
  rowStep: 0.04,
  tile: 0.6,
  pins: 0.85,
  pinStep: 0.08,
  card: 1.2,
  rise: 1.3,
  riseDur: 1,
  call: 2.45,
};

/** Органика: ширины скелетона (адрес, заголовок, описание) в % колонки. Строку 2
 *  в финале накрывает слот сайта, строку 6 - он же на старте. */
const ORGANIC = [
  { url: "30%", title: "64%", text: "84%" },
  { url: "26%", title: "52%", text: "74%" },
  { url: "34%", title: "70%", text: "80%" },
  { url: "24%", title: "56%", text: "70%" },
  { url: "30%", title: "66%", text: "78%" },
  { url: "28%", title: "50%", text: "72%" },
];

/** Метки на плитке, % от плитки: две чужие (контур), ваша (залита) падает последней
 *  и ложится поверх. */
const PINS = [
  { x: "22%", y: "30%", own: false },
  { x: "78%", y: "24%", own: false },
  { x: "52%", y: "46%", own: true },
];

/** Улицы: сетка на 320×200, плитка кадрирует середину (slice). */
function Streets() {
  return (
    <svg
      viewBox="0 0 320 200"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
      className="absolute inset-0 h-full w-full"
      fill="none"
      stroke="currentColor"
    >
      {/* Сквер: статичный узел, transform-атрибут не анимируется */}
      <rect
        x="232"
        y="116"
        width="30"
        height="30"
        rx="5"
        transform="rotate(-4 247 131)"
        className="fill-ink/5"
        stroke="none"
      />
      <g strokeWidth="1.2" className="text-ink/10">
        <path d="M-10 42 330 34M-10 78 330 72M-10 164 330 150" />
        <path d="M58-10 66 210M104-10 110 210M226-10 216 210M270-10 262 210" />
      </g>
      <g strokeWidth="3.2" className="text-ink/15">
        <path d="M-10 122 330 102" />
        <path d="M152-10 172 210" />
        <path d="M-10 196 C70 150 120 128 186 64 S286-6 330-10" />
      </g>
    </svg>
  );
}

/** Метка карты: острие - в точке (x, y). own - залита ink, чужая - контур. */
function Pin({ own, className }: { own: boolean; className?: string }) {
  return (
    <svg viewBox="0 0 24 30" aria-hidden className={cn("block h-full w-full", className)}>
      <path
        d="M12 28.5s-9-8.3-9-15.8a9 9 0 0 1 18 0c0 7.5-9 15.8-9 15.8z"
        className={own ? "fill-ink" : "fill-surface stroke-ink-2"}
        strokeWidth={own ? 0 : 1.6}
      />
      <circle cx="12" cy="12.7" r="3.2" className={own ? "fill-surface" : "fill-ink-2"} />
    </svg>
  );
}

/** Трубка на кнопке звонка. */
function PhoneGlyph() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className="h-[1em] w-[1em]"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 4h3.5l1.8 4.4-2.3 1.4a11 11 0 0 0 6.2 6.2l1.4-2.3L20 15.5V19a1 1 0 0 1-1 1A16 16 0 0 1 4 5a1 1 0 0 1 1-1z" />
    </svg>
  );
}

/** Локальный блок: плитка карты, метки, карточка компании поверх нижнего края. */
function MapBlock() {
  return (
    <div className="city-map relative h-full shrink-0">
      <div
        className="city-tile a-fade absolute overflow-hidden rounded-[0.9em] border border-border bg-surface"
        style={anim({ delay: T.tile })}
      >
        <Streets />
        <span className="ill-t-sm ill-detail absolute left-[0.8em] top-[0.7em] leading-none text-muted">
          карты
        </span>
      </div>

      {/* Метки падают сверху: позиция - у обёртки, движение - у внутреннего слоя */}
      <div className="city-tile absolute">
        {PINS.map((p, i) => (
          <span
            key={p.x}
            className={cn(
              "absolute block -translate-x-1/2 -translate-y-full",
              p.own
                ? "h-[max(20px,2.8em)] w-[max(16px,2.24em)]"
                : "h-[max(15px,2.2em)] w-[max(12px,1.76em)]",
            )}
            style={{ left: p.x, top: p.y }}
          >
            <span
              className="a-rise block h-full w-full"
              style={anim(
                { delay: T.pins, i, step: T.pinStep, dur: 0.5 },
                { "--a-y": "-1.6em", "--a-ease": "var(--ease-out)" },
              )}
            >
              <Pin own={p.own} />
            </span>
          </span>
        ))}
      </div>

      <div
        className="city-card a-rise absolute rounded-[0.9em] border border-border bg-surface-2 px-[1em] py-[0.9em]"
        style={anim({ delay: T.card }, { "--a-y": "1.4em" })}
      >
        <div className="flex items-center gap-[0.7em]">
          <span className="h-[max(15px,2.2em)] w-[max(12px,1.76em)] shrink-0">
            <Pin own />
          </span>
          <span className="min-w-0">
            <span className="ill-t-md block truncate font-semibold leading-tight text-ink">
              Ваша компания
            </span>
            <span className="ill-t-sm mt-[0.2em] block truncate leading-tight text-muted">
              2GIS · Google Карты
            </span>
          </span>
        </div>
        <div className="mt-[0.8em] flex items-center gap-[0.6em]">
          <Chip tone="solid" className="font-medium">
            <PhoneGlyph />
            Позвонить
          </Chip>
          <LeadDot delay={T.call} />
          <span
            className="a-fade ill-t-sm leading-none text-muted"
            style={anim({ delay: T.call + 0.05 })}
          >
            звонок
          </span>
        </div>
      </div>
    </div>
  );
}

/** Сниппет: фавикон у строки адреса, под ним заголовок и описание. */
function Snippet({
  url,
  title,
  text,
  own = false,
}: {
  url: string;
  title: string;
  text: string;
  own?: boolean;
}) {
  return (
    <span className="flex min-w-0 flex-1 items-start gap-[0.8em]">
      <span
        className={cn("h-[1.1em] w-[1.1em] shrink-0 rounded-full", own ? "bg-ink/60" : "bg-ink/15")}
      />
      <span className="flex min-w-0 flex-1 flex-col gap-[0.35em] pt-[0.3em]">
        <Bar w={url} tone="faint" className="h-[0.45em]" />
        <Bar w={title} tone={own ? "strong" : "soft"} className="h-[0.6em]" />
        <Bar w={text} tone="faint" className="h-[0.45em]" />
      </span>
    </span>
  );
}

/** Слот сайта: строка 2 в финале; на старте - на строке 6, подъём одним translateY
 *  (путь - в seo.css). Внутренняя обёртка - проявление на старте. */
function SiteSlot() {
  return (
    <div className="city-slot a-slide absolute" style={anim({ delay: T.rise, dur: T.riseDur })}>
      <div
        className="a-fade flex h-full items-center gap-[0.8em] rounded-[0.7em] border border-ink/30 bg-surface px-[0.8em]"
        style={anim({ delay: T.rise - 0.2, dur: 0.4 })}
      >
        <Snippet url="34%" title="76%" text="90%" own />
        <span className="ill-t-sm shrink-0 whitespace-nowrap rounded-full border border-ink/40 bg-bg px-[0.7em] py-[0.3em] leading-none text-ink">
          ваш сайт
        </span>
      </div>
    </div>
  );
}

/** Сцена SEO по городу: карты и органика по запросу с городом. */
export function SeoCityScene({ v }: SceneProps) {
  return (
    <div className="seo-city absolute inset-0 flex flex-col">
      <SearchBar query={v.copy.query ?? ""} className="ill-detail" />

      <div className="city-body relative flex min-h-0 flex-1 gap-[1.6em]">
        <MapBlock />

        <div className="ill-detail flex min-w-0 flex-1 flex-col">
          <span className="ill-t-sm leading-none text-muted">органика</span>
          <div className="relative mt-[0.9em]">
            {ORGANIC.map((r, i) => (
              <div
                key={i}
                className="city-row a-fade flex items-center"
                style={anim({ delay: T.rows, i, step: T.rowStep, dur: 0.5 })}
              >
                <Snippet {...r} />
              </div>
            ))}
            <SiteSlot />
          </div>
        </div>
      </div>
    </div>
  );
}
