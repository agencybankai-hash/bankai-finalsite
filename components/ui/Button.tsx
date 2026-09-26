import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { contacts } from "@/content/site";
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
  onClick,
}: {
  href: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
  /** Например, закрыть мобильное меню перед переходом. */
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      data-cursor
      className={cn(base, variants[variant], sizes[size], className)}
    >
      {children}
    </Link>
  );
}

type Messenger = "whatsapp" | "telegram";

const messengerHref: Record<Messenger, string> = {
  whatsapp: contacts.whatsappUrl,
  telegram: contacts.telegramUrl,
};
/* Фирменная заливка: наведение мышью, фокус с клавиатуры и нажатие -
   на тач-экране hover не срабатывает, отклик даёт active. */
const messengerFill: Record<Messenger, string> = {
  whatsapp:
    "hover:border-whatsapp hover:bg-whatsapp focus-visible:border-whatsapp focus-visible:bg-whatsapp active:border-whatsapp active:bg-whatsapp",
  telegram:
    "hover:border-telegram hover:bg-telegram focus-visible:border-telegram focus-visible:bg-telegram active:border-telegram active:bg-telegram",
};

/**
 * Кнопка мессенджера: в покое нейтральная обводка, при наведении и нажатии
 * заливается фирменным цветом. С label - кнопка с подписью, без - квадратная
 * иконка (тогда нужен ariaLabel). WhatsApp ставить первым: бизнес в KZ пишет туда.
 */
export function MessengerButton({
  messenger,
  label,
  ariaLabel,
  size = "md",
  className,
}: {
  messenger: Messenger;
  label?: string;
  ariaLabel?: string;
  size?: Size;
  className?: string;
}) {
  return (
    <a
      href={messengerHref[messenger]}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      title={label ? undefined : ariaLabel}
      data-cursor
      className={cn(
        "inline-flex shrink-0 items-center justify-center gap-2 rounded-md border border-border font-medium whitespace-nowrap text-ink transition-colors duration-300 ease-osmo hover:text-accent-fg focus-visible:text-accent-fg active:text-accent-fg",
        messengerFill[messenger],
        label ? sizes[size] : size === "lg" ? "h-12 w-12" : "h-10 w-10",
        className,
      )}
    >
      <Icon name={messenger} className={size === "lg" ? "h-5 w-5" : "h-4.5 w-4.5"} />
      {label}
    </a>
  );
}
