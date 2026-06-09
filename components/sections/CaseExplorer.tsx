"use client";

import { useState } from "react";
import { Pill } from "@/components/ui/Pill";
import { CaseGrid } from "./CaseGrid";
import type { CaseStudy, CaseChannel } from "@/content/types";

const FILTERS: ("Все" | CaseChannel)[] = ["Все", "SEO", "Контекст", "Сайт"];

/** Кейсы с pill-фильтрами по каналу (донор metatag #6) + ссылка «Больше кейсов». */
export function CaseExplorer({
  items,
  allHref,
}: {
  items: CaseStudy[];
  allHref?: string;
}) {
  const [active, setActive] = useState<"Все" | CaseChannel>("Все");
  const filtered =
    active === "Все" ? items : items.filter((c) => c.channels.includes(active));

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center gap-2">
        {FILTERS.map((f) => (
          <Pill key={f} onClick={() => setActive(f)} active={active === f}>
            {f === "Все" ? "Все кейсы" : f}
          </Pill>
        ))}
        {allHref && (
          <Pill href={allHref} variant="outline" className="ml-auto">
            Больше кейсов →
          </Pill>
        )}
      </div>

      {filtered.length > 0 ? (
        <CaseGrid items={filtered} />
      ) : (
        <p className="text-sm text-muted">По этому каналу кейсов пока нет.</p>
      )}
    </div>
  );
}
