import { Reveal } from "@/components/motion/Reveal";
import { Disclosure } from "@/components/ui/Disclosure";
import type { FaqItem } from "@/content/types";

export function FAQ({ items }: { items: FaqItem[] }) {
  return (
    <Reveal stagger className="space-y-3">
      {items.map((f) => (
        <div key={f.q} data-reveal>
          <Disclosure
            className="rounded-xl border border-border bg-bg px-5 transition duration-300 ease-osmo hover:border-ink data-[open=true]:shadow-card"
            buttonClassName="py-4 text-base font-medium text-ink"
            iconClassName="text-xl"
            panelClassName="pb-5"
            label={<span>{f.q}</span>}
          >
            <p className="max-w-2xl text-sm leading-relaxed text-ink-2">{f.a}</p>
          </Disclosure>
        </div>
      ))}
    </Reveal>
  );
}
