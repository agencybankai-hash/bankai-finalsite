import { cn } from "@/lib/utils";

/** Список тезисов с маркером-чертой. Для блоков «проблема» / «для кого». */
export function BulletList({
  items,
  columns = 2,
  className,
}: {
  items: string[];
  columns?: 1 | 2;
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
          <span aria-hidden className="mt-2.5 h-px w-4 shrink-0 bg-muted" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
