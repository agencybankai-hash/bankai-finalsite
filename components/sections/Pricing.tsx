import { pricingPlans, revenueShare, pricingNote } from "@/content/pricing";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";

export function Pricing() {
  return (
    <div>
      <Reveal stagger className="grid gap-5 lg:grid-cols-3">
        {pricingPlans.map((p) => (
          <div
            key={p.name}
            data-reveal
            className="flex flex-col rounded-xl border border-border bg-bg p-7 transition duration-300 ease-osmo hover:border-ink"
          >
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
                  <span aria-hidden className="text-accent">
                    —
                  </span>
                  <span>{i}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Reveal>

      {/* Revenue share — тёмный блок-вывод (перекличка с system/hero) */}
      <Reveal className="mt-5 flex flex-col gap-4 rounded-xl bg-ink p-7 text-bg sm:flex-row sm:items-center sm:justify-between">
        <div className="max-w-2xl">
          <h3 className="text-lg font-semibold tracking-tight">
            {revenueShare.title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-bg/80">
            {revenueShare.text}
          </p>
        </div>
        <Button href={revenueShare.cta.href} variant="accent">
          {revenueShare.cta.label}
        </Button>
      </Reveal>

      <p className="mt-4 text-sm text-muted">{pricingNote}</p>
    </div>
  );
}
