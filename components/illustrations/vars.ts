import type { CSSProperties } from "react";

type AnimVars = {
  /** Задержка, с. */
  delay?: number;
  /** Длительность, с. */
  dur?: number;
  /** Индекс в каскаде: задержка += i * step. */
  i?: number;
  /** Шаг каскада, с. */
  step?: number;
  /** Повторы (петли - не больше 3). */
  iter?: number;
};

/** Инлайн-переменные анимационных примитивов (.a-*) из illustrations.css. */
export function anim(
  { delay, dur, i, step, iter }: AnimVars,
  extra?: Record<`--${string}`, string | number>,
): CSSProperties {
  const s: Record<string, string | number> = { ...extra };
  if (delay !== undefined) s["--a-delay"] = `${delay}s`;
  if (dur !== undefined) s["--a-dur"] = `${dur}s`;
  if (i !== undefined) s["--i"] = i;
  if (step !== undefined) s["--a-step"] = `${step}s`;
  if (iter !== undefined) s["--a-iter"] = iter;
  return s as CSSProperties;
}
