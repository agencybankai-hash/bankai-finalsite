import { cn } from "@/lib/utils";
import { InfoTooltip } from "@/components/ui/InfoTooltip";
import { IconBadge } from "@/components/ui/IconBadge";
import type { IconName } from "@/components/ui/Icon";
import { Reveal } from "@/components/motion/Reveal";
import type { Feature } from "@/content/types";
import { gridTail } from "./gridTail";

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
        "grid gap-5 sm:grid-cols-4",
        columns === 3 && "lg:grid-cols-6",
      )}
    >
      {items.map((f, i) => (
        <div
          key={f.title}
          data-reveal
          className={cn(
            "rounded-xl border border-border bg-bg p-6 shadow-card transition duration-300 ease-osmo hover:-translate-y-1 hover:border-ink hover:shadow-card-hover sm:col-span-2",
            gridTail(i, items.length, columns),
          )}
        >
          <div className="flex items-start justify-between gap-2">
            <IconBadge icon={(f.icon as IconName) ?? "check"} className="mb-4" />
            {f.details && <InfoTooltip text={f.details} />}
          </div>
          <h3 className="text-lg font-semibold tracking-tight text-ink">
            {f.title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-ink-2">{f.text}</p>
        </div>
      ))}
    </Reveal>
  );
}
