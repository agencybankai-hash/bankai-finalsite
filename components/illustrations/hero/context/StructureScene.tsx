import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Chip, LeadDot } from "../../parts";
import { anim } from "../../vars";

/* Структура аккаунта Google Ads: слева дерево «аккаунт → кампании → группы →
   объявления» с типами соответствия, справа минус-слова и конверсии.
   Геометрия - единицы viewBox 480×300 (10 ед. = 1em): строки дерева стоят на
   сетке 42 ед., узел уровня n начинается с отступа 26·n, связи - SVG от левого
   края родителя к левому краю узла. Кегль узлов на телефоне упирается в порог
   10px, но растёт только вправо - точки стыка связей не сдвигаются.
   Базовый стиль - финальный кадр. Движение: связи по уровням → узлы уровня →
   чипы соответствия → минус-слова зачёркиваются → галочки конверсий → заявка.
   Телефон: дерево и конверсии. */

const T = {
  levels: [0.8, 1.05, 1.3],
  chips: 1.6,
  strike: 1.8,
  checks: 2.2,
  lead: 2.5,
};

/** Шаг строки и отступ уровня, ед. */
const ROW = 42;
const INDENT = 26;
/** Стык связи: вертикаль уровня n идёт по x = INDENT·n + 10. */
const trunk = (level: number) => INDENT * level + 10;
const rowY = (row: number) => ROW * row + 14;

/** Связь родитель → узел: вниз по стволу родителя, скругление, вправо до узла. */
function elbow(level: number, fromRow: number, toRow: number): string {
  const x = trunk(level - 1);
  const y0 = rowY(fromRow) + 10;
  const y1 = rowY(toRow);
  return `M${x} ${y0}V${y1 - 6}Q${x} ${y1} ${x + 6} ${y1}H${INDENT * level - 2}`;
}

/** Связи по уровням: у каждого уровня - один путь, ветки прорисовываются разом. */
const LINKS = [
  { level: 1, d: elbow(1, 0, 1) + elbow(1, 0, 5) },
  { level: 2, d: elbow(2, 1, 2) + elbow(2, 1, 4) + elbow(2, 5, 6) },
  { level: 3, d: elbow(3, 2, 3) },
];

/** Узел дерева: строка и уровень задают позицию, кегль - внутри. */
function Node({ row, level, children }: { row: number; level: number; children: ReactNode }) {
  return (
    <span
      className="absolute flex -translate-y-1/2 items-center gap-[0.5em]"
      style={{ left: `${(INDENT * level) / 10}em`, top: `${rowY(row) / 10}em` }}
    >
      {children}
    </span>
  );
}

function Campaign({ children }: { children: ReactNode }) {
  return (
    <span className="ill-t-sm whitespace-nowrap rounded-[0.5em] border border-border bg-surface px-[0.6em] py-[0.4em] leading-none text-ink">
      {children}
    </span>
  );
}

function Group() {
  return (
    <span className="ill-t-sm whitespace-nowrap rounded-[0.5em] border border-dashed border-border bg-bg px-[0.6em] py-[0.35em] leading-none text-ink-2">
      группа
    </span>
  );
}

/** Минус-слово: штрих протягивается слева направо. */
function Minus({ word, i }: { word: string; i: number }) {
  return (
    <span className="ill-t-sm relative whitespace-nowrap rounded-full border border-dashed border-border px-[0.7em] py-[0.3em] leading-none text-muted">
      {word}
      <span
        aria-hidden
        className="a-grow-x absolute inset-x-[0.5em] top-1/2 block h-px bg-ink-2"
        style={anim({ delay: T.strike, i, step: 0.15, dur: 0.35 })}
      />
    </span>
  );
}

/** Строка конверсии: основная - с галочкой, второстепенная - приглушённая. */
function Goal({ name, i, children }: { name: string; i?: number; children?: ReactNode }) {
  const primary = i !== undefined;
  return (
    <span className="flex items-center gap-[0.5em]">
      <span
        className={cn(
          "ill-t-sm flex items-center gap-[0.35em] whitespace-nowrap rounded-full px-[0.7em] py-[0.3em] leading-none",
          primary ? "bg-surface-2 text-ink" : "border border-dashed border-border text-muted",
        )}
      >
        {name}
        {primary && (
          <span className="a-pop text-ink-2" style={anim({ delay: T.checks, i, step: 0.08, dur: 0.4 })}>
            ✓
          </span>
        )}
      </span>
      {children}
    </span>
  );
}

