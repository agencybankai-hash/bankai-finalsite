import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Bar } from "../../parts";
import { anim } from "../../vars";

/* Детали сцен сайтов: телефон, блоки мини-сайта, касание, иконки.
   Задержки - явные, у каждой сцены свой таймлайн: переменные --i и --a-dur
   наследуются, вложенный узел без своей задержки взял бы чужую. */

export const at = (s: number) => Math.round(s * 100) / 100;

/* ── Иконки: один path на 24×24, штрих currentColor ── */

const ICON = {
  menu: "M4 7h16M4 12h16M4 17h10",
  phone:
    "M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z",
  form: "M6 3h12a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zM9 8h6M9 12h6M9 16h3",
  chat: "M7.9 20A9 9 0 1 0 4 16.1L2 22z",
  ad: "M3 11l18-5v12L3 14v-3zM11.6 16.8a3 3 0 1 1-5.8-1.6",
  search: "M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM21 21l-4.3-4.3",
  send: "M22 2 15 22l-4-9-9-4zM22 2 11 13",
  scroll: "M12 4v12M6 11l6 6 6-6M5 21h14",
  eye: "M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  cart: "M2 3h2.5l2.4 11.2a2 2 0 0 0 2 1.6h8.9a2 2 0 0 0 1.9-1.5L21.5 7H5.4M9 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM18 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2z",
  truck:
    "M2 6h12v11H2zM14 10h4.5l3.5 3.5V17h-8M6.5 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM17.5 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4z",
  card: "M3 6h18a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1zM2 10h20",
  check: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM8 12l3 3 5-6",
  home: "M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z",
  grid: "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z",
  user: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0",
  users:
    "M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM2.5 20a6.5 6.5 0 0 1 13 0M16 4.3a3.5 3.5 0 0 1 0 6.4M21.5 20a6.5 6.5 0 0 0-4.5-6.2",
  down: "M6 9l6 6 6-6",
  tick: "M5 12.5l4.5 4.5L19 7.5",
  lock: "M6 11h12v10H6zM8.5 11V8a3.5 3.5 0 0 1 7 0v3",
  pin: "M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11zM12 12.3a2.3 2.3 0 1 0 0-4.6 2.3 2.3 0 0 0 0 4.6z",
  clock: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2",
  shield: "M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z",
  star: "M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z",
  calendar: "M4 6h16v14H4zM4 10h16M8 3v4M16 3v4",
  list: "M9 6h11M9 12h11M9 18h11M4.5 6h.01M4.5 12h.01M4.5 18h.01",
  sync: "M20 11a8 8 0 0 0-14.3-4.9L4 8M4 4v4h4M4 13a8 8 0 0 0 14.3 4.9L20 16M20 20v-4h-4",
  doc: "M6 3h8l4 4v14H6zM14 3v4h4M9 12h6M9 16h6",
  inbox: "M3 13l3-8h12l3 8v6H3zM3 13h5l1.5 2.5h5L16 13h5",
  filter: "M4 5h16l-6 7v6l-4 2v-8z",
  globe: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18",
} as const;

export type IconName = keyof typeof ICON;

