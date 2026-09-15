"use client";
import { useEffect } from "react";
import { captureAttribution } from "@/lib/attribution";

// Сохраняет источник первого захода в sessionStorage - форма отправит его вместе с лидом.
export function AttributionCapture() {
  useEffect(() => { captureAttribution(); }, []);
  return null;
}
