import Link from "next/link";
import { Pill } from "@/components/ui/Pill";
import { IconBadge } from "@/components/ui/IconBadge";
import { Blobs } from "@/components/ui/Blobs";
import { Reveal } from "@/components/motion/Reveal";
import { Disclosure } from "@/components/ui/Disclosure";
import {
  SystemIllustration,
  type SystemVisual,
} from "@/components/sections/SystemIllustration";

type Layer = {
  tag: string;
  role: string;
  text: string;
  plain?: string;
  visual?: SystemVisual;
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
      {/* items-start: открытая карточка растёт одна, соседние не тянутся за ней */}
      <Reveal stagger className="grid items-start gap-5 lg:grid-cols-3">
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
            {l.visual && (
              <div className="mt-6 border-b border-border pb-5">
                <SystemIllustration variant={l.visual} label={l.illustration} />
              </div>
            )}
            <div className="mt-5 text-h3 text-ink">{l.role}</div>
            <p className="mt-2 text-sm leading-relaxed text-ink-2">{l.text}</p>
            {l.plain && (
              <Disclosure
                className="mt-5 rounded-lg bg-surface-2"
                buttonClassName="px-3.5 py-2.5"
                iconClassName="text-lg"
                panelClassName="px-3.5 pb-3.5"
                label={<span className="text-label uppercase text-muted">По-простому</span>}
              >
                <p className="text-sm leading-relaxed text-ink">{l.plain}</p>
              </Disclosure>
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
        <div className="relative">
          <p className="text-base leading-relaxed text-bg/90">{result}</p>
          <Link
            href="/services/leadgen"
            className="mt-3 inline-block text-sm font-medium text-bg underline underline-offset-4"
          >
            Смотреть лидогенерацию под ключ →
          </Link>
        </div>
      </Reveal>
    </div>
  );
}
