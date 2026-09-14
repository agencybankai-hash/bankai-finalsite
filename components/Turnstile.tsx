"use client";

import Script from "next/script";
import { useEffect, useRef } from "react";

/**
 * Виджет Cloudflare Turnstile внутри формы. Рендерится явно (render=explicit),
 * чтобы работать и после клиентской навигации. Виджет сам добавляет в форму
 * скрытое поле `cf-turnstile-response` с токеном; при `interaction-only`
 * посетитель видит его, только если Cloudflare решит задать проверку.
 */
type TurnstileApi = {
  render: (el: HTMLElement, opts: Record<string, unknown>) => string;
  remove: (id: string) => void;
};
declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

const SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

export function Turnstile({ siteKey, locale = "ru" }: { siteKey: string; locale?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let id: string | null = null;
    let cancelled = false;

    const mount = () => {
      if (cancelled || !window.turnstile || id !== null) return;
      id = window.turnstile.render(el, {
        sitekey: siteKey,
        appearance: "interaction-only",
        language: locale,
        "refresh-expired": "auto",
      });
    };

    // Скрипт мог загрузиться раньше или позже монтирования: ждём и то, и другое.
    mount();
    const timer = window.setInterval(mount, 200);

    return () => {
      cancelled = true;
      window.clearInterval(timer);
      if (id !== null) {
        try {
          window.turnstile?.remove(id);
        } catch {}
      }
    };
  }, [siteKey, locale]);

  return (
    <>
      <Script src={SCRIPT_SRC} strategy="afterInteractive" />
      <div ref={ref} />
    </>
  );
}
