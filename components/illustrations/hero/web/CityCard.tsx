import type { ReactNode } from "react";
import { anim } from "../../vars";
import { DrawnTick, Icon, at, type IconName } from "./kit";

/* Карточка города в ленте сцены сайта: то, что на странице города сайт делает
   сверх базового, - шапка, пункты с галочками и вывод. Галочки
   прорисовываются по очереди с TICK. */

const TICK = { delay: 1.8, step: 0.12 };
const tickAt = (i: number) => at(TICK.delay + i * TICK.step);

type Card = { head: ReactNode; items: string[]; note: string };

const CARDS: Record<string, Card> = {
  Алматы: {
    head: <Head icon="pin">2GIS · Google Карты</Head>,
    items: ["адрес", "телефон", "часы"],
    note: "совпадают с сайтом",
  },
  Астана: {
    head: (
      <span className="ill-t-sm flex min-w-0 items-center gap-[0.45em] rounded-full border border-border bg-bg px-[0.8em] py-[0.35em] leading-none text-ink">
        <Icon name="lock" className="h-[1em] w-[1em] text-ink-2" />
        <span className="truncate">компания.kz</span>
      </span>
    ),
    items: ["RU", "KZ", "EN"],
    note: "SSL и хостинг в Казахстане",
  },
  Шымкент: {
    head: (
      <span className="ill-t-sm flex min-w-0 items-center gap-[0.5em] text-ink">
        <Icon name="doc" className="h-[1.15em] w-[1.15em] text-ink-2" />
        <span className="truncate">прайс</span>
        <span className="text-muted">→</span>
        <Icon name="grid" className="h-[1.15em] w-[1.15em] text-ink-2" />
        <span className="truncate font-medium">каталог</span>
      </span>
    ),
    items: ["опт", "розница"],
    note: "прайс обновляется из файла",
  },
};

function Head({ icon, children }: { icon: IconName; children: ReactNode }) {
  return (
    <span className="ill-t-sm flex min-w-0 items-center gap-[0.5em] font-medium text-ink">
      <Icon name={icon} className="h-[1.15em] w-[1.15em] text-ink-2" />
      <span className="truncate">{children}</span>
    </span>
  );
}

export function hasCityCard(city?: string): city is string {
  return Boolean(city && CARDS[city]);
}

export function CityCard({ city, delay }: { city: string; delay: number }) {
  const { head, items, note } = CARDS[city];
  return (
    <div
      className="a-rise mb-[0.3em] flex flex-col gap-[0.55em] rounded-[0.9em] border border-border p-[0.7em]"
      style={anim({ delay })}
    >
      <div className="flex min-w-0">{head}</div>
      <div className="ill-t-sm flex flex-wrap items-center gap-x-[0.6em] gap-y-[0.3em] text-ink">
        {items.map((label, i) => (
          <span key={label} className="flex items-center gap-[0.2em] whitespace-nowrap">
            {label}
            <DrawnTick delay={tickAt(i)} className="h-[1em] w-[1em]" />
          </span>
        ))}
      </div>
      <div className="ill-t-sm truncate text-muted">{note}</div>
    </div>
  );
}
