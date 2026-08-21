"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ui } from "@/content/ui";
import type { Locale } from "@/content/types";

const fieldBase =
  "w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 text-sm text-ink placeholder:text-muted aria-invalid:border-accent focus-visible:border-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg";
const labelBase = "mb-1.5 block text-sm font-medium text-ink";
const errorBase = "mt-1.5 text-xs font-medium text-accent";

type AnalyticsWindow = Window & {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
};

// Событие заявки в GTM и GA4. Если аналитика не подключена - молча выходим.
function trackLead(service: string, source: string) {
  if (typeof window === "undefined") return;
  const w = window as AnalyticsWindow;
  try {
    w.dataLayer?.push({ event: "generate_lead", service, source });
    w.gtag?.("event", "generate_lead", { service, source });
  } catch {}
}

export function ContactForm({ locale = "ru" }: { locale?: Locale }) {
  const t = ui(locale).form;
  const pathname = usePathname();
  const [status, setStatus] = useState<"idle" | "error" | "success">("idle");
  const [errors, setErrors] = useState<{ name?: boolean; contact?: boolean }>({});
  const [pending, setPending] = useState(false);
  const [sendErr, setSendErr] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    if (String(data.get("company") ?? "")) return; // honeypot
    const name = String(data.get("name") ?? "").trim();
    const contact = String(data.get("contact") ?? "").trim();
    const next = { name: !name, contact: !contact };
    setErrors(next);
    setSendErr(false);
    if (next.name || next.contact) {
      setStatus("error");
      return;
    }
    setPending(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service: data.get("service"),
          name,
          contact,
          niche: data.get("niche"),
          revenue: data.get("revenue"),
          comment: data.get("comment"),
        }),
      });
      if (!res.ok) throw new Error(`status ${res.status}`);
      setStatus("success");
      trackLead(String(data.get("service") ?? ""), pathname);
    } catch {
      setSendErr(true);
    } finally {
      setPending(false);
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-xl border border-ink bg-surface p-8 text-center">
        <h3 className="text-lg font-semibold text-ink">{t.successTitle}</h3>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-ink-2">
          {t.successText}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      {/* honeypot - скрыто от людей, ловит ботов */}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="hidden"
      />
      <div>
        <label htmlFor="service" className={labelBase}>
          {t.serviceLabel}
        </label>
        <select
          id="service"
          name="service"
          className={fieldBase}
          defaultValue={t.services[0]}
        >
          {t.services.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className={labelBase}>
            {t.nameLabel} <span className="text-muted">*</span>
          </label>
          <input
            id="name"
            name="name"
            className={fieldBase}
            placeholder={t.namePlaceholder}
            aria-invalid={errors.name || undefined}
          />
          {errors.name && (
            <p role="alert" className={errorBase}>
              {t.nameError}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="contact" className={labelBase}>
            {t.contactLabel} <span className="text-muted">*</span>
          </label>
          <input
            id="contact"
            name="contact"
            className={fieldBase}
            placeholder={t.contactPlaceholder}
            aria-invalid={errors.contact || undefined}
          />
          {errors.contact && (
            <p role="alert" className={errorBase}>
              {t.contactError}
            </p>
          )}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="niche" className={labelBase}>
            {t.nicheLabel} <span className="text-muted">{t.optional}</span>
          </label>
          <input
            id="niche"
            name="niche"
            className={fieldBase}
            placeholder={t.nichePlaceholder}
          />
        </div>
        <div>
          <label htmlFor="revenue" className={labelBase}>
            {t.revenueLabel} <span className="text-muted">{t.optional}</span>
          </label>
          <input
            id="revenue"
            name="revenue"
            className={fieldBase}
            placeholder={t.revenuePlaceholder}
          />
        </div>
      </div>

      <div>
        <label htmlFor="comment" className={labelBase}>
          {t.commentLabel} <span className="text-muted">{t.optional}</span>
        </label>
        <textarea
          id="comment"
          name="comment"
          rows={4}
          className={fieldBase}
          placeholder={t.commentPlaceholder}
        />
      </div>

      {status === "error" && (
        <p role="alert" className="text-sm font-medium text-accent">
          {t.formError}
        </p>
      )}
      {sendErr && (
        <p role="alert" className="text-sm font-medium text-accent">
          {t.sendError}
        </p>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex h-12 items-center justify-center rounded-lg bg-ink px-6 text-base font-medium text-bg hover:bg-ink-2 disabled:opacity-60"
        >
          {pending ? t.submitting : t.submit}
        </button>
        <p className="text-xs text-muted">
          {t.consent}{" "}
          <Link
            href={t.privacyHref}
            className="underline underline-offset-2 hover:text-ink-2"
          >
            {t.consentLink}
          </Link>
          {t.consentAfter}
        </p>
      </div>
    </form>
  );
}
