"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { runOnInteractionOrAfter } from "@/lib/defer";

const YM_ID = 112649944;
const TAG_SRC = `https://mc.yandex.ru/metrika/tag.js?id=${YM_ID}`;
// Внутренние разделы с данными заявок: Вебвизор не должен их записывать.
const PRIVATE_PATH = /^\/(admin|checklist)(\/|$)/;

type Ym = ((...args: unknown[]) => void) & { a?: IArguments[]; l?: number };
type YmWindow = Window & { ym?: Ym };

/** Код счётчика из кабинета Метрики: очередь вызовов до загрузки tag.js. */
function loadTag(w: YmWindow) {
  const ym = function () {
    // tag.js разбирает очередь объектов arguments, как в оригинальном коде.
    // eslint-disable-next-line prefer-rest-params
    (ym.a = ym.a || []).push(arguments);
  } as Ym;
  ym.l = Date.now();
  w.ym = ym;
  for (const s of Array.from(document.scripts)) if (s.src === TAG_SRC) return;
  const script = document.createElement("script");
  script.async = true;
  script.src = TAG_SRC;
  document.head.appendChild(script);
}

let initScheduled = false;

export function YandexMetrika() {
  const pathname = usePathname();
  const lastUrl = useRef<string | null>(null);

  useEffect(() => {
    // Только боевой домен: локальные и превью-визиты не попадают в статистику.
    if (!/(^|\.)bankai\.agency$/.test(location.hostname) || PRIVATE_PATH.test(pathname)) return;
    const w = window as YmWindow;
    const url = location.href;
    if (!w.ym) {
      if (!initScheduled) {
        initScheduled = true;
        // Счётчик (особенно Вебвизор) тяжёлый: стартуем по первому действию
        // посетителя или через несколько секунд после загрузки (lib/defer.ts).
        runOnInteractionOrAfter(() => {
          if (w.ym) return;
          loadTag(w);
          // init сам отправляет просмотр текущей страницы.
          w.ym!(YM_ID, "init", {
            ssr: true,
            webvisor: true,
            clickmap: true,
            ecommerce: "dataLayer",
            referrer: document.referrer,
            url: location.href,
            accurateTrackBounce: true,
            trackLinks: true,
          });
        });
      }
    } else if (url !== lastUrl.current) {
      // Next переключает страницы через History API, а такие переходы
      // счётчик сам не видит - просмотр отправляем вручную.
      w.ym(YM_ID, "hit", url, { referer: lastUrl.current ?? document.referrer });
    }
    lastUrl.current = url;
  }, [pathname]);

  if (PRIVATE_PATH.test(pathname)) return null;
  return (
    <noscript
      dangerouslySetInnerHTML={{
        __html: `<div><img src="https://mc.yandex.ru/watch/${YM_ID}" style="position:absolute; left:-9999px;" alt="" /></div>`,
      }}
    />
  );
}
