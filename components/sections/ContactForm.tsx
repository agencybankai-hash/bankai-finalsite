"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
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
import { cn } from "@/lib/utils";
import type { Locale } from "@/content/types";

const fieldBase =
  "w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 text-sm text-ink placeholder:text-muted aria-invalid:border-accent focus-visible:border-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg";
const labelBase = "mb-1.5 block text-sm font-medium text-ink";
const errorBase = "mt-1.5 text-xs font-medium text-accent";
// Форма в строку на тёмном блоке (CTASection): поле светлее фона, кегль 16 px -
// iOS не приближает страницу при фокусе. Метка - 20 px строки + 8 px отступа,
// на столько же опущена кнопка рядом с полями (md:mt-7).
const fieldInline = "h-12 bg-surface text-base";
const labelInline = "mb-2 block text-sm text-ink-2";
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

type IssuedToken = { formToken: string; country: CountryCode; minAgeMs: number };

/** Метка формы для статической страницы (app/api/form-token). null - не удалось. */
async function requestFormToken(): Promise<IssuedToken | null> {
  try {
    const res = await fetch("/api/form-token", { cache: "no-store" });
    return res.ok ? ((await res.json()) as IssuedToken) : null;
  } catch {
    return null;
  }
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
  formToken,
  variant = "page",
  service,
  submitLabel,
  note,
  aside,
}: {
  locale?: Locale;
  /** Стартовая страна телефона, обычно по IP посетителя (lib/geo.ts). */
  defaultCountry?: CountryCode;
  /**
   * Подписанная метка выдачи формы (lib/form-token.ts): защита от мгновенной
   * отправки. Не передана - форма запрашивает её сама (статические страницы).
   */
  formToken?: string;
  /** page - полная форма страницы контактов; inline - три поля в строку для CTASection. */
  variant?: "page" | "inline";
  /** inline: услуга заявки вместо списка «Что интересует». */
  service?: string;
  /** Подпись кнопки вместо «Отправить заявку». */
  submitLabel?: string;
  /** inline: строка перед согласием с политикой. */
  note?: string;
  /** inline: справа от согласия, например ссылка на Telegram. */
  aside?: ReactNode;
}) {
  const t = ui(locale).form;
  const pathname = usePathname();
  const inline = variant === "inline";
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
  // Страна телефона. У формы без метки с сервера приходит вместе с меткой -
  // если номер ещё не начали вводить.
  const [country, setCountry] = useState(defaultCountry);
  const phoneRef = useRef<HTMLInputElement>(null);

  // Зелёная галочка у имени и контакта появляется сразу при валидном значении.
  const [valid, setValid] = useState<{ name?: boolean; contact?: boolean }>({});

  const validators = {
    name: (v: string) => v.trim().length > 0,
    phone: (v: string) => normalizePhone(v, country) !== null,
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
  // Виджет Turnstile виден, только когда Cloudflare просит пройти проверку:
  // тогда в строчной форме отделяем его от полей отступом.
  const [challenge, setChallenge] = useState(false);

  // Метка выдачи формы. На /contacts приходит с сервера при рендере. Статическая
  // страница выдать её не может, поэтому форма без метки запрашивает её сама,
  // когда подходит к экрану, и перед отправкой выдерживает минимальное время
  // с момента выдачи - по часам браузера, чтобы не зависеть от часов сервера.
  const token = useRef<{ value: string; readyAt: number } | null>(
    formToken ? { value: formToken, readyAt: 0 } : null,
  );
  const tokenRequest = useRef<Promise<void> | null>(null);
  const loadToken = useCallback(() => {
    tokenRequest.current ??= requestFormToken().then((issued) => {
      if (!issued) {
        tokenRequest.current = null; // повторим при отправке
        return;
      }
      token.current = { value: issued.formToken, readyAt: performance.now() + issued.minAgeMs };
      if (!phoneRef.current?.value) setCountry(issued.country);
    });
    return tokenRequest.current;
  }, []);

  // Форма рядом с экраном: только тогда запрашиваем метку и подключаем
  // Turnstile - скрипт Cloudflare не грузится на каждой странице с CTA зря.
  const formRef = useRef<HTMLFormElement>(null);
  const [near, setNear] = useState(formToken !== undefined);
  useEffect(() => {
    if (near) return;
    const el = formRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setNear(true), {
      rootMargin: "600px 0px",
    });
    io.observe(el);
    return () => io.disconnect();
  }, [near]);
  useEffect(() => {
    if (near && !token.current) void loadToken();
  }, [near, loadToken]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    if (String(data.get("company") ?? "")) return; // honeypot
    const name = String(data.get("name") ?? "").trim();
    const phoneE164 = normalizePhone(phone, country);
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
      if (!token.current) await loadToken();
      const wait = (token.current?.readyAt ?? 0) - performance.now();
      if (wait > 0) await new Promise((r) => setTimeout(r, wait));
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...lead, turnstileToken, formToken: token.current?.value }),
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
      <div
        className={
          inline
            ? "rounded-xl border border-border bg-surface p-6 sm:p-8"
            : "rounded-xl border border-ink bg-surface p-8 text-center"
        }
      >
        <h3 className="text-lg font-semibold text-ink">{t.successTitle}</h3>
        <p className={cn("mt-2 max-w-md text-sm leading-relaxed text-ink-2", !inline && "mx-auto")}>
          {t.successText}
        </p>
      </div>
    );
  }

  const field = inline ? cn(fieldBase, fieldInline) : fieldBase;
  const label = inline ? labelInline : labelBase;
  // В строке все три поля обязательны - звёздочки там не нужны.
  const required = !inline && (
    <>
      {" "}
      <span className="text-muted">*</span>
    </>
  );
  const message = cn("text-sm font-medium text-accent", inline && "mt-4");

  const submit = (
    <button
      type="submit"
      disabled={pending}
      className={
        inline
          ? "inline-flex h-12 items-center justify-center rounded-md bg-accent px-6 text-base font-medium whitespace-nowrap text-accent-fg transition duration-300 ease-osmo hover:opacity-90 disabled:opacity-60 md:mt-7"
          : "inline-flex h-12 items-center justify-center rounded-lg bg-ink px-6 text-base font-medium text-bg hover:bg-ink-2 disabled:opacity-60"
      }
    >
      {pending ? t.submitting : (submitLabel ?? t.submit)}
    </button>
  );

  const consent = (
    <>
      {t.consent}{" "}
      <Link href={t.privacyHref} className="underline underline-offset-2 hover:text-ink-2">
        {t.consentLink}
      </Link>
      {t.consentAfter}
    </>
  );

  const fields = (
    <>
      <div className={inline ? "contents" : "grid gap-5 sm:grid-cols-2"}>
        <div>
          <label htmlFor="name" className={label}>
            {t.nameLabel}
            {required}
          </label>
          <div className="relative">
            <input
              id="name"
              name="name"
              autoComplete="name"
              className={cn(field, "pr-10")}
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
          <label htmlFor="phone" className={label}>
            {t.phoneLabel}
            {required}
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center">
              <PhoneFlag country={detectPhoneCountry(phone, country)} locale={locale} />
            </span>
            <input
              ref={phoneRef}
              id="phone"
              name="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              value={phone}
              onChange={(e) => {
                const next = formatPhoneInput(phoneState, e.target.value, country);
                setPhoneState(next);
                onChangeField("phone", next.value);
              }}
              onBlur={() => onBlurField("phone", phone)}
              className={cn(field, "pl-11")}
              placeholder={phonePlaceholder(
                detectPhoneCountry(phone, country) ?? country,
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
        <label htmlFor="contact" className={label}>
          {t.contactLabel}
          {required}
        </label>
        <div className="relative">
          <input
            id="contact"
            name="contact"
            autoComplete="off"
            className={cn(field, "pr-10")}
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
    </>
  );

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className={inline ? undefined : "space-y-5"}>
      {/* honeypot - скрыто от людей, ловит ботов */}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="hidden"
      />
      {inline ? (
        // С 1280 px - одна строка: имя, телефон, контакт и кнопка; доли колонок
        // подобраны под самые длинные плейсхолдеры RU и EN. На экранах меньше
        // в строку они не влезают - два столбца, на мобиле - один.
        <div className="grid gap-5 md:grid-cols-2 md:items-start md:gap-x-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)_minmax(0,1.35fr)_auto]">
          <input type="hidden" name="service" value={service ?? ""} />
          {fields}
          {submit}
        </div>
      ) : (
        <>
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

          {fields}

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
        </>
      )}

      {status === "error" && (
        <p role="alert" className={message}>
          {t.formError}
        </p>
      )}
      {sendErr && (
        <p role="alert" className={message}>
          {t.sendError}
        </p>
      )}
      {captchaErr && (
        <p role="alert" className={message}>
          {t.captchaError}
        </p>
      )}
      {TURNSTILE_SITE_KEY && near && (
        <Turnstile
          siteKey={TURNSTILE_SITE_KEY}
          locale={locale}
          theme={inline ? "dark" : "auto"}
          className={inline && challenge ? "mt-5" : undefined}
          onInteractive={inline ? () => setChallenge(true) : undefined}
        />
      )}

      {inline ? (
        <div className="mt-5 flex flex-col gap-3 text-sm lg:flex-row lg:items-baseline lg:justify-between lg:gap-8">
          <p className="text-muted">
            {note && <span className="text-ink-2">{note} </span>}
            {consent}
          </p>
          {aside}
        </div>
      ) : (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          {submit}
          <p className="text-xs text-muted">{consent}</p>
        </div>
      )}
    </form>
  );
}
