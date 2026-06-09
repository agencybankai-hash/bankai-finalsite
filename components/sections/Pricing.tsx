import { pricingPlans, revenueShare, pricingNote } from "@/content/pricing";
import { Button } from "@/components/ui/Button";
import { Pill } from "@/components/ui/Pill";
import { Icon } from "@/components/ui/Icon";
import { Blobs } from "@/components/ui/Blobs";
import { Reveal } from "@/components/motion/Reveal";
import { cn } from "@/lib/utils";

export function Pricing() {
  return (
    <div>
      <Reveal stagger className="grid gap-5 lg:grid-cols-3">
        {pricingPlans.map((p) => (
          <div
            key={p.name}
            data-reveal
            className={cn(
              "flex flex-col rounded-xl border bg-bg p-7 shadow-card transition duration-300 ease-osmo hover:-translate-y-1 hover:shadow-card-hover",
              p.featured ? "border-accent" : "border-border hover:border-ink",
            )}
          >
            {p.featured && (
              <Pill variant="soft" size="sm" className="mb-3 self-start">
                Популярно
              </Pill>
            )}
            <h3 className="text-lg font-semibold tracking-tight text-ink">
              {p.name}
            </h3>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-semibold tracking-tight text-ink">
                {p.price}
              </span>
              <span className="text-sm text-muted">{p.sub}</span>
            </div>
            <div className="text-sm text-ink-2">{p.unit}</div>
            <ul className="mt-6 space-y-2.5">
              {p.includes.map((i) => (
                <li key={i} className="flex gap-2.5 text-sm text-ink-2">
                  <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  <span>{i}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Reveal>

      {/* Revenue share — тёмный блок-вывод (перекличка с system/hero) */}
      <Reveal className="relative mt-5 flex flex-col gap-4 overflow-hidden rounded-2xl bg-ink p-8 text-bg sm:flex-row sm:items-center sm:justify-between">
        <Blobs tone="dark" />
        <div className="relative max-w-2xl">
          <h3 className="text-lg font-semibold tracking-tight">
            {revenueShare.title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-bg/80">
            {revenueShare.text}
          </p>
        </div>
        <Button
          href={revenueShare.cta.href}
          variant="accent"
          className="relative"
        >
          {revenueShare.cta.label}
        </Button>
      </Reveal>

      <p className="mt-4 text-sm text-muted">{pricingNote}</p>
    </div>
  );
}
