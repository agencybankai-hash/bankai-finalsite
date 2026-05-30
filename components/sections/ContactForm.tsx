"use client";

import { useState } from "react";

const services = [
  "Лидогенерация под ключ",
  "SEO продвижение",
  "Контекстная реклама",
  "Разработка сайта",
  "Пока не определился",
];

const fieldBase =
  "w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 text-sm text-ink placeholder:text-muted focus:border-ink focus:outline-none";
const labelBase = "mb-1.5 block text-sm font-medium text-ink";

export function ContactForm() {
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
    } catch {
      setSendErr(true);
    } finally {
      setPending(false);
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-xl border border-ink bg-surface p-8 text-center">
        <h3 className="text-lg font-semibold text-ink">Заявка отправлена</h3>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-ink-2">
          Спасибо. Свяжемся в течение рабочего дня - обычно быстрее. Если срочно,
          напишите в Telegram.
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
          Что интересует
        </label>
        <select id="service" name="service" className={fieldBase} defaultValue={services[0]}>
          {services.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className={labelBase}>
            Имя <span className="text-muted">*</span>
          </label>
          <input
            id="name"
            name="name"
            className={fieldBase}
            placeholder="Как к вам обращаться"
            aria-invalid={errors.name || undefined}
          />
          {errors.name && (
            <p className="mt-1.5 text-xs text-ink">Укажите имя</p>
          )}
        </div>
        <div>
          <label htmlFor="contact" className={labelBase}>
            Контакт <span className="text-muted">*</span>
          </label>
          <input
            id="contact"
            name="contact"
            className={fieldBase}
            placeholder="Telegram, email или телефон"
            aria-invalid={errors.contact || undefined}
          />
          {errors.contact && (
            <p className="mt-1.5 text-xs text-ink">Укажите способ связи</p>
          )}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="niche" className={labelBase}>
            Ниша <span className="text-muted">— необязательно</span>
          </label>
          <input
            id="niche"
            name="niche"
            className={fieldBase}
            placeholder="Чем занимается бизнес"
          />
        </div>
        <div>
          <label htmlFor="revenue" className={labelBase}>
            Оборот в месяц <span className="text-muted">— необязательно</span>
          </label>
          <input
            id="revenue"
            name="revenue"
            className={fieldBase}
            placeholder="Ориентировочно"
          />
        </div>
      </div>

      <div>
        <label htmlFor="comment" className={labelBase}>
          Комментарий <span className="text-muted">— необязательно</span>
        </label>
        <textarea
          id="comment"
          name="comment"
          rows={4}
          className={fieldBase}
          placeholder="Задача, ссылка на сайт, что уже пробовали"
        />
      </div>

      {status === "error" && (
        <p className="text-sm text-ink">Заполните обязательные поля выше.</p>
      )}
      {sendErr && (
        <p className="text-sm text-ink">
          Не удалось отправить. Попробуйте ещё раз или напишите в Telegram.
        </p>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex h-12 items-center justify-center rounded-lg bg-ink px-6 text-base font-medium text-bg hover:bg-ink-2 disabled:opacity-60"
        >
          {pending ? "Отправляем…" : "Отправить заявку"}
        </button>
        <p className="text-xs text-muted">
          Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности.
        </p>
      </div>
    </form>
  );
}
