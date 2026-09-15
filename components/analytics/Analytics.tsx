"use client";

import { useEffect } from "react";
import { runOnInteractionOrAfter } from "@/lib/defer";
import { YandexMetrika } from "./YandexMetrika";

// Идентификаторы GA и GTM только из env: на локали и в превью, где они
// не заданы, эти теги не рендерятся. Метрика сама проверяет боевой домен.
const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

function addScript(src: string) {
  const s = document.createElement("script");
  s.async = true;
  s.src = src;
  document.head.appendChild(s);
}

type DL = { dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void };

/**
 * GTM и GA4 подключаются не сразу, а по первому действию посетителя или
 * через несколько секунд после загрузки (lib/defer.ts): контейнер GTM
 * с GA4 внутри - это 300 КБ скриптов и заметная нагрузка на главный поток,
 * первой краске и гидратации они не нужны. dataLayer создаётся сразу,
 * поэтому события, отправленные до загрузки, не теряются.
 */
export function Analytics() {
  useEffect(() => {
    if (!GA_ID && !GTM_ID) return;
    const w = window as Window & DL;
    w.dataLayer = w.dataLayer || [];
    return runOnInteractionOrAfter(() => {
      if (GTM_ID) {
        w.dataLayer!.push({ "gtm.start": Date.now(), event: "gtm.js" });
        addScript(`https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`);
      }
      if (GA_ID) {
        w.gtag = function gtag() {
          // eslint-disable-next-line prefer-rest-params
          w.dataLayer!.push(arguments);
        };
        w.gtag("js", new Date());
        w.gtag("config", GA_ID);
        addScript(`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`);
      }
    });
  }, []);

  return (
    <>
      <YandexMetrika />
      {GTM_ID && (
        <noscript
          dangerouslySetInnerHTML={{
            __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=${GTM_ID}" height="0" width="0" style="display:none;visibility:hidden"></iframe>`,
          }}
        />
      )}
    </>
  );
}
