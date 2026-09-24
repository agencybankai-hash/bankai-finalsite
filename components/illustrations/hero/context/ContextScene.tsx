import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { SceneProps } from "../../types";
import { Bar, Chip, Cursor, LeadDot, SearchBar } from "../../parts";

/* Сцена контекста: широкое объявление над выдачей + мини-таблица кампаний.
   Финальный кадр (Hi-Fi). Всё, что потом поедет, уже в своей обёртке:
   карточка объявления, курсор, «₸ за клик», строки и бары таблицы,
   пилюля строки 2 (две стопкой: «выше цели» скрыта, «в цели» видна). */

type Row = { name: string; clicks: string; leads: string };

const BARS = [
  { clicks: "84%", leads: "52%" },
  { clicks: "58%", leads: "34%" },
  { clicks: "30%", leads: "20%" },
];

function campaigns({ kind, city }: SceneProps["v"]): Row[] {
  const names =
    kind === "yandex-direct"
      ? ["Поиск · ремонт", "Сети · ремонт", "Бренд"]
      : kind === "context-city" && city
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
function Pill({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "col-start-1 row-start-1 inline-flex items-center justify-center whitespace-nowrap rounded-full bg-surface-2 px-[0.7em] py-[0.15em] leading-none text-ink-2",
        className,
      )}
    >
      {children}
    </span>
  );
}

function AdCard() {
  return (
    <div className="relative z-10 rounded-[1.1em] border border-ink/15 bg-surface-2 px-[1.3em] py-[0.95em]">
      <div className="flex items-center gap-[0.6em]">
        <Chip tone="outline" className="border-ink/40 font-semibold text-ink">
          Реклама
        </Chip>
        <span className="ill-t-sm min-w-0 truncate text-ink-2">ваш-сайт.kz › цены</span>
        <Chip className="ml-auto bg-ink/10 text-ink">₸ за клик</Chip>
      </div>

      <div className="relative mt-[0.5em] w-fit max-w-full">
        <p className="ill-t-lg truncate font-semibold tracking-tight text-ink">
          Ремонт квартир под ключ - цена за м²
        </p>
        <span className="absolute -right-[1.4em] top-[calc(100%-0.7em)] block h-[max(14px,2em)] w-[max(14px,2em)]">
          <Cursor className="inset-0 h-full w-full" />
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
      className="ill-detail absolute inset-x-[1em] top-[calc(100%-1.2em)] flex items-center gap-[0.8em] rounded-b-[1em] border border-t-0 border-border bg-surface px-[1.2em] pb-[0.65em] pt-[1.85em]"
    >
      <span className="h-[1.2em] w-[1.2em] shrink-0 rounded-full bg-ink/10" />
      <Bar w="58%" tone="faint" className="h-[0.7em]" />
    </div>
  );
}

function Ledger({ rows, conversions }: { rows: Row[]; conversions: boolean }) {
  return (
    <div className="relative mt-auto rounded-[1.1em] border border-border bg-surface px-[1.3em] py-[0.55em]">
      {conversions && (
        <>
          <span className="ill-detail absolute right-[1.3em] top-0 flex -translate-y-1/2">
            <Chip tone="outline" className="bg-surface">
              Конверсии ✓
            </Chip>
          </span>
          {/* запас под бейдж, чтобы он не лёг на шапку */}
          <span aria-hidden className="ill-detail block h-[0.65em]" />
        </>
      )}

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
            "ill-t-sm flex items-center gap-[1em] border-t border-border py-[0.25em]",
            i === 2 && "ill-detail",
          )}
        >
          <span className={cn(COL.name, "text-ink-2")}>{r.name}</span>
          <span className={cn(COL.bar, "ill-detail")}>
            <Bar w={r.clicks} />
          </span>
          <span className={cn(COL.bar, "flex items-center gap-[0.4em]")}>
            <Bar w={r.leads} />
            {i === 0 && <LeadDot delay={2.5} />}
          </span>
          <span className={cn(COL.price, "grid")}>
            {i === 1 && <Pill className="opacity-0">выше цели</Pill>}
            <Pill>в цели</Pill>
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
      <SearchBar query={v.copy.query ?? "ремонт квартир цена"} />
      <div className="relative mb-[0.9em] mt-[1.1em]">
        <AdCard />
        <OrganicRow />
      </div>
      <Ledger rows={campaigns(v)} conversions={v.kind === "google-ads"} />
    </div>
  );
}
