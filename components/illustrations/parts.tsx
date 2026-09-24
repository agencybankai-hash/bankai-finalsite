import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { anim } from "./vars";

/* Общие детали сцен. Размеры в em сцены (1em = 1/48 ширины), цвет - токены:
   внутри .tone-ink они инвертируются сами. */

/** Точка заявки - единственный коралл сцены. Кольцо-пульс (до 3 раз) - только в живой сцене. */
export function LeadDot({ delay = 2.3, className }: { delay?: number; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn("relative inline-block h-[max(7px,1em)] w-[max(7px,1em)] shrink-0", className)}
    >
      <span
        className="a-pulse absolute inset-0 rounded-full bg-accent"
        style={anim({ delay: delay + 0.35 })}
      />
      <span className="a-pop absolute inset-0 rounded-full bg-accent" style={anim({ delay })} />
    </span>
  );
}

const chipTones = {
  muted: "bg-surface-2 text-ink-2",
  solid: "bg-ink text-bg",
  outline: "border border-border text-ink-2",
  dashed: "border border-dashed border-border text-muted",
  struck: "border border-dashed border-border text-muted line-through",
};

/** Пилюля-ярлык сцены. */
export function Chip({
  children,
  tone = "muted",
  className,
  style,
}: {
  children: ReactNode;
  tone?: keyof typeof chipTones;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <span
      className={cn(
        "ill-t-sm inline-flex items-center gap-[0.35em] whitespace-nowrap rounded-full px-[0.7em] py-[0.3em] leading-none",
        chipTones[tone],
        className,
      )}
      style={style}
    >
      {children}
    </span>
  );
}

const barTones = { faint: "bg-ink/10", soft: "bg-ink/20", strong: "bg-ink/70" };

/** Скелетон-строка текста; ширина - em или %. */
export function Bar({
  w,
  tone = "soft",
  className,
  style,
}: {
  w: string;
  tone?: keyof typeof barTones;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <span
      aria-hidden
      className={cn("block h-[0.55em] rounded-full", barTones[tone], className)}
      style={{ width: w, ...style }}
    />
  );
}

/** Строка поиска. typing - запрос набирается по буквам (span на символ, включается visibility). */
export function SearchBar({
  query,
  typing = false,
  delay = 0.7,
  step = 0.035,
  className,
}: {
  query: string;
  typing?: boolean;
  delay?: number;
  step?: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-[0.7em] rounded-full border border-border bg-surface px-[1em] py-[0.6em]",
        className,
      )}
    >
      <svg
        viewBox="0 0 24 24"
        aria-hidden
        className="h-[1.4em] w-[1.4em] shrink-0 text-muted"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      >
        <circle cx="11" cy="11" r="7" />
        <path d="m21 21-4.3-4.3" />
      </svg>
      <span className="ill-t-md min-w-0 truncate text-ink">
        {typing
          ? Array.from(query).map((ch, i) => (
              <span key={i} className="a-type" style={anim({ delay, i, step })}>
                {ch}
              </span>
            ))
          : query}
      </span>
    </div>
  );
}

/** Курсор-стрелка. Позицию и движение задаёт сцена (обёртка с a-slide), clickDelay - кольцо клика. */
export function Cursor({
  clickDelay,
  className,
  style,
}: {
  clickDelay?: number;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <span
      aria-hidden
      className={cn("pointer-events-none absolute block h-[2em] w-[2em]", className)}
      style={style}
    >
      {clickDelay !== undefined && (
        <span
          className="a-pulse absolute -left-[0.8em] -top-[0.8em] block h-[1.6em] w-[1.6em] rounded-full border-2 border-ink"
          style={anim({ delay: clickDelay, dur: 0.7, iter: 1 })}
        />
      )}
      <svg viewBox="0 0 20 20" className="relative block h-full w-full">
        <path
          d="M3 2v14l3.8-3.4 2.7 5.6 2.3-1.1-2.7-5.5 5.2-.4z"
          className="text-ink"
          fill="currentColor"
          stroke="none"
        />
        <path
          d="M3 2v14l3.8-3.4 2.7 5.6 2.3-1.1-2.7-5.5 5.2-.4z"
          className="text-bg"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.1"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}
