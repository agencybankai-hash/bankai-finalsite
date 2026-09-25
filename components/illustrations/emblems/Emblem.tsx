import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { EmblemName } from "./names";

/** Индекс каскада микродвижения: задержка += i * шаг (emblems.css). */
const at = (i: number) => ({ "--em-i": i }) as CSSProperties;

/* Глифы эмблем: сетка 32×32, штрих 1.5, currentColor. Прямые штрихи - на .25/.75,
   заливки - на .0/.5: на 2x-экране край ложится ровно в пиксель. Подвижные части -
   классы .em-* (emblems.css). Перекрытия - заливкой fill-surface (цвет плитки). */
const GLYPHS: Partial<Record<EmblemName, () => ReactNode>> = {
  // лупа, внутри - лестница позиций
  seo: () => (
    <g className="em-m em-seo-lens">
      <circle cx="13.75" cy="13.75" r="8.5" />
      <path d="m19.75 19.75 7 7" />
      <path d="M9.25 17.75h2.5v-2.5h2.5v-2.5h2.5v-2.5h1.5" />
    </g>
  ),
  // пакет магазина, внутри - растущая линия
  "seo-store": () => (
    <g className="em-m em-bag">
      <path d="M11.75 11.25c0-6 8.5-6 8.5 0" />
      <path d="M7.75 11.25h17l1.75 12.75a2 2 0 0 1-2 2.25h-17a2 2 0 0 1-2-2.25z" />
      <path d="m10.75 22.25 3.5-3.5 2.5 2 4.5-4.5M18.25 16.25h3v3" />
    </g>
  ),
  // карточка объявления: плашка «Реклама», строки, курсор
  context: () => (
    <>
      <rect x="4.75" y="5.75" width="20.5" height="16.5" rx="2.5" />
      <rect x="8.5" y="9" width="6" height="3" rx="1.5" fill="currentColor" stroke="none" />
      <path d="M9.25 15.75h10.5M9.25 18.75h4.5" />
      <path
        className="em-m em-cursor fill-surface"
        d="m19.75 17.75 7.5 2.75-3.75 1-1 3.75z"
      />
    </>
  ),
  // структура аккаунта: корень и три группы
  "google-ads": () => (
    <>
      <rect x="4.25" y="12.75" width="7" height="7" rx="1.75" />
      <path className="em-m em-branch" style={at(0)} pathLength={1} d="M11.25 16.25h1.5c3 0 3-8 6-8h1" />
      <path className="em-m em-branch" style={at(1)} pathLength={1} d="M11.25 16.25h8.5" />
      <path className="em-m em-branch" style={at(2)} pathLength={1} d="M11.25 16.25h1.5c3 0 3 8 6 8h1" />
      <rect x="19.75" y="5.75" width="7.5" height="5" rx="1.5" />
      <rect x="19.75" y="13.75" width="7.5" height="5" rx="1.5" />
      <rect x="19.75" y="21.75" width="7.5" height="5" rx="1.5" />
    </>
  ),
  // развилка: поиск (линза) и сеть (сетка 2×2)
  "yandex-direct": () => (
    <>
      <path d="M3.75 16.25h4.5c3.5 0 3.5-7 7-7M8.25 16.25c3.5 0 3.5 6.5 7 6.5" />
      <circle cx="21.75" cy="9.25" r="4" />
      <path d="m24.75 12.25 2.25 2.25" />
      <g fill="currentColor" stroke="none">
        <rect className="em-m em-pop" style={at(0)} x="17.5" y="18.5" width="3.5" height="3.5" rx="0.75" />
        <rect className="em-m em-pop" style={at(1)} x="22.5" y="18.5" width="3.5" height="3.5" rx="0.75" />
        <rect className="em-m em-pop" style={at(2)} x="17.5" y="23.5" width="3.5" height="3.5" rx="0.75" />
        <rect className="em-m em-pop" style={at(3)} x="22.5" y="23.5" width="3.5" height="3.5" rx="0.75" />
      </g>
    </>
  ),
  // окно браузера и телефон перед ним
  web: () => (
    <>
      <rect x="3.75" y="5.75" width="20.5" height="16.5" rx="2.5" />
      <path d="M3.75 10.25h20.5M7.25 14.25h8M7.25 17.25h5" />
      <g className="em-m em-phone">
        <rect className="fill-surface" x="18.75" y="12.75" width="9.5" height="15.5" rx="2.25" />
        <path d="M22.25 25.25h2.5" />
      </g>
    </>
  ),
  // длинная страница, кнопка внизу
  landing: () => (
    <>
      <rect x="7.75" y="3.75" width="16.5" height="24.5" rx="2.5" />
      <g className="em-m em-scroll">
        <path d="M11.75 8.75h8.5M11.75 11.75h5" />
        <rect x="11.75" y="14.75" width="8.5" height="4.5" rx="1" />
      </g>
      <rect x="11" y="22.5" width="10" height="3" rx="1.5" fill="currentColor" stroke="none" />
    </>
  ),
  // карта сайта: главная и три раздела
  corporate: () => (
    <>
      <rect x="10.75" y="4.75" width="11" height="6.5" rx="1.5" />
      <path d="M16.25 11.25v8.5M7.75 19.75v-2.5a2 2 0 0 1 2-2h13a2 2 0 0 1 2 2v2.5" />
      <rect className="em-m em-pop" style={at(0)} x="4.75" y="19.75" width="6" height="7.5" rx="1.5" />
      <rect className="em-m em-pop" style={at(1)} x="13.25" y="19.75" width="6" height="7.5" rx="1.5" />
      <rect className="em-m em-pop" style={at(2)} x="21.75" y="19.75" width="6" height="7.5" rx="1.5" />
    </>
  ),
  // корзина и товар над ней (товар под корзиной по порядку отрисовки)
  ecommerce: () => (
    <>
      <rect className="em-m em-item" x="13.25" y="3.75" width="7.5" height="5.5" rx="1.25" />
      <path d="M3.75 7.75h2.6l1.45 5" />
      <path className="fill-surface" d="M7.8 12.75h19.45l-2 8.5H10.25z" />
      <circle cx="12.25" cy="26" r="1.75" />
      <circle cx="23.25" cy="26" r="1.75" />
    </>
  ),
  // три потока сходятся в воронку-сепаратор, ниже - капля сливок (заявка)
  leadgen: () => (
    <>
      <path className="em-m em-pour" d="M10.25 4.75v3M16.25 4.75v3M22.25 4.75v3" />
      <path className="fill-surface" d="M5.25 10.25h22l-8.5 7h-5z" />
      <path
        className="em-m em-drip"
        fill="currentColor"
        stroke="none"
        d="M16.25 19.75c1 1.5 2.75 3.1 2.75 5a2.75 2.75 0 0 1-5.5 0c0-1.9 1.75-3.5 2.75-5z"
      />
    </>
  ),
};

