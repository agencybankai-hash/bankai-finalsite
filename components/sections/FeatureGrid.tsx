import { cn } from "@/lib/utils";
import { InfoTooltip } from "@/components/ui/InfoTooltip";
import { Reveal } from "@/components/motion/Reveal";
import type { Feature } from "@/content/types";

export function FeatureGrid({
  items,
  columns = 3,
}: {
  items: Feature[];
  columns?: 2 | 3;
}) {
  return (
    <Reveal
      stagger
      className={cn(
        "grid gap-5 sm:grid-cols-2",
        columns === 3 && "lg:grid-cols-3",
      )}
    >
      {items.map((f) => (
        <div
          key={f.title}
          data-reveal
          className="rounded-xl border border-border bg-bg p-6 transition duration-300 ease-osmo hover:border-ink"
        >
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-lg font-semibold tracking-tight text-ink">
              {f.title}
            </h3>
            {f.details && <InfoTooltip text={f.details} />}
          </div>
          <p className="mt-2 text-sm leading-relaxed text-ink-2">{f.text}</p>
        </div>
      ))}
    </Reveal>
  );
}
