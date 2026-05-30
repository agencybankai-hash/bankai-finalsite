import { cn } from "@/lib/utils";

export function Badge({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border border-border bg-surface px-2.5 py-0.5 text-xs font-medium text-ink-2",
        className,
      )}
    >
      {children}
    </span>
  );
}
