import { cn, nbsp } from "@/lib/utils";
import { Container } from "./Container";

type Tone = "default" | "surface" | "ink";

export function Section({
  id,
  tone = "default",
  className,
  leading,
  children,
}: {
  id?: string;
  tone?: Tone;
  className?: string;
  /** если true — рендерит детей без внутреннего Container (управляешь сам) */
  leading?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className={cn(
        "py-[var(--section-y)]",
        tone === "surface" && "bg-surface border-y border-border",
        // tone-ink инвертирует нейтрали локально → text-ink/border-border внутри светлеют
        tone === "ink" && "tone-ink border-y border-border",
        className,
      )}
    >
      {leading ? children : <Container>{children}</Container>}
    </section>
  );
}

/** Заголовок секции: eyebrow-ярлык + H2 + лид. */
export function SectionHeader({
  eyebrow,
  title,
  lead,
  align = "left",
  className,
}: {
  /** Моно-ярлык над заголовком (донор Osmo): «УСЛУГИ», «ПРОЦЕСС». */
  eyebrow?: string;
  title: string;
  lead?: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow && (
        <p className="mb-3 text-label uppercase text-muted">{eyebrow}</p>
      )}
      <h2 className="text-h2 text-ink">{nbsp(title)}</h2>
      {lead && <p className="mt-4 text-lead text-ink-2">{nbsp(lead)}</p>}
    </div>
  );
}
