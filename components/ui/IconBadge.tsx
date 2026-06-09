import { cn } from "@/lib/utils";
import { Icon, type IconName } from "./Icon";

/**
 * Круглый бейдж под иконку/номер (донор metatag — пастельный кружок
 * над заголовком карточки). Мягкий тон акцента, коралл-иконка.
 */
const sizes = { sm: "h-9 w-9", md: "h-11 w-11", lg: "h-14 w-14" };
const iconSizes = { sm: "h-4 w-4", md: "h-5 w-5", lg: "h-6 w-6" };

export function IconBadge({
  icon,
  children,
  size = "md",
  className,
}: {
  icon?: IconName;
  /** Номер или символ, если иконка не задана. */
  children?: React.ReactNode;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent",
        sizes[size],
        className,
      )}
    >
      {icon ? (
        <Icon name={icon} className={iconSizes[size]} />
      ) : (
        <span className="text-sm font-semibold">{children}</span>
      )}
    </span>
  );
}
