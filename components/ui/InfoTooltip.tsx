/**
 * Иконка «i» с всплывающей подсказкой.
 * Только CSS: открывается по наведению (desktop) и по фокусу/тапу (mobile).
 */
export function InfoTooltip({ text }: { text: string }) {
  return (
    <span className="group relative inline-flex shrink-0">
      <button
        type="button"
        aria-label="Подробнее"
        className="flex h-5 w-5 items-center justify-center rounded-full border border-border text-xs text-muted hover:border-ink hover:text-ink focus:border-ink focus:text-ink focus:outline-none"
      >
        i
      </button>
      <span
        role="tooltip"
        className="pointer-events-none invisible absolute bottom-full right-0 z-20 mb-2 w-80 whitespace-pre-line rounded-lg border border-border bg-bg p-3.5 text-left text-xs leading-relaxed text-ink-2 opacity-0 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100"
      >
        {text}
      </span>
    </span>
  );
}
