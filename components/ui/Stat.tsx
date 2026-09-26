import { cn, nbspValue } from "@/lib/utils";
import { CountUp } from "@/components/motion/CountUp";

export function Stat({
  value,
  label,
  className,
  /** Анимировать число count-up'ом при входе в вьюпорт. */
  animate = false,
  /** Узкая колонка (сетка метрик кейса: 128px на 320, 130px на 640): число
      длиннее 7 знаков и слова - ступенью меньше, в колонке уже 9rem - кеглем
      text-xl, иначе «завершению» шире колонки. Слова переносятся по
      пробелам, без склейки коротких слов: склеенное «В продакшене» тоже
      шире колонки. */
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
    <div className={cn(fit && "@container", className)}>
      <div
        className={cn(
          // Без fit цифра стоит в плитке 2×2 (TrustBar, /about): text-stat
          // на телефоне мельче h2, иначе «до -40%» шире плитки
          fit ? "text-h2" : "text-stat",
          "text-ink",
          small &&
            "text-h3 text-balance break-words @max-[9rem]:[--text-h3:var(--text-xl)]",
        )}
      >
        {animate ? <CountUp value={v} /> : v}
      </div>
      <div className="mt-1 text-sm text-ink-2">{label}</div>
    </div>
  );
}
