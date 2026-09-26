import { cn, nbspValue } from "@/lib/utils";
import { CountUp } from "@/components/motion/CountUp";

export function Stat({
  value,
  label,
  className,
  /** Анимировать число count-up'ом при входе в вьюпорт. */
  animate = false,
  /** Узкая колонка (сетка метрик кейса, на 320 - 128px): число длиннее
      7 знаков и слова - ступенью меньше, уже 360px - кеглем text-xl, иначе
      «завершению» шире колонки. Слова переносятся по пробелам, без склейки
      коротких слов: склеенное «В продакшене» тоже шире колонки. */
  fit = false,
}: {
  value: string;
  label: string;
  className?: string;
  animate?: boolean;
  fit?: boolean;
}) {
  const words = !/\d/.test(value);
  const small = fit && (words || value.length > 7);
  const v = small && words ? value : nbspValue(value);
  return (
    <div className={cn("", className)}>
      <div
        className={cn(
          "text-h2 text-ink",
          small &&
            "text-h3 text-balance break-words max-[360px]:[--text-h3:var(--text-xl)]",
        )}
      >
        {animate ? <CountUp value={v} /> : v}
      </div>
      <div className="mt-1 text-sm text-ink-2">{label}</div>
    </div>
  );
}
