import { cn } from "@/lib/utils";

export function Card({
  className,
  shadow,
  hover,
  children,
}: {
  className?: string;
  /** мягкая тень (донор metatag) */
  shadow?: boolean;
  /** hover-lift + усиление тени */
  hover?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-bg p-6",
        shadow && "shadow-card",
        hover &&
          "transition duration-300 ease-osmo hover:-translate-y-1 hover:border-ink hover:shadow-card-hover",
        className,
      )}
    >
      {children}
    </div>
  );
}
