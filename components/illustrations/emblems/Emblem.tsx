import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { EmblemName } from "./names";

/** Глифы эмблем: сетка 32×32, штрих 1.5, currentColor. Пусто - эмблемы ещё нет. */
const GLYPHS: Partial<Record<EmblemName, () => ReactNode>> = {};

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
      {geo && null}
    </span>
  );
}
