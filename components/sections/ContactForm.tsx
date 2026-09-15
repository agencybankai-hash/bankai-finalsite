"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Turnstile } from "@/components/Turnstile";
import { ui } from "@/content/ui";
import { normalizeContact } from "@/lib/contact";
import { getAttribution, type Attribution } from "@/lib/attribution";
import { PhoneFlag } from "@/components/PhoneFlag";
import {
  EMPTY_PHONE,
  detectPhoneCountry,
  formatPhoneInput,
  normalizePhone,
  phonePlaceholder,
  type CountryCode,
} from "@/lib/phone";
import type { Locale } from "@/content/types";

const fieldBase =
  "w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 text-sm text-ink placeholder:text-muted aria-invalid:border-accent focus-visible:border-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg";
const labelBase = "mb-1.5 block text-sm font-medium text-ink";
const errorBase = "mt-1.5 text-xs font-medium text-accent";
// Turnstile включён, если задан публичный сайт-ключ (секрет проверяет сервер).
const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

type AnalyticsWindow = Window & {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
};

// Событие заявки в GTM и GA4 вместе с атрибуцией источника (lib/attribution).
// Если аналитика не подключена - молча выходим.
function trackLead(service: string, formPage: string, attribution: Attribution) {
  if (typeof window === "undefined") return;
  const w = window as AnalyticsWindow;
  const params = { service, form_page: formPage, ...attribution };
  try {
    w.dataLayer?.push({ event: "generate_lead", ...params });
    w.gtag?.("event", "generate_lead", params);
  } catch {}
}

