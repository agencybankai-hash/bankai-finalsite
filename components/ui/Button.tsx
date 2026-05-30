import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "accent" | "secondary" | "ghost";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-md font-medium whitespace-nowrap transition duration-300 ease-osmo";
const variants: Record<Variant, string> = {
  primary: "bg-ink text-bg hover:bg-ink-2",
  accent: "bg-accent text-accent-fg hover:opacity-90",
  secondary: "bg-bg text-ink border border-border hover:bg-surface",
  ghost: "bg-transparent text-ink hover:bg-surface",
};
const sizes: Record<Size, string> = {
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-base",
};

export function Button({
  href,
  variant = "primary",
  size = "md",
  className,
  children,
}: {
  href: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      data-cursor
      className={cn(base, variants[variant], sizes[size], className)}
    >
      {children}
    </Link>
  );
}
