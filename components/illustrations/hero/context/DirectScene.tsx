import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Chip, LeadDot } from "../../parts";
import { anim } from "../../vars";

/* Яндекс Директ: поиск и сеть врозь. Сверху фразы с операторами, ниже две
   дорожки-полосы: поиск - кампания → своя цена обращения → обращение; сеть -
   кампания → площадки (две в минус) → своя цена; внизу цели Метрики. Хвосты
   дорожек одной ширины (.ydx-end) - цены стоят в одной колонке.
   Базовый стиль - финальный кадр. Движение: фразы → дорожки → площадки →
   две зачёркиваются → цели Метрики ✓ → обращение. */

const T = {
  phrases: 0.6,
  lanes: [0.9, 1.05],
  price: 1.35,
  sites: 1.3,
  strike: 1.8,
  goals: 2.2,
  lead: 2.45,
};

const PHRASES = ['"ремонт квартир"', "!под ключ", "[ремонт квартиры]"];

/** Полоса дорожки: голова канала слева, справа путь. Линия пути - во всю ширину
 *  правой части, под узлами: узлы и хвосты с фоном полосы закрывают лишнее. */
function Lane({
  icon,
  title,
  delay,
  children,
}: {
  icon: ReactNode;
  title: string;
  delay: number;
  children: ReactNode;
}) {
  return (
    <div className="flex h-[8em] items-center rounded-[1.1em] border border-border bg-surface pl-[0.9em] pr-[1em]">
      <span className="flex w-[10.4em] shrink-0 items-center gap-[0.7em]">
        <span className="grid h-[2.8em] w-[2.8em] shrink-0 place-items-center rounded-[0.7em] bg-surface-2 text-ink-2">
          {icon}
        </span>
        <span className="min-w-0">
          <span className="ill-t-md block truncate font-medium leading-none text-ink">{title}</span>
          <span className="ill-t-sm ill-detail mt-[0.35em] block truncate leading-none text-muted">
            кампания
          </span>
        </span>
      </span>
      <div className="relative flex min-w-0 flex-1 items-center self-stretch">
        <span
          aria-hidden
          className="a-grow-x absolute inset-x-0 top-1/2 block h-px bg-ink/30"
          style={anim({ delay, dur: 0.7 })}
        />
        {children}
      </div>
    </div>
  );
}

const lens = (
  <svg
    viewBox="0 0 24 24"
    aria-hidden
    className="h-[1.4em] w-[1.4em]"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
  >
    <circle cx="11" cy="11" r="6.5" />
    <path d="m20 20-4.2-4.2" />
  </svg>
);

const grid = (
  <svg viewBox="0 0 24 24" aria-hidden className="h-[1.4em] w-[1.4em]" fill="currentColor">
    <rect x="3" y="3" width="8" height="8" rx="2" />
    <rect x="13" y="3" width="8" height="8" rx="2" />
    <rect x="3" y="13" width="8" height="8" rx="2" />
    <rect x="13" y="13" width="8" height="8" rx="2" />
  </svg>
);

/** Цена дорожки: у обеих - одна колонка справа. */
function Price({ delay, children }: { delay: number; children: ReactNode }) {
  return (
    <span className="relative ml-auto">
      <Chip className="a-pop bg-surface-2 text-ink" style={anim({ delay, dur: 0.4 })}>
        {children}
      </Chip>
    </span>
  );
}

/** Площадка сети: мини-страница; minus - номер в очереди зачёркивания. */
function Site({ i, minus }: { i: number; minus?: number }) {
  return (
    <span className="a-pop relative block" style={anim({ delay: T.sites, i, step: 0.08, dur: 0.4 })}>
      <span
        className={cn(
          "flex h-[4.2em] w-[4.2em] flex-col gap-[0.45em] rounded-[0.6em] border bg-bg p-[0.6em]",
          minus === undefined ? "border-ink/40" : "border-border",
        )}
      >
        <span className="block h-[1.1em] w-full rounded-[0.25em] bg-ink/15" />
        <span className="block h-[0.45em] w-[80%] rounded-full bg-ink/15" />
        <span className="block h-[0.45em] w-[55%] rounded-full bg-ink/10" />
      </span>
      {minus !== undefined && (
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="block w-[125%] -rotate-45">
            <span
              className="a-grow-x block h-[max(1px,0.16em)] rounded-full bg-ink-2"
              style={anim({ delay: T.strike, i: minus, step: 0.15, dur: 0.3 })}
            />
          </span>
        </span>
      )}
    </span>
  );
}

/** Яндекс Директ: поиск и сеть - разные кампании со своей ценой обращения. */
export function DirectScene() {
  return (
    <div className="absolute inset-0 flex flex-col">
      {/* Фразы с операторами */}
      <div className="flex flex-wrap items-center gap-[0.5em]">
        <span className="ill-t-sm ill-detail mr-[0.2em] leading-none text-muted">фразы</span>
        {PHRASES.map((p, i) => (
          <Chip
            key={p}
            tone="outline"
            className="a-rise text-ink"
            style={anim({ delay: T.phrases, i, step: 0.08, dur: 0.5 }, { "--a-y": "0.4em" })}
          >
            {p}
          </Chip>
        ))}
      </div>

      <div className="my-auto flex flex-col gap-[1em]">
        <Lane icon={lens} title="Поиск" delay={T.lanes[0]}>
          <Price delay={T.price}>своя цена обращения</Price>
          {/* Хвост: путь доходит до точки, дальше его закрывает подпись */}
          <span className="ydx-end relative flex shrink-0 items-center self-stretch pl-[0.9em]">
            <LeadDot delay={T.lead} className="h-[max(8px,1.1em)] w-[max(8px,1.1em)]" />
            <span className="flex flex-1 items-center self-stretch bg-surface pl-[0.5em]">
              <span
                className="a-fade ill-t-sm ill-detail leading-none text-ink"
                style={anim({ delay: T.lead + 0.05 })}
              >
                обращение
              </span>
            </span>
          </span>
        </Lane>

        <Lane icon={grid} title="Сеть" delay={T.lanes[1]}>
          <span className="relative ml-[1.2em] flex gap-[0.6em]">
            <Site i={0} />
            <Site i={1} minus={0} />
            <Site i={2} minus={1} />
            {/* Подпись под зачёркнутыми: от 2-й площадки, em - от сцены */}
            <span className="ill-detail absolute left-[4.8em] top-full mt-[0.35em]">
              <span
                className="a-fade ill-t-sm block whitespace-nowrap leading-none text-muted"
                style={anim({ delay: T.strike + 0.2 })}
              >
                минус-площадки
              </span>
            </span>
          </span>
          <Price delay={T.price + 0.3}>своя цена</Price>
          <span className="ydx-end relative shrink-0 self-stretch bg-surface" />
        </Lane>
      </div>

      <div className="flex justify-end">
        <Chip tone="outline" className="text-ink-2">
          Метрика · цели
          <span className="a-pop text-ink" style={anim({ delay: T.goals, dur: 0.4 })}>
            ✓
          </span>
        </Chip>
      </div>
    </div>
  );
}
