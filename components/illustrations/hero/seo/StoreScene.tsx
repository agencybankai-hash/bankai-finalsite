import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Bar, Chip, LeadDot, SearchBar } from "../../parts";
import type { SceneProps } from "../../types";
import { anim } from "../../vars";

/* Каталог в поиске: слева страница категории магазина - хлебные крошки и
   фильтры (со своим спросом открыты для индекса, сортировка и пагинация
   закрыты), справа - эта категория в выдаче по запросу покупателя с ценой и
   наличием в сниппете. Телефон - карточка результата и ряд фильтров.
   Базовый стиль - финальный кадр. */

/** Таймлайн, с: крошки по сегментам → галочки и зачёркивания → результат →
 *  чипы сниппета → заказ. */
const T = {
  crumbs: 0.6,
  crumbStep: 0.15,
  filters: 0.8,
  check: 1.0,
  strike: 1.2,
  step: 0.1,
  card: 1.5,
  snippet: 1.85,
  order: 2.3,
};

const CRUMBS = ["Каталог", "Обувь", "Кроссовки"];

/** Галочка открытого фильтра: прорисовка штриха. */
function Check({ i }: { i: number }) {
  return (
    <svg
      viewBox="0 0 16 16"
      aria-hidden
      className="h-[1em] w-[1em] shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path
        d="m3 8.5 3.2 3.2L13 4.8"
        pathLength={1}
        className="a-draw"
        style={anim({ delay: T.check, i, step: T.step, dur: 0.35 })}
      />
    </svg>
  );
}

/** Закрытый фильтр: пунктир и линия поверх текста, линия протягивается. */
function Closed({
  children,
  i,
  className,
}: {
  children: ReactNode;
  i: number;
  className?: string;
}) {
  return (
    <Chip tone="dashed" className={cn("relative", className)}>
      {children}
      <span
        aria-hidden
        className="a-grow-x absolute inset-x-[0.6em] top-1/2 h-px bg-muted"
        style={anim({ delay: T.strike, i, step: T.step, dur: 0.3 })}
      />
    </Chip>
  );
}

/** Страница категории: крошки, фильтры. На телефоне - один ряд фильтров. */
function Category() {
  return (
    <div className="store-site">
      <div className="ill-t-sm ill-detail flex min-w-0 flex-wrap items-center gap-x-[0.4em] gap-y-[0.35em] whitespace-nowrap leading-none">
        {CRUMBS.map((c, i) => {
          const last = i === CRUMBS.length - 1;
          return (
            <span
              key={c}
              className={cn("a-fade", last ? "text-ink" : "text-muted")}
              style={anim({ delay: T.crumbs, i, step: T.crumbStep })}
            >
              {c}
              {!last && <span className="ml-[0.4em]">›</span>}
            </span>
          );
        })}
      </div>

      <div className="store-filters a-fade" style={anim({ delay: T.filters })}>
        <span className="store-caption ill-t-sm ill-detail leading-none text-muted">в индексе</span>
        {["для бега", "мужские"].map((f, i) => (
          <Chip key={f} tone="outline" className="border-ink/40 text-ink">
            {f}
            <Check i={i} />
          </Chip>
        ))}
        <span className="store-caption ill-t-sm ill-detail leading-none text-muted">
          закрыты от индекса
        </span>
        <Closed i={0} className="ill-detail">
          сортировка по цене
        </Closed>
        <Closed i={1}>стр. 2, 3…</Closed>
      </div>

      {/* Товары категории */}
      <div className="ill-detail mt-auto grid grid-cols-3 gap-[0.7em] pt-[1.2em]">
        {["70%", "54%", "62%"].map((w) => (
          <span key={w} className="flex flex-col gap-[0.4em]">
            <span className="aspect-[4/3] rounded-[0.5em] bg-ink/6" />
            <Bar w={w} tone="faint" className="h-[0.45em]" />
            <Bar w="40%" className="h-[0.5em]" />
          </span>
        ))}
      </div>
    </div>
  );
}

/** Результат в выдаче: крошки сайта, заголовок категории, сниппет с ценой и
 *  наличием, заказ. */
function Result() {
  return (
    <div
      className="store-card a-rise rounded-[0.9em] border border-ink/30 bg-surface"
      style={anim({ delay: T.card })}
    >
      <div className="flex min-w-0 items-center gap-[0.6em]">
        <span className="grid h-[max(10px,1.3em)] w-[max(10px,1.3em)] shrink-0 grid-cols-2 gap-[max(1px,0.14em)]">
          {[0, 1, 2, 3].map((k) => (
            <span key={k} className="rounded-[0.1em] bg-ink/60" />
          ))}
        </span>
        <span className="ill-t-sm truncate leading-none text-muted">
          ваш-сайт.kz › Обувь › Кроссовки
        </span>
      </div>
      <p className="ill-t-lg mt-[0.55em] font-semibold leading-tight tracking-tight text-ink">
        Кроссовки для бега мужские
      </p>
      <div className="mt-[0.7em] flex flex-col gap-[0.4em]">
        <Bar w="92%" tone="faint" className="h-[0.45em]" />
        <Bar w="68%" tone="faint" className="h-[0.45em]" />
      </div>
      <div className="mt-[0.8em] flex items-center gap-[0.5em]">
        {["цена", "в наличии"].map((s, i) => (
          <Chip key={s} className="a-pop" style={anim({ delay: T.snippet, i, step: T.step })}>
            {s}
          </Chip>
        ))}
        <Chip
          tone="outline"
          className="a-fade ml-auto border-ink/40 text-ink"
          style={anim({ delay: T.order - 0.05 })}
        >
          <LeadDot delay={T.order} />
          заказ
        </Chip>
      </div>
    </div>
  );
}

/** Соседний результат выдачи - тусклый скелетон. */
function Other({ title, url }: { title: string; url: string }) {
  return (
    <div className="ill-detail flex items-start gap-[0.8em] px-[1.1em] opacity-60">
      <span className="h-[1.3em] w-[1.3em] shrink-0 rounded-[0.3em] bg-ink/15" />
      <span className="flex min-w-0 flex-1 flex-col gap-[0.35em] pt-[0.2em]">
        <Bar w={url} tone="faint" className="h-[0.45em]" />
        <Bar w={title} className="h-[0.6em]" />
      </span>
    </div>
  );
}

/** Сцена SEO интернет-магазина: категория с фильтрами под спрос - в выдаче. */
export function SeoStoreScene({ v }: SceneProps) {
  return (
    <div className="store-body absolute inset-0 flex">
      <Category />
      <div className="store-serp flex min-w-0 flex-1 flex-col">
        <SearchBar query={v.copy.query ?? ""} className="ill-detail" />
        <Other title="58%" url="30%" />
        <Result />
        <Other title="64%" url="26%" />
        <Other title="52%" url="32%" />
      </div>
    </div>
  );
}
