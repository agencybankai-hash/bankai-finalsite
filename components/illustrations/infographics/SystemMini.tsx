import { cn } from "@/lib/utils";
import { InView } from "@/components/motion/InView";
import { LeadDot } from "../parts";
import { anim } from "../vars";

type Channel = "seo" | "context" | "web";

/* Узлы-пилюли: канал страницы - залит ink, чужие каналы - пунктир и muted. */
const pill =
  "relative inline-flex h-6 items-center justify-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 text-xs leading-none";
const tone = {
  here: "border-ink bg-ink font-semibold text-bg",
  other: "border-dashed border-ink/25 bg-bg text-muted",
  plain: "border-border bg-bg text-ink-2",
};

/* ── Движение (после проявления карточки Reveal): точка-поток дважды проходит
   сплошной путь канала - источник → сайт → заявки, отрезок за FLOW; ярлык
   «вы здесь» проявляется; коралловая точка вспыхивает с приходом первой точки. */
const FLOW_AT = 0.4;
const FLOW = 0.35;

/** Ярлык «вы здесь» над узлом (у нижнего источника - под ним). */
function Here({ below = false }: { below?: boolean }) {
  return (
    <span
      className={cn(
        "a-fade absolute left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-normal leading-none text-ink-2",
        below ? "top-full mt-1.5" : "bottom-full mb-1.5",
      )}
      style={anim({ delay: 0.5, dur: 0.5 })}
    >
      вы здесь
    </span>
  );
}

/**
 * Поток между колонками: SVG без viewBox (единицы = px, x - в % ширины колонки),
 * поэтому линии не искажаются при любой ширине карточки. flow - старт точки-потока
 * (a-flow: копия линии с pathLength="1", в финальном кадре не видна).
 */
function Stream({
  y1,
  y2,
  solid,
  flow,
}: {
  y1: number;
  y2: number;
  solid: boolean;
  flow?: number;
}) {
  return solid ? (
    <>
      <line
        x1="0"
        y1={y1}
        x2="100%"
        y2={y2}
        pathLength={1}
        className="text-ink"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      {flow !== undefined && (
        <line
          x1="0"
          y1={y1}
          x2="100%"
          y2={y2}
          pathLength={1}
          className="a-flow text-ink"
          stroke="currentColor"
          strokeWidth="5"
          style={anim({ delay: flow, dur: FLOW, iter: 2 })}
        />
      )}
    </>
  ) : (
    <line
      x1="0"
      y1={y1}
      x2="100%"
      y2={y2}
      className="text-ink/30"
      stroke="currentColor"
      strokeWidth="1"
      strokeDasharray="3 3"
    />
  );
}

/**
 * Мини-схема «Реклама / SEO → Сайт → Заявки» для карточки «Часть системы»:
 * канал страницы выделен и подписан «вы здесь», его поток сплошной до заявок,
 * остальные - пунктиром. Без highlight - вся система (флагман в панели шапки):
 * оба потока сплошные, узлы ровные. Полоса 96px; колонки потоков тянутся под
 * ширину карточки.
 */
export function SystemMini({
  highlight,
  className,
}: {
  highlight?: Channel;
  className?: string;
}) {
  const src = (ch: Exclude<Channel, "web">) =>
    !highlight ? tone.plain : highlight === ch ? tone.here : tone.other;
  const siteHere = highlight === "web";
  // точка-поток: у источника-канала - два отрезка, у сайта - один
  const toSite = siteHere ? undefined : FLOW_AT;
  const toLeads = siteHere ? FLOW_AT : FLOW_AT + FLOW;
  // центры узлов по высоте полосы: источники 30/66, сайт и заявки 48
  return (
    <InView
      aria-hidden
      className={cn(
        "ig-scope mb-6 grid h-24 grid-cols-[auto_minmax(1rem,1fr)_auto_minmax(1rem,1fr)_auto] items-center",
        className,
      )}
    >
      <div className="flex flex-col gap-3">
        <span className={cn(pill, "w-full", src("context"))}>
          Реклама
          {highlight === "context" && <Here />}
        </span>
        <span className={cn(pill, "w-full", src("seo"))}>
          SEO
          {highlight === "seo" && <Here below />}
        </span>
      </div>

      <svg className="h-24 w-full overflow-visible">
        <Stream y1={30} y2={48} solid={!highlight || highlight === "context"} flow={toSite} />
        <Stream y1={66} y2={48} solid={!highlight || highlight === "seo"} flow={toSite} />
      </svg>

      <span className={cn(pill, siteHere ? tone.here : tone.plain)}>
        Сайт
        {siteHere && <Here />}
      </span>

      <svg className="h-24 w-full overflow-visible">
        <Stream y1={48} y2={48} solid flow={toLeads} />
      </svg>

      <span className={cn(pill, tone.plain, "font-medium text-ink")}>
        <LeadDot className="h-1.5 w-1.5" delay={toLeads + FLOW} />
        Заявки
      </span>
    </InView>
  );
}
