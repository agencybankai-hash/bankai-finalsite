import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/Icon";

/** Список тезисов. Для блоков «проблема» / «для кого».
 *  variant: "dash" — маркер-черта (Osmo), "check" — коралл-галка (донор metatag). */
export function BulletList({
  items,
  columns = 2,
  variant = "dash",
  className,
}: {
  items: string[];
  columns?: 1 | 2;
  variant?: "dash" | "check";
  className?: string;
}) {
  return (
    <ul
      className={cn(
        "grid gap-x-8 gap-y-4",
        columns === 2 && "sm:grid-cols-2",
        className,
      )}
    >
      {items.map((item) => (
        <li key={item} className="flex gap-3 text-base text-ink-2">
          {variant === "check" ? (
            <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
          ) : (
            <span aria-hidden className="mt-2.5 h-px w-4 shrink-0 bg-muted" />
          )}
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