/** Галочка валидного поля: показывается сразу, как только значение стало правильным. */
function ValidMark() {
  return (
    <span className="pointer-events-none absolute inset-y-0 right-3.5 flex items-center text-success">
      <svg viewBox="0 0 20 20" width={18} height={18} aria-hidden fill="none" stroke="currentColor" strokeWidth={2}>
        <circle cx="10" cy="10" r="8" />
        <path d="M6.5 10.5l2.3 2.3L13.5 8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

export function ContactForm({
  locale = "ru",
  defaultCountry = "KZ",
}: {
  locale?: Locale;
  /** Стартовая страна телефона, обычно по IP посетителя (lib/geo.ts). */
  defaultCountry?: CountryCode;
}) {
  const t = ui(locale).form;
  const pathname = usePathname();
  const [status, setStatus] = useState<"idle" | "error" | "success">("idle");
  const [errors, setErrors] = useState<{ name?: boolean; phone?: boolean; contact?: boolean }>(
    {},
  );
  // Живая валидация: поле проверяется при уходе из него и при каждом
  // изменении после первого касания, ошибка исчезает сразу после исправления.
  const [touched, setTouched] = useState<{ name?: boolean; phone?: boolean; contact?: boolean }>(
    {},
  );
  // Телефон контролируемый: маска форматирует значение при каждом вводе,
  // `auto` помнит, что «+код» подставлен автоматически (см. lib/phone.ts).
  const [phoneState, setPhoneState] = useState(EMPTY_PHONE);
  const phone = phoneState.value;

  // Зелёная галочка у имени и контакта появляется сразу при валидном значении.
  const [valid, setValid] = useState<{ name?: boolean; contact?: boolean }>({});

  const validators = {
    name: (v: string) => v.trim().length > 0,
    phone: (v: string) => normalizePhone(v, defaultCountry) !== null,
    contact: (v: string) => normalizeContact(v) !== null,
  };
  type Field = keyof typeof validators;
  const check = (field: Field, value: string) =>
    setErrors((prev) => ({ ...prev, [field]: !validators[field](value) }));
  const markValid = (field: "name" | "contact", value: string) =>
    setValid((prev) => ({ ...prev, [field]: validators[field](value) }));
  const onBlurField = (field: Field, value: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    check(field, value);
  };
  const onChangeField = (field: Field, value: string) => {
    if (touched[field] || errors[field]) check(field, value);
  };
  const [pending, setPending] = useState(false);
  const [sendErr, setSendErr] = useState(false);
  const [captchaErr, setCaptchaErr] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    if (String(data.get("company") ?? "")) return; // honeypot
    const name = String(data.get("name") ?? "").trim();
    const phoneE164 = normalizePhone(phone, defaultCountry);
    const contact = normalizeContact(String(data.get("contact") ?? ""));
    const next = { name: !name, phone: !phoneE164, contact: !contact };
    setTouched({ name: true, phone: true, contact: true });
    setErrors(next);
    setSendErr(false);
    setCaptchaErr(false);
    if (next.name || next.phone || next.contact) {
      setStatus("error");
      return;
    }
    // Токен Turnstile кладёт сам виджет скрытым полем внутри формы.
    const turnstileToken = String(data.get("cf-turnstile-response") ?? "");
    if (TURNSTILE_SITE_KEY && !turnstileToken) {
      setCaptchaErr(true);
      return;
    }
    setPending(true);
    // Откуда пришёл человек - уходит в заявку (БД/Telegram/почта) и в GA4.
    const attribution = getAttribution();
    const lead = {
      service: String(data.get("service") ?? ""),
      name,
      phone: phoneE164,
      contact: contact?.value,
      niche: String(data.get("niche") ?? ""),
      revenue: String(data.get("revenue") ?? ""),
      comment: String(data.get("comment") ?? ""),
      page: pathname,
      locale,
      attribution,
    };
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...lead, turnstileToken }),
      });
      if (res.status === 403) {
        setCaptchaErr(true);
        return;
      }
      if (!res.ok) throw new Error(`status ${res.status}`);
      setStatus("success");
      trackLead(lead.service, pathname, attribution);
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
          <div className="relative">
            <input
              id="name"
              name="name"
              autoComplete="name"
              className={`${fieldBase} pr-10`}
              placeholder={t.namePlaceholder}
              aria-invalid={errors.name || undefined}
              onBlur={(e) => onBlurField("name", e.target.value)}
              onChange={(e) => {
                onChangeField("name", e.target.value);
                markValid("name", e.target.value);
              }}
            />
            {valid.name && <ValidMark />}
          </div>
          {errors.name && (
            <p role="alert" className={errorBase}>
              {t.nameError}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="phone" className={labelBase}>
            {t.phoneLabel} <span className="text-muted">*</span>
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center">
              <PhoneFlag country={detectPhoneCountry(phone, defaultCountry)} locale={locale} />
            </span>
            <input
              id="phone"
              name="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              value={phone}
              onChange={(e) => {
                const next = formatPhoneInput(phoneState, e.target.value, defaultCountry);
                setPhoneState(next);
                onChangeField("phone", next.value);
              }}
              onBlur={() => onBlurField("phone", phone)}
              className={`${fieldBase} pl-11`}
              placeholder={phonePlaceholder(
                detectPhoneCountry(phone, defaultCountry) ?? defaultCountry,
                t.phonePlaceholder,
              )}
              aria-invalid={errors.phone || undefined}
            />
          </div>
          {errors.phone && (
            <p role="alert" className={errorBase}>
              {t.phoneError}
            </p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="contact" className={labelBase}>
          {t.contactLabel} <span className="text-muted">*</span>
        </label>
        <div className="relative">
          <input
            id="contact"
            name="contact"
            autoComplete="off"
            className={`${fieldBase} pr-10`}
            placeholder={t.contactPlaceholder}
            aria-invalid={errors.contact || undefined}
            onBlur={(e) => onBlurField("contact", e.target.value)}
            onChange={(e) => {
              onChangeField("contact", e.target.value);
              markValid("contact", e.target.value);
            }}
          />
          {valid.contact && <ValidMark />}
        </div>
        {errors.contact && (
          <p role="alert" className={errorBase}>
            {t.contactError}
          </p>
        )}
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
      {captchaErr && (
        <p role="alert" className="text-sm font-medium text-accent">
          {t.captchaError}
        </p>
      )}
      {TURNSTILE_SITE_KEY && <Turnstile siteKey={TURNSTILE_SITE_KEY} locale={locale} />}

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
