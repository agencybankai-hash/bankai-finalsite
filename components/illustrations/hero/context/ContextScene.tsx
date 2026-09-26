import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { SceneProps } from "../../types";
import { Bar, Chip, Cursor, LeadDot, SearchBar } from "../../parts";
import { anim } from "../../vars";

/* Сцена контекста: широкое объявление над выдачей + мини-таблица кампаний.
   Базовый стиль - финальный кадр. Движение: запрос набирается, объявление
   падает сверху, курсор кликает по заголовку - «₸ за клик», таблица
   заполняется строками и барами, цена строки 2 из «выше цели» уходит
   «в цели» (две пилюли стопкой), последней - точка заявки. */

/** Каскад строк таблицы: строка i стартует на i·0.07 с позже. */
const ROW_STEP = 0.07;

type Row = { name: string; clicks: string; leads: string };

const BARS = [
  { clicks: "84%", leads: "52%" },
  { clicks: "58%", leads: "34%" },
  { clicks: "30%", leads: "20%" },
];

/** Хаб - кампании по типу, город без своей схемы (GeoScene) - по городу. */
function campaigns({ city }: SceneProps["v"]): Row[] {
  const names = city
    ? [`Ремонт · ${city}`, `Дизайн · ${city}`, "Бренд"]
    : ["Ремонт · поиск", "Дизайн · поиск", "Бренд"];
  return names.map((name, i) => ({ name, ...BARS[i] }));
}

/** Колонки таблицы: одни ширины у шапки и строк (em - от кегля строки). */
const COL = {
  name: "w-[8.6em] shrink-0 truncate",
  bar: "min-w-0 flex-1",
  price: "w-[7em] shrink-0",
};

/** Статус цены в строке таблицы. Не Chip: его ill-t-sm внутри строки с ill-t-sm
 *  дал бы кегль ×1.15 (em от родителя). */
function Pill({
  children,
  className,
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <span
      className={cn(
        "col-start-1 row-start-1 inline-flex items-center justify-center whitespace-nowrap rounded-full bg-surface-2 px-[0.7em] py-[0.15em] leading-none text-ink-2",
        className,
      )}
      style={style}
    >
      {children}
    </span>
  );
}

function AdCard() {
  return (
    <div
      className="a-rise relative z-10 rounded-[1.1em] border border-ink/15 bg-surface-2 px-[1.3em] py-[0.95em]"
      style={anim({ delay: 1.25 }, { "--a-y": "-1.2em" })}
    >
      <div className="flex items-center gap-[0.6em]">
        <Chip tone="outline" className="border-ink/40 font-semibold text-ink">
          Реклама
        </Chip>
        <span className="ill-t-sm min-w-0 truncate text-ink-2">ваш-сайт.kz › цены</span>
        <Chip className="a-pop ml-auto bg-ink/10 text-ink" style={anim({ delay: 2.05 })}>
          ₸ за клик
        </Chip>
      </div>

      <div className="relative mt-[0.5em] w-fit max-w-full">
        <p className="ill-t-lg truncate font-semibold tracking-tight text-ink">
          Ремонт квартир под ключ - цена за м²
        </p>
        <span
          className="a-slide absolute -right-[1.4em] top-[calc(100%-0.7em)] block h-[max(14px,2em)] w-[max(14px,2em)]"
          style={anim({ delay: 1.55, dur: 0.45 }, { "--a-x": "5em", "--a-y": "3em" })}
        >
          <Cursor clickDelay={2} className="inset-0 h-full w-full" />
        </span>
      </div>

      <Bar w="70%" tone="faint" className="ill-detail mt-[0.8em]" />

      <div className="mt-[0.8em] flex gap-[0.5em]">
        {["Цены", "Работы", "Контакты"].map((s) => (
          <Chip key={s} tone="outline" className="border-ink/20 py-[0.25em]">
            {s}
          </Chip>
        ))}
      </div>
    </div>
  );
}

/** Органика - тусклая карточка, выглядывает из-под объявления. Вне потока:
 *  на узкой сцене её прикрывает таблица, а не выдавливает за край. */
function OrganicRow() {
  return (
    <div
      aria-hidden
      className="a-fade ill-detail absolute inset-x-[1em] top-[calc(100%-1.2em)] flex items-center gap-[0.8em] rounded-b-[1em] border border-t-0 border-border bg-surface px-[1.2em] pb-[0.65em] pt-[1.85em]"
      style={anim({ delay: 1.45 })}
    >
      <span className="h-[1.2em] w-[1.2em] shrink-0 rounded-full bg-ink/10" />
      <Bar w="58%" tone="faint" className="h-[0.7em]" />
    </div>
  );
}

function Ledger({ rows }: { rows: Row[] }) {
  return (
    <div
      className="a-fade relative mt-auto rounded-[1.1em] border border-border bg-surface px-[1.3em] py-[0.55em]"
      style={anim({ delay: 1.5 })}
    >
      <div className="ill-t-sm flex items-center gap-[1em] pb-[0.3em] text-muted">
        <span className={COL.name}>Кампания</span>
        <span className={cn(COL.bar, "ill-detail")}>Клики</span>
        <span className={COL.bar}>Заявки</span>
        <span className={COL.price}>Цена заявки</span>
      </div>

      {rows.map((r, i) => (
        <div
          key={r.name}
          className={cn(
            "a-rise ill-t-sm flex items-center gap-[1em] border-t border-border py-[0.25em]",
            i === 2 && "ill-detail",
          )}
          style={anim({ delay: 1.6, i, step: ROW_STEP }, { "--a-y": "0.4em" })}
        >
          <span className={cn(COL.name, "text-ink-2")}>{r.name}</span>
          <span className={cn(COL.bar, "ill-detail")}>
            <Bar w={r.clicks} className="a-grow-x" style={anim({ delay: 1.7, i, step: ROW_STEP })} />
          </span>
          <span className={cn(COL.bar, "flex items-center gap-[0.4em]")}>
            <Bar w={r.leads} className="a-grow-x" style={anim({ delay: 1.85, i, step: ROW_STEP })} />
            {i === 0 && <LeadDot delay={2.5} />}
          </span>
          {/* Смена статуса цены: --i строки наследуется, пилюлям - свой 0 */}
          <span className={cn(COL.price, "grid")}>
            {i === 1 && (
              <Pill className="a-fade-out" style={anim({ delay: 2.2, dur: 0.3, i: 0 })}>
                выше цели
              </Pill>
            )}
            <Pill
              className={i === 1 ? "a-fade" : undefined}
              style={i === 1 ? anim({ delay: 2.25, dur: 0.3, i: 0 }) : undefined}
            >
              в цели
            </Pill>
          </span>
        </div>
      ))}
    </div>
  );
}

/** Сцена контекста: объявление над выдачей, клик и заявка с понятной ценой. */
export function ContextScene({ v }: SceneProps) {
  return (
    <div className="absolute inset-0 flex flex-col">
      <SearchBar query={v.copy.query ?? "ремонт квартир цена"} typing delay={0.7} step={0.025} />
      <div className="relative mb-[0.9em] mt-[1.1em]">
        <AdCard />
        <OrganicRow />
      </div>
      <Ledger rows={campaigns(v)} />
    </div>
  );
}