function Caption({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={cn("ill-t-sm block leading-none text-muted", className)}>{children}</span>
  );
}

/** Структура аккаунта Google Ads: дерево кампаний, минус-слова, основные конверсии. */
export function StructureScene() {
  return (
    <>
      <svg
        viewBox="0 0 480 300"
        aria-hidden
        className="absolute inset-0 h-full w-full"
        fill="none"
        strokeWidth={1.5}
        strokeLinecap="round"
      >
        {LINKS.map((l) => (
          <path
            key={l.level}
            d={l.d}
            pathLength={1}
            className="a-draw stroke-ink/30"
            style={anim({ delay: T.levels[l.level - 1], dur: 0.45 })}
          />
        ))}
      </svg>

      {/* Дерево: корень с первого кадра, уровни проявляются, когда до них дошла связь */}
      <Node row={0} level={0}>
        <Chip tone="solid" className="font-semibold">
          Аккаунт
        </Chip>
      </Node>
      <div className="a-fade absolute inset-0" style={anim({ delay: T.levels[0] + 0.3, dur: 0.4 })}>
        <Node row={1} level={1}>
          <Campaign>Ремонт · поиск</Campaign>
        </Node>
        <Node row={5} level={1}>
          <Campaign>Бренд</Campaign>
        </Node>
      </div>
      <div className="a-fade absolute inset-0" style={anim({ delay: T.levels[1] + 0.3, dur: 0.4 })}>
        <Node row={2} level={2}>
          <Group />
          <Chip tone="outline" className="a-pop" style={anim({ delay: T.chips, dur: 0.4 })}>
            [точное]
          </Chip>
        </Node>
        <Node row={4} level={2}>
          <Group />
          <Chip tone="outline" className="a-pop" style={anim({ delay: T.chips + 0.1, dur: 0.4 })}>
            &quot;фразовое&quot;
          </Chip>
        </Node>
        <Node row={6} level={2}>
          <Group />
        </Node>
      </div>
      <div className="a-fade absolute inset-0" style={anim({ delay: T.levels[2] + 0.3, dur: 0.4 })}>
        <Node row={3} level={3}>
          <span aria-hidden className="relative block h-[2em] w-[2.9em]">
            <span className="absolute right-0 top-0 h-[1.5em] w-[2.3em] rounded-[0.35em] border border-border" />
            <span className="absolute bottom-0 left-0 flex h-[1.5em] w-[2.3em] flex-col justify-center gap-[0.25em] rounded-[0.35em] border border-ink/40 bg-bg px-[0.35em]">
              <span className="block h-[0.3em] w-[60%] rounded-full bg-ink/40" />
              <span className="block h-[0.3em] w-full rounded-full bg-ink/15" />
            </span>
          </span>
          <Caption className="text-ink-2">объявления</Caption>
        </Node>
      </div>

      {/* Правая колонка: минус-слова (широкая сцена) и конверсии */}
      <div
        className="a-fade absolute bottom-0 right-0 top-0 flex w-[19.6em] flex-col justify-between"
        style={anim({ delay: 1.45, dur: 0.5 })}
      >
        <div className="ill-detail rounded-[0.9em] border border-border bg-surface px-[1em] py-[0.85em]">
          <Caption className="text-ink-2">Минус-слова</Caption>
          <div className="mt-[0.75em] flex flex-wrap gap-[0.4em]">
            <Minus word="бесплатно" i={0} />
            <Minus word="вакансии" i={1} />
            <Minus word="своими руками" i={2} />
          </div>
        </div>

        <div className="rounded-[0.9em] border border-border bg-surface px-[1em] py-[0.85em]">
          <Caption className="text-ink-2">Конверсии</Caption>
          <Caption className="mt-[0.8em]">основные</Caption>
          <div className="mt-[0.5em] flex flex-col items-start gap-[0.4em]">
            <Goal name="Форма" i={0}>
              <span className="flex items-center gap-[0.4em]">
                <LeadDot delay={T.lead} className="h-[max(8px,1.1em)] w-[max(8px,1.1em)]" />
                <span
                  className="a-fade ill-t-sm leading-none text-ink"
                  style={anim({ delay: T.lead + 0.05 })}
                >
                  заявка
                </span>
              </span>
            </Goal>
            <Goal name="Звонок" i={1} />
            <Goal name="WhatsApp" i={2} />
          </div>
          <Caption className="mt-[0.8em]">второстепенные</Caption>
          <div className="mt-[0.5em]">
            <Goal name="Просмотры" />
          </div>
        </div>
      </div>
    </>
  );
}
