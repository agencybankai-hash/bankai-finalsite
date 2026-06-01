"use client";

import { useEffect, useState } from "react";
import { checklist, statusMeta, macroNote } from "@/content/checklist";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "bankai_checklist_v1";

const chipTone: Record<string, string> = {
  done: "bg-surface-2 text-ink-2",
  accent: "bg-accent/10 text-accent",
  media: "border border-border text-ink-2",
  legal: "border border-border text-muted",
  add: "border border-dashed border-border text-muted",
};

function Bar({ done, total }: { done: number; total: number }) {
  const pct = total ? Math.round((done / total) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <div className="h-1.5 w-28 overflow-hidden rounded-full bg-surface-2">
        <div
          className="h-full rounded-full bg-accent transition-[width] duration-500 ease-osmo"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs tabular-nums text-muted">
        {done}/{total}
      </span>
    </div>
  );
}

export function ContentChecklist() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setChecked(JSON.parse(raw));
    } catch {
      /* приватный режим — игнор */
    }
  }, []);

  const toggle = (id: string) =>
    setChecked((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        /* игнор */
      }
      return next;
    });

  const allItems = checklist.flatMap((p) => p.items);
  const doneTotal = allItems.filter((i) => checked[i.id]).length;

  return (
    <div>
      {/* Общий прогресс + легенда */}
      <div className="flex flex-col gap-4 rounded-xl border border-border bg-bg p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-label uppercase text-muted">Общий прогресс</div>
          <div className="mt-2">
            <Bar done={doneTotal} total={allItems.length} />
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {Object.values(statusMeta).map((s) => (
            <span
              key={s.label}
              className={cn(
                "inline-flex items-center rounded-md px-2 py-0.5 text-xs",
                chipTone[s.tone],
              )}
            >
              {s.label}
            </span>
          ))}
        </div>
      </div>

      {checklist.map((page) => {
        const pageDone = page.items.filter((i) => checked[i.id]).length;
        return (
          <section key={page.route} className="mt-12">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-ink pb-3">
              <div>
                <h2 className="text-h3 text-ink">{page.title}</h2>
                <div className="mt-0.5 font-mono text-xs text-muted">
                  {page.route}
                </div>
              </div>
              <Bar done={pageDone} total={page.items.length} />
            </div>

            <ul>
              {page.items.map((item) => {
                const sm = statusMeta[item.status];
                const on = !!checked[item.id];
                return (
                  <li
                    key={item.id}
                    className="flex items-start gap-3 border-b border-border py-3"
                  >
                    <input
                      type="checkbox"
                      checked={on}
                      onChange={() => toggle(item.id)}
                      className="mt-1 h-4 w-4 shrink-0 cursor-pointer accent-[var(--color-accent)]"
                      aria-label={item.label}
                    />
                    <div className="min-w-0 flex-1">
                      <div
                        className={cn(
                          "text-sm text-ink",
                          on && "text-muted line-through",
                        )}
                      >
                        {item.label}
                      </div>
                      {item.todo && (
                        <div className="mt-0.5 text-xs leading-snug text-ink-2">
                          {item.todo}
                        </div>
                      )}
                      {item.source && (
                        <div className="mt-0.5 font-mono text-[11px] text-muted">
                          {item.source}
                        </div>
                      )}
                    </div>
                    <span
                      className={cn(
                        "mt-0.5 inline-flex shrink-0 items-center rounded-md px-2 py-0.5 text-xs",
                        chipTone[sm.tone],
                      )}
                    >
                      {sm.label}
                    </span>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}

      <p className="mt-12 rounded-xl border-l-2 border-ink bg-surface p-5 text-sm leading-relaxed text-ink-2">
        {macroNote}
      </p>
    </div>
  );
}
