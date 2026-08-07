"use client";

import { useState } from "react";
import { Pill } from "@/components/ui/Pill";
import { CaseGrid } from "./CaseGrid";
import { ui } from "@/content/ui";
import type { CaseStudy, CaseChannel, Locale } from "@/content/types";

/* Значения фильтров - данные (CaseChannel), подписи берём из словаря локали. */
const CHANNELS: CaseChannel[] = ["SEO", "Контекст", "Сайт"];

/** Кейсы с pill-фильтрами по каналу (донор metatag #6) + ссылка «Больше кейсов». */
export function CaseExplorer({
  items,
  allHref,
  locale = "ru",
}: {
  items: CaseStudy[];
  allHref?: string;
  locale?: Locale;
}) {
  const t = ui(locale).cases;
  const [active, setActive] = useState<"all" | CaseChannel>("all");
  const filtered =
    active === "all" ? items : items.filter((c) => c.channels.includes(active));

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center gap-2">
        <Pill onClick={() => setActive("all")} active={active === "all"}>
          {t.allCases}
        </Pill>
        {CHANNELS.map((f) => (
          <Pill key={f} onClick={() => setActive(f)} active={active === f}>
            {t.channels[f]}
          </Pill>
        ))}
        {allHref && (
          <Pill href={allHref} variant="outline" className="ml-auto">
            {t.moreCases}
          </Pill>
        )}
      </div>

      {filtered.length > 0 ? (
        <CaseGrid items={filtered} locale={locale} />
      ) : (
        <p className="text-sm text-muted">{t.empty}</p>
      )}
    </div>
  );
}
