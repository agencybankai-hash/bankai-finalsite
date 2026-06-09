import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Pill (донор metatag): eyebrow-ярлык, фильтры кейсов, channel-теги.
 * Рендерится как <Link> (href), <button> (onClick) или <span>.
 * active → мягкая коралл-заливка (как активный фильтр у донора).
 */
type Variant = "solid" | "soft" | "outline";
type Size = "sm" | "md";

const base =
  "inline-flex items-center gap-1.5 rounded-full font-medium whitespace-nowrap transition duration-300 ease-osmo";
const variants: Record<Variant, string> = {
  solid: "bg-ink text-bg",
  soft: "bg-accent-soft text-accent",
  outline: "border border-border bg-bg text-ink-2 hover:border-ink hover:text-ink",
};
const sizes: Record<Size, string> = {
  sm: "h-7 px-3 text-xs",
  md: "h-9 px-4 text-sm",
};

export function Pill({
  href,
  onClick,
  active,
  variant = "outline",
  size = "md",
  className,
  children,
}: {
  href?: string;
  onClick?: () => void;
  active?: boolean;
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
}) {
  const cls = cn(base, sizes[size], active ? variants.soft : variants[variant], className);
  if (href) {
    return (
      <Link href={href} data-cursor className={cls}>
        {children}
      </Link>
    );
  }
  if (onClick) {
    return (
      <button type="button" onClick={onClick} aria-pressed={active} className={cls}>
        {children}
      </button>
    );
  }
  return <span className={cls}>{children}</span>;
}
