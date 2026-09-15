"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { captureAttribution } from "@/lib/attribution";

/**
 * Фиксирует источник визита (UTM, рекламные клики, реферер) в localStorage -
 * см. lib/attribution.ts. Ничего не рендерит; живёт в layout рядом с Analytics.
 * Параметры URL читает сам captureAttribution из window.location - без
 * useSearchParams, чтобы не оборачивать layout в Suspense.
 */
export function AttributionTracker() {
  const pathname = usePathname();
  useEffect(() => {
    captureAttribution();
  }, [pathname]);
  return null;
}