export function Icon({ name, className }: { name: IconName; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className={cn("block h-[1.2em] w-[1.2em] shrink-0", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={ICON[name]} />
    </svg>
  );
}

export function IconBox({ name, className }: { name: IconName; className?: string }) {
  return (
    <span
      className={cn(
        "grid h-[2.2em] w-[2.2em] shrink-0 place-items-center rounded-[0.65em] bg-surface-2 text-ink-2",
        className,
      )}
    >
      <Icon name={name} />
    </span>
  );
}

/** Галочка прорисовывается (a-draw, 0.25 с); в финальном кадре - сплошная. */
export function DrawnTick({ delay, className }: { delay: number; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className={cn("block h-[1.1em] w-[1.1em] shrink-0 text-ink", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={ICON.tick} pathLength={1} className="a-draw" style={anim({ delay, dur: 0.25 })} />
    </svg>
  );
}

/* ── Телефон ── */

/** Корпус и экран. Позиция и размер - className (em сцены); обёртка - вход телефона.
 *  Экран обрезает нижнюю панель (она въезжает снизу). */
export function Phone({
  className,
  delay,
  bodyClassName,
  children,
  bottom,
}: {
  className: string;
  delay: number;
  bodyClassName?: string;
  children: ReactNode;
  bottom?: ReactNode;
}) {
  return (
    <div className={cn("a-rise absolute", className)} style={anim({ delay }, { "--a-y": "1.2em" })}>
      <span className="ill-detail absolute -left-[0.2em] top-[5.5em] h-[2.2em] w-[0.3em] rounded-l-[0.2em] bg-surface-2" />
      <span className="ill-detail absolute -left-[0.2em] top-[8.4em] h-[2.2em] w-[0.3em] rounded-l-[0.2em] bg-surface-2" />
      <span className="ill-detail absolute -right-[0.2em] top-[7em] h-[3.4em] w-[0.3em] rounded-r-[0.2em] bg-surface-2" />
      <div className="relative h-full rounded-[2.3em] bg-surface-2 p-[0.4em] ring-1 ring-inset ring-ink/10">
        <div className="relative flex h-full flex-col overflow-hidden rounded-[1.9em] bg-bg">
          <span className="mx-auto mt-[0.55em] h-[0.95em] w-[3.8em] shrink-0 rounded-full bg-surface-2" />
          <div className={cn("flex flex-1 flex-col gap-[0.9em] px-[0.85em] pt-[0.9em]", bodyClassName)}>
            {children}
          </div>
          {bottom}
        </div>
      </div>
    </div>
  );
}

/** Блок мини-сайта: пунктирный контур-вайрфрейм под заливкой. Заливка закрывает
 *  контур кольцом цвета экрана (.web-fill), поэтому в финальном кадре его не видно.
 *  Одна анимация на блок: заливка проявляется, контур гаснет под ней. */
export function Block({
  delay,
  className,
  fill,
  children,
}: {
  delay: number;
  className?: string;
  fill?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("relative shrink-0", className)}>
      <span aria-hidden className="web-wire" />
      <div className={cn("web-fill a-fade h-full", fill)} style={anim({ delay, dur: 0.5 })}>
        {children}
      </div>
    </div>
  );
}

export function Logo() {
  return (
    <span className="flex items-center gap-[0.45em]">
      <span className="h-[1.3em] w-[1.3em] rounded-[0.4em] bg-ink/70" />
      <Bar w="3.4em" />
    </span>
  );
}

export function Nav({ icon, delay }: { icon: IconName; delay: number }) {
  return (
    <Block delay={delay} className="h-[1.8em]" fill="flex items-center justify-between">
      <Logo />
      <Icon name={icon} className="text-ink-2" />
    </Block>
  );
}

/** Касание пальцем: пятно проявляется (a-fade: полупрозрачный круг без transform
 *  растрируется в финале как в статике) и кольцо-волна (a-pulse, один раз; в финальном
 *  кадре не видно). spot={false} - только волна; on="light" - поверх светлой кнопки. */
export function Tap({
  delay,
  className,
  spot = true,
  on = "dark",
}: {
  delay: number;
  className: string;
  spot?: boolean;
  on?: "dark" | "light";
}) {
  return (
    <>
      {spot && (
        <span
          className={cn("a-fade absolute rounded-full bg-ink/15", className)}
          style={anim({ delay, dur: 0.4 })}
        />
      )}
      <span
        className={cn(
          "a-pulse absolute rounded-full border opacity-0",
          on === "light" ? "border-bg/40" : "border-ink/50",
          className,
        )}
        style={anim({ delay, dur: 0.9, iter: 1 })}
      />
    </>
  );
}

/** Главная кнопка: светлая (единственная инверсия экрана). short - подпись компактной сцены. */
export function Cta({
  delay,
  label = "Оставить заявку",
  short,
  tap,
}: {
  delay: number;
  label?: string;
  short?: string;
  /** Задержка касания кнопки. */
  tap?: number;
}) {
  return (
    <Block delay={delay} className="rounded-[0.7em]">
      <span
        className={cn(
          "relative grid h-[2.6em] place-items-center rounded-[0.7em] bg-ink text-bg",
          tap !== undefined && "overflow-hidden",
        )}
      >
        {tap !== undefined && (
          <Tap delay={tap} on="light" spot={false} className="right-[0.7em] top-[0.3em] h-[2em] w-[2em]" />
        )}
        <span className={cn("ill-t-sm whitespace-nowrap font-semibold", short && "ill-detail")}>
          {label}
        </span>
        {short && <span className="ill-t-sm web-compact whitespace-nowrap font-semibold">{short}</span>}
      </span>
    </Block>
  );
}

export function Field({ children }: { children?: ReactNode }) {
  return (
    <span className="flex h-[2.1em] items-center rounded-[0.55em] border border-border px-[0.6em]">
      {children ?? <Bar w="45%" tone="faint" />}
    </span>
  );
}

export function RoundButton({ icon, tap }: { icon: IconName; tap?: number }) {
  return (
    <span
      className={cn(
        "relative grid h-[2.3em] w-[2.3em] place-items-center rounded-full border",
        tap !== undefined ? "border-ink/30 bg-surface-2 text-ink" : "border-border text-ink-2",
      )}
    >
      {tap !== undefined && <Tap delay={tap} className="-inset-[0.55em]" />}
      <Icon name={icon} className="relative" />
    </span>
  );
}

/** Фото в блоке: комната (сайт) или банка краски (магазин), line-art. */
export function Photo({
  delay,
  art,
  className,
}: {
  delay: number;
  art: "room" | "paint";
  className: string;
}) {
  return (
    <Block delay={delay} className={cn("rounded-[0.8em]", className)} fill="rounded-[0.8em] bg-surface-2">
      <svg
        viewBox="0 0 120 64"
        aria-hidden
        className="h-full w-full text-ink/35"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path
          d={
            art === "room"
              ? "M10 54h100M78 12h24v26H78zM90 12v26M78 25h24M36 4v9M29.5 19l2.5-6h8l2.5 6zM17 54v-2M55 54v-2M15 52V44a3 3 0 0 1 6 0v3h30v-3a3 3 0 0 1 6 0v8zM21 44v-5a3 3 0 0 1 3-3h24a3 3 0 0 1 3 3v5"
              : "M40 21h26v29a3 3 0 0 1-3 3H43a3 3 0 0 1-3-3zM38 17h30v4H38zM44 17c0-9 18-9 18 0M40 29h26M40 43h26M78 22h18a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H78a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2zM98 26h3v8l-14 3v16"
          }
        />
      </svg>
    </Block>
  );
}
