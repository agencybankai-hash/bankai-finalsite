import { Pill } from "@/components/ui/Pill";
import { IconBadge } from "@/components/ui/IconBadge";
import { Blobs } from "@/components/ui/Blobs";
import { Reveal } from "@/components/motion/Reveal";

type Layer = {
  tag: string;
  role: string;
  text: string;
  plain?: string;
  illustration?: string;
};

export function SystemSection({
  layers,
  result,
}: {
  layers: Layer[];
  result: string;
}) {
  return (
    <div>
      <Reveal stagger className="grid gap-5 lg:grid-cols-3">
        {layers.map((l, i) => (
          <div
            key={l.tag}
            data-reveal
            className="flex flex-col rounded-xl border border-border bg-bg p-7 shadow-card"
          >
            <div className="flex items-start justify-between">
              <IconBadge size="md">{String(i + 1).padStart(2, "0")}</IconBadge>
              <Pill variant="outline" size="sm">
                {l.tag}
              </Pill>
            </div>
            <div className="mt-6 text-h3 text-ink">{l.role}</div>
            <p className="mt-2 text-sm leading-relaxed text-ink-2">{l.text}</p>
            {l.plain && (
              <details className="group mt-auto rounded-lg border-l-2 border-ink bg-surface-2 pt-4 [&[open]]:pt-0">
                <summary className="flex cursor-pointer list-none items-center justify-between px-3 py-2.5 [&::-webkit-details-marker]:hidden">
                  <span className="text-label uppercase text-muted">
                    По-простому
                  </span>
                  <span
                    aria-hidden
                    className="text-lg leading-none text-muted transition-transform group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="px-3 pb-3 text-sm leading-relaxed text-ink">
                  {l.plain}
                </p>
              </details>
            )}
          </div>
        ))}
      </Reveal>

      {/* Итог — тёмный акцентный вывод (перекличка с hero-панелью) */}
      <Reveal className="relative mt-5 flex flex-col gap-3 overflow-hidden rounded-2xl bg-ink p-8 text-bg sm:flex-row sm:items-center sm:gap-6">
        <Blobs tone="dark" />
        <span className="relative shrink-0 text-label uppercase text-accent">
          Одна система
        </span>
        <p className="relative text-base leading-relaxed text-bg/90">{result}</p>
      </Reveal>
    </div>
  );
}
