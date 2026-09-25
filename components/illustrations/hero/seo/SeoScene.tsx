import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";
import { Bar, LeadDot, SearchBar } from "../../parts";
import type { SceneProps } from "../../types";
import { anim } from "../../vars";

type Result = { title: string; url: string };

/* Органика первой страницы: ширины скелетона в % колонки текста. Строки 7-10
   на телефоне скрыты, строку 4 накрывает слот сайта. */
const TOP_10: Result[] = [
  { title: "64%", url: "30%" },
  { title: "52%", url: "24%" },
  { title: "70%", url: "34%" },
  { title: "58%", url: "26%" },
  { title: "48%", url: "30%" },
  { title: "66%", url: "22%" },
  { title: "55%", url: "32%" },
  { title: "61%", url: "26%" },
  { title: "50%", url: "20%" },
  { title: "68%", url: "28%" },
];
const PAGE_2: Result = { title: "46%", url: "24%" };

/** Выдача проявляется сверху вниз: строка i - в 0.6 + i·0.04 с. */
const ROWS_IN = { delay: 0.6, step: 0.04, dur: 0.5 };

/** Строка выдачи: фавикон, заголовок, адрес. */
function Row({ r, className, style }: { r: Result; className?: string; style?: CSSProperties }) {
  return (
    <div className={cn("seo-row flex items-center gap-[0.8em]", className)} style={style}>
      <span className="h-[1.1em] w-[1.1em] shrink-0 rounded-full bg-ink/15" />
      <span className="flex min-w-0 flex-1 flex-col gap-[0.3em]">
        <Bar w={r.title} />
        <Bar w={r.url} tone="faint" className="h-[0.45em]" />
      </span>
    </div>
  );
}

/** Слот сайта: строка 4 и маркер в рельсе - один блок. Строки одной высоты,
 *  поэтому подъём со второй страницы из-под линии ТОП-10 - один translateY
 *  (a-slide, путь - в seo.css). Внутренняя обёртка - проявление на старте. */
function SiteSlot() {
  return (
    <div className="seo-slot a-slide absolute inset-x-0" style={anim({ delay: 1.2, dur: 1.3 })}>
      <div className="a-fade flex h-full items-center" style={anim({ delay: 1.1, dur: 0.5 })}>
        <div className="relative ml-[0.3em] flex h-full min-w-0 flex-1 items-center gap-[0.8em] rounded-[0.7em] bg-surface pl-[0.8em]">
          <span className="absolute inset-0 rounded-[0.7em] border border-ink/30" />
          <span className="relative h-[1.1em] w-[1.1em] shrink-0 rounded-full bg-ink/60" />
          <span className="relative flex min-w-0 flex-1 flex-col gap-[0.3em]">
            {/* Заголовок под заливкой: подсветка строки - протяжка заливки поверх. */}
            <span className="relative block h-[0.55em] w-[60%]">
              <Bar w="100%" className="absolute inset-0" />
              <Bar
                w="100%"
                tone="strong"
                className="a-grow-x absolute inset-0"
                style={anim({ delay: 2.2, dur: 0.5 })}
              />
            </span>
            <Bar w="28%" tone="faint" className="h-[0.45em]" />
          </span>
        </div>

        <div className="seo-rail relative ml-[1.4em] flex h-full shrink-0 items-center">
          <span className="ill-t-sm relative whitespace-nowrap rounded-full border border-ink/40 bg-bg px-[0.7em] py-[0.3em] leading-none text-ink">
            <span className="absolute left-0 top-1/2 h-[0.55em] w-[0.55em] -translate-x-1/2 -translate-y-1/2 rotate-45 border-b border-l border-ink/40 bg-bg" />
            ваш сайт
          </span>
          <span className="seo-lead absolute left-[0.7em] top-full flex items-center gap-[0.4em]">
            <LeadDot delay={2.45} className="h-[max(7px,1.1em)] w-[max(7px,1.1em)]" />
            <span className="a-fade ill-t-sm leading-none text-muted" style={anim({ delay: 2.5 })}>
              заявки
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}

/** Сцена SEO: органическая выдача, сайт в первой десятке, заявки без оплаты за клик. */
export function SeoScene({ v }: SceneProps) {
  return (
    <div className="seo-scene absolute inset-0 flex flex-col overflow-hidden">
      <SearchBar query={v.copy.query ?? ""} />

      <div className="relative mt-[0.9em]">
        <div className="seo-col pl-[1.1em]">
          {TOP_10.map((r, i) => (
            <Row
              key={i}
              r={r}
              className={cn("a-fade", i >= 6 && "ill-detail")}
              style={anim({ ...ROWS_IN, i })}
            />
          ))}
        </div>

        {/* Граница первой страницы */}
        <div className="seo-line flex items-center gap-[0.6em] pl-[1.1em]">
          <span
            className="a-grow-x flex-1 border-t border-dashed border-ink/25"
            style={anim({ delay: 0.9, dur: 0.7 })}
          />
          <span className="a-fade ill-t-sm leading-none text-muted" style={anim({ delay: 1.3 })}>
            ТОП-10
          </span>
        </div>

        {/* Вторая страница: шаг каскада (--i) - в seo.css, на телефоне строк меньше */}
        <div className="seo-col pl-[1.1em] opacity-40">
          <Row r={PAGE_2} className="seo-p2 a-fade" style={anim(ROWS_IN)} />
        </div>

        <SiteSlot />
      </div>
    </div>
  );
}
