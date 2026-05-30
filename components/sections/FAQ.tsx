import { Reveal } from "@/components/motion/Reveal";
import type { FaqItem } from "@/content/types";

export function FAQ({ items }: { items: FaqItem[] }) {
  return (
    <Reveal stagger className="border-t border-border">
      {items.map((f) => (
        <details key={f.q} data-reveal className="group border-b border-border py-5">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-medium text-ink [&::-webkit-details-marker]:hidden">
            <span>{f.q}</span>
            <span
              aria-hidden
              className="shrink-0 text-xl text-muted transition-transform duration-300 ease-osmo group-open:rotate-45"
            >
              +
            </span>
          </summary>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-2">
            {f.a}
          </p>
        </details>
      ))}
    </Reveal>
  );
}