export function hasEmblem(name: EmblemName): boolean {
  return Boolean(GLYPHS[name]);
}

/**
 * Эмблема услуги для списков ссылок: плитка с line-глифом, коралла нет.
 * Микродвижение - по hover/focus родителя с классом group (emblems.css).
 */
export function Emblem({
  name,
  geo = false,
  size = "md",
  className,
}: {
  name: EmblemName;
  /** Значок-пин городской страницы. */
  geo?: boolean;
  size?: "md" | "lg";
  className?: string;
}) {
  const Glyph = GLYPHS[name];
  if (!Glyph) return null;
  return (
    <span
      aria-hidden
      data-emblem={name}
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center rounded-xl border border-border bg-surface text-ink",
        size === "lg" ? "h-14 w-14" : "h-12 w-12",
        className,
      )}
    >
      <svg
        viewBox="0 0 32 32"
        className={size === "lg" ? "h-9 w-9" : "h-8 w-8"}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <Glyph />
      </svg>
      {geo && (
        <span className="em-m em-pin absolute -bottom-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full border border-border bg-bg">
          <svg viewBox="0 0 12 12" className="h-3 w-3" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M6 1.75A3.25 3.25 0 0 0 2.75 5c0 2.25 3.25 5.25 3.25 5.25S9.25 7.25 9.25 5A3.25 3.25 0 0 0 6 1.75Zm0 2a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5Z"
            />
          </svg>
        </span>
      )}
    </span>
  );
}
