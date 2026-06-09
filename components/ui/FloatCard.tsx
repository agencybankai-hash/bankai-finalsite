import { cn } from "@/lib/utils";
import { IconBadge } from "./IconBadge";
import type { IconName } from "./Icon";

/**
 * Floating-карточка метрики (донор metatag — стеклянные карточки с
 * показателем поверх визуала). Лёгкий float (.float-soft), задержку
 * варьируем через style.animationDelay.
 */
export function FloatCard({
  label,
  value,
  delta,
  icon,
  float,
  className,
  style,
}: {
  label: string;
  value: string;
  /** дельта, напр. "↑ 4.7K" — рендерится коралловым */
  delta?: string;
  icon?: IconName;
  float?: boolean;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={style}
      className={cn(
        "rounded-xl border border-border bg-bg p-4 shadow-float",
        float && "float-soft",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-4">
        <span className="text-xs text-muted">{label}</span>
        {icon && <IconBadge icon={icon} size="sm" />}
      </div>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-2xl font-semibold tracking-tight text-ink">{value}</span>
        {delta && <span className="text-sm font-medium text-accent">{delta}</span>}
      </div>
    </div>
  );
}
