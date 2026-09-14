"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

/**
 * Кнопка удаления лида в админке: подтверждение, DELETE /api/admin/leads/:id,
 * затем обновление серверной таблицы через router.refresh().
 */
export function DeleteLeadButton({ id, label }: { id: string; label: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);

  async function onClick() {
    if (!window.confirm(`Удалить заявку «${label}»? Это действие нельзя отменить.`)) return;
    setBusy(true);
    setError(false);
    try {
      const res = await fetch(`/api/admin/leads/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(`status ${res.status}`);
      startTransition(() => router.refresh());
    } catch {
      setError(true);
    } finally {
      setBusy(false);
    }
  }

  const disabled = busy || pending;
  return (
    <span className="inline-flex flex-col items-start gap-1">
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className="inline-flex h-8 items-center justify-center rounded-lg border border-border bg-bg px-3 text-xs font-medium text-ink hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-50"
      >
        {disabled ? "Удаляем…" : "Удалить"}
      </button>
      {error && (
        <span role="alert" className="text-xs text-accent">
          Не удалось удалить
        </span>
      )}
    </span>
  );
}
