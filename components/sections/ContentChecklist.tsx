"use client";

import { useCallback, useEffect, useState } from "react";
import {
  checklist,
  statusMeta,
  macroNote,
  approvers,
  type ApproverKey,
} from "@/content/checklist";
import { cn } from "@/lib/utils";

type Approval = { artur: boolean; daniyar: boolean; petr: boolean };
type ApprovalMap = Record<string, Approval>;

const EMPTY: Approval = { artur: false, daniyar: false, petr: false };
const isDone = (a?: Approval) => !!a && a.artur && a.daniyar && a.petr;

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
  const [approvals, setApprovals] = useState<ApprovalMap>({});

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/checklist", { cache: "no-store" });
      const data = await res.json();
      if (data?.ok) setApprovals(data.approvals ?? {});
    } catch {
      /* офлайн — оставляем что есть */
    }
  }, []);

  useEffect(() => {
    load();
    const onFocus = () => load();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [load]);

  const toggle = (id: string, key: ApproverKey) => {
    const current = approvals[id] ?? EMPTY;
    const value = !current[key];
    // оптимистично
    setApprovals((prev) => ({
      ...prev,
      [id]: { ...(prev[id] ?? EMPTY), [key]: value },
    }));
    fetch("/api/checklist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemId: id, approver: key, value }),
    })
      .then((r) => {
        if (!r.ok) load();
      })
      .catch(() => load());
  };

  const allItems = checklist.flatMap((p) => p.items);
  const doneTotal = allItems.filter((i) => isDone(approvals[i.id])).length;

  return (
    <div>
      {/* Общий прогресс + легенда */}
      <div className="flex flex-col gap-4 rounded-xl border border-border bg-bg p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-label uppercase text-muted">
              Общий прогресс · зачёркнуто при 3 апрувах
            </div>
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
        <div className="border-t border-border pt-3 text-xs text-muted">
          Апрув ставит каждый сам: {approvers.map((a) => a.label).join(" · ")}.
          Состояние общее — отметки и зачёркивание видят все.
        </div>
      </div>

      {checklist.map((page) => {
        const pageDone = page.items.filter((i) => isDone(approvals[i.id])).length;
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
                const a = approvals[item.id] ?? EMPTY;
                const done = isDone(a);
                return (
                  <li
                    key={item.id}
                    className="flex flex-wrap items-start gap-x-4 gap-y-2 border-b border-border py-3"
                  >
                    <div className="min-w-0 flex-1">
                      <div
                        className={cn(
                          "text-sm text-ink",
                          done && "text-muted line-through",
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

                    {/* 3 именованных апрува */}
                    <div className="flex shrink-0 items-center gap-2.5">
                      {approvers.map((ap) => (
                        <label
                          key={ap.key}
                          title={ap.label}
                          className="flex cursor-pointer items-center gap-1 text-xs text-muted select-none"
                        >
                          {ap.label[0]}
                          <input
                            type="checkbox"
                            checked={a[ap.key]}
                            onChange={() => toggle(item.id, ap.key)}
                            className="h-4 w-4 cursor-pointer accent-[var(--color-accent)]"
                            aria-label={`${ap.label} — ${item.label}`}
                          />
                        </label>
                      ))}
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
