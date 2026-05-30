import { cn } from "@/lib/utils";
import { CountUp } from "@/components/motion/CountUp";

export function Stat({
  value,
  label,
  className,
  /** Анимировать число count-up'ом при входе в вьюпорт. */
  animate = false,
}: {
  value: string;
  label: string;
  className?: string;
  animate?: boolean;
}) {
  return (
    <div className={cn("", className)}>
      <div className="text-h2 text-ink">
        {animate ? <CountUp value={value} /> : value}
      </div>
      <div className="mt-1 text-sm text-ink-2">{label}</div>
    </div>
  );
}
