import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/* Тематические глифы пунктов услуг - в стиле эмблем (illustrations/emblems):
   сетка 32×32, штрих 1.5, currentColor, коралла нет. Прямые штрихи - на .25/.75,
   заливки - на .0/.5: на 2x-экране край ложится ровно в пиксель. Перекрытия -
   заливкой fill-surface (цвет плитки). */
const bubble =
  "M6.25 5.75h19.5a2.5 2.5 0 0 1 2.5 2.5v12a2.5 2.5 0 0 1-2.5 2.5h-11l-5 4.5v-4.5h-3.5a2.5 2.5 0 0 1-2.5-2.5v-12a2.5 2.5 0 0 1 2.5-2.5z";

const GLYPHS = {
  // чек-лист: аудит и проверка по пунктам
  audit: () => (
    <>
      <rect x="6.75" y="3.75" width="18.5" height="24.5" rx="2.5" />
      <path d="m10.25 10.25 1.5 1.5 3-3M17.25 10.25h4.5M10.25 16.25l1.5 1.5 3-3M17.25 16.25h4.5M10.25 22.25l1.5 1.5 3-3M17.25 22.25h4.5" />
    </>
  ),
  // фразы-чипы, ядро закрашено: семантика и спрос
  keywords: () => (
    <>
      <rect x="4.75" y="6.25" width="11" height="5" rx="2.5" />
      <rect x="18.75" y="6.25" width="8.5" height="5" rx="2.5" />
      <rect x="4" y="13" width="17.5" height="6.5" rx="3.25" fill="currentColor" stroke="none" />
      <rect x="4.75" y="21.25" width="7.5" height="5" rx="2.5" />
      <rect x="15.25" y="21.25" width="12" height="5" rx="2.5" />
    </>
  ),
  // лист с текстом и карандаш: тексты
  content: () => (
    <>
      <rect x="4.75" y="3.75" width="16.5" height="23.5" rx="2.5" />
      <path d="M8.25 9.25h9.5M8.25 13.25h9.5M8.25 17.25h5" />
      <path className="fill-surface" d="m24.25 11.75 3.5 3.5-10 10-4.75 1.25 1.25-4.75z" />
      <path d="m21.75 14.25 3.5 3.5" />
    </>
  ),
  // звенья: ссылки
  links: () => (
    <path d="M13.25 9.75h-4a6 6 0 0 0 0 12h4M18.75 9.75h4a6 6 0 0 1 0 12h-4M10.75 15.75h10.5" />
  ),
  // метка на карте: карточки в картах, локальная выдача
  pin: () => (
    <>
      <path d="M16 27.25s-8.5-7.9-8.5-14a8.5 8.5 0 0 1 17 0c0 6.1-8.5 14-8.5 14z" />
      <circle cx="16" cy="13.25" r="3" />
    </>
  ),
  // лист со столбиками: отчёт, результат в цифрах
  report: () => (
    <>
      <rect x="6.75" y="3.75" width="18.5" height="24.5" rx="2.5" />
      <path d="M10.75 8.25h7" />
      <g fill="currentColor" stroke="none">
        <rect x="10" y="20" width="2.5" height="4.5" rx="0.5" />
        <rect x="15" y="16.5" width="2.5" height="8" rx="0.5" />
        <rect x="20" y="13" width="2.5" height="11.5" rx="0.5" />
      </g>
    </>
  ),
  // калькулятор: экономика заявки, смета
  economics: () => (
    <>
      <rect x="7.75" y="3.75" width="16.5" height="24.5" rx="2.5" />
      <rect x="11.25" y="7.25" width="9.5" height="4.5" rx="1" />
      <g fill="currentColor" stroke="none">
        {[15.5, 20, 24.5].flatMap((y) =>
          [12, 16, 20].map((x) => <circle key={`${x}-${y}`} cx={x} cy={y} r="1.25" />),
        )}
      </g>
    </>
  ),
  // дерево: структура кампаний и разделов
  structure: () => (
    <>
      <rect x="4.75" y="4.75" width="9" height="6" rx="1.5" />
      <path d="M9.25 10.75v11.5a2 2 0 0 0 2 2h3.5M9.25 16.25h5.5" />
      <rect x="14.75" y="13.25" width="12.5" height="6" rx="1.5" />
      <rect x="14.75" y="21.25" width="12.5" height="6" rx="1.5" />
    </>
  ),
  // ползунки: ставки и бюджет
  bids: () => (
    <>
      <path d="M8.25 4.75v22.5M16.25 4.75v22.5M24.25 4.75v22.5" />
      <g className="fill-surface">
        <circle cx="8.25" cy="19.75" r="3" />
        <circle cx="16.25" cy="11.25" r="3" />
        <circle cx="24.25" cy="16.75" r="3" />
      </g>
    </>
  ),
  // воронка с минусом: минус-слова, чистый трафик
  filter: () => (
    <>
      <path d="M3.75 6.25h19.5l-7.5 9v7.5l-4.5 2.5v-10z" />
      <circle className="fill-surface" cx="23.75" cy="22.75" r="4.5" />
      <path d="M21.75 22.75h4" />
    </>
  ),
  // карточка объявления: плашка «Реклама», заголовок, строки
  ad: () => (
    <>
      <rect x="3.75" y="6.75" width="24.5" height="18.5" rx="2.5" />
      <rect x="7.5" y="10.5" width="6.5" height="3.5" rx="1.75" fill="currentColor" stroke="none" />
      <path d="M17.25 12.25h7.5M7.25 18.25h17.5M7.25 21.75h10" />
    </>
  ),
  // путь клиента: клик → заявка → сделка (закрашена)
  path: () => (
    <>
      <path d="M7.25 24.75c5 0 4-8.5 9-8.5s4-8.5 9-8.5" />
      <circle className="fill-surface" cx="7.25" cy="24.75" r="2.75" />
      <circle className="fill-surface" cx="16.25" cy="16.25" r="2.75" />
      <circle cx="25.25" cy="7.75" r="3.25" fill="currentColor" stroke="none" />
    </>
  ),
  // слои: выбор типа сайта
  layers: () => (
    <>
      <path d="M16.25 5.25 27.25 10.75 16.25 16.25 5.25 10.75z" />
      <path d="m5.25 15.75 11 5.5 11-5.5M5.25 20.75l11 5.5 11-5.5" />
    </>
  ),
  // окно сайта с кнопкой и курсором: первый экран, страница приёма заявок
  site: () => (
    <>
      <rect x="3.75" y="5.75" width="24.5" height="18.5" rx="2.5" />
      <path d="M3.75 10.25h24.5M7.25 14.25h11" />
      <rect x="7" y="17" width="10" height="3.5" rx="1.75" fill="currentColor" stroke="none" />
      <path className="fill-surface" d="m15.75 19.25 7.5 2.75-3.75 1-1 3.75z" />
    </>
  ),
  // телефон со страницей и кнопкой: мобильная версия
  phone: () => (
    <>
      <rect x="9.75" y="3.75" width="12.5" height="24.5" rx="2.5" />
      <path d="M13.25 9.25h5.5M13.25 12.75h3.5M14.75 24.75h2.5" />
      <rect x="13" y="16" width="6" height="3.5" rx="1.75" fill="currentColor" stroke="none" />
    </>
  ),
  // сообщение и трубка: форма, мессенджер, звонок
  contact: () => (
    <>
      <path d="M14.75 4.75h11a2.5 2.5 0 0 1 2.5 2.5v6.5a2.5 2.5 0 0 1-2.5 2.5h-6l-3.5 3v-3h-1.5a2.5 2.5 0 0 1-2.5-2.5v-6.5a2.5 2.5 0 0 1 2.5-2.5z" />
      <g fill="currentColor" stroke="none">
        <circle cx="16.75" cy="10.5" r="1.1" />
        <circle cx="20.25" cy="10.5" r="1.1" />
        <circle cx="23.75" cy="10.5" r="1.1" />
      </g>
      <path
        className="fill-surface"
        transform="translate(-7.5 4.9)"
        d="M12.25 11.25c.4-.6 1.2-.8 1.8-.4l1.5 1c.6.4.8 1.2.4 1.8l-.6 1c.8 1.6 2 2.8 3.6 3.6l1-.6c.6-.4 1.4-.2 1.8.4l1 1.5c.4.6.2 1.4-.4 1.8l-.9.6c-1 .7-2.3.8-3.4.3-3-1.4-5.4-3.8-6.8-6.8-.5-1.1-.4-2.4.3-3.4z"
      />
    </>
  ),
  // флаг с галочкой: цели и конверсии в счётчиках
  tracking: () => (
    <>
      <path d="M7.75 4.75v22.5" />
      <path d="M7.75 5.75h16.5l-3.5 5 3.5 5H7.75" />
      <path d="m11.75 10.75 2 2 4-4" />
    </>
  ),
  // росток: органика
  sprout: () => (
    <>
      <path d="M16.25 27.25v-11.5" />
      <path d="M16.25 15.75c0-5.25 3.25-8.5 9-8.5 0 5.25-3.25 8.5-9 8.5z" />
      <path d="M16.25 19.25c0-4.25-2.75-7-7.5-7 0 4.25 2.75 7 7.5 7z" />
      <path d="M9.75 27.25h13" />
    </>
  ),
  // часы: расписание, регламент, часовые пояса
  clock: () => (
    <>
      <circle cx="16.25" cy="16.25" r="11.25" />
      <path d="M16.25 9.75v6.5l4.5 3" />
    </>
  ),
  // пьедестал: разбор выдачи
  podium: () => (
    <>
      <path d="M4.75 27.25v-8.5h7.5v-6.5h7.5v9.5h7.5v5.5z" />
      <path d="M12.25 18.75v8.5M19.75 21.75v5.5" />
      <path
        fill="currentColor"
        stroke="none"
        d="m16 4.5.76 1.95 2.09.12-1.61 1.33.52 2.03L16 8.8l-1.76 1.13.52-2.03-1.61-1.33 2.09-.12z"
      />
    </>
  ),
  // стопка страниц: страница под каждую услугу
  pages: () => (
    <>
      <rect x="10.75" y="3.75" width="15.5" height="19.5" rx="2" />
      <rect className="fill-surface" x="5.75" y="8.75" width="15.5" height="19.5" rx="2" />
      <path d="M9.25 14.25h8.5M9.25 17.75h8.5M9.25 21.25h5" />
    </>
  ),
  // окно с кодом: техника, разметка
  code: () => (
    <>
      <rect x="3.75" y="5.75" width="24.5" height="20.5" rx="2.5" />
      <path d="M3.75 10.25h24.5" />
      <path d="m12.25 14.75-3.5 3.5 3.5 3.5M19.75 14.75l3.5 3.5-3.5 3.5M17.25 13.75l-2.5 9" />
    </>
  ),
  // метка и радиус вокруг неё: гео
  radius: () => (
    <>
      <ellipse cx="16.25" cy="20.75" rx="11.5" ry="5" pathLength={40} strokeDasharray="0.01 2" />
      <path
        className="fill-surface"
        d="M16.25 20.75s-5.25-4.9-5.25-8.75a5.25 5.25 0 0 1 10.5 0c0 3.85-5.25 8.75-5.25 8.75z"
      />
      <circle cx="16.25" cy="12" r="1.75" />
    </>
  ),
  // развилка: раздельные кампании и версии
  split: () => (
    <>
      <path d="M5.75 16.25h5.5c4.25 0 5.25-8 10-8h5M11.25 16.25c4.25 0 5.25 8 10 8h5" />
      <path d="m23.25 5.25 3 3-3 3M23.25 21.25l3 3-3 3" />
    </>
  ),
  // переключатель: включаем по условию
  toggle: () => (
    <>
      <rect x="3.75" y="9.75" width="24.5" height="12.5" rx="6.25" />
      <circle cx="22" cy="16" r="3.5" fill="currentColor" stroke="none" />
    </>
  ),
  // карточки «А» и «Қ»: языковые версии
  language: () => (
    <>
      <rect x="3.75" y="3.75" width="15.5" height="15.5" rx="2.5" />
      <path d="m7.75 15.25 3.75-8 3.75 8M9.25 12.25h4.5" />
      <rect className="fill-surface" x="12.75" y="12.75" width="15.5" height="15.5" rx="2.5" />
      <path d="M18.25 16.75v8M18.25 20.75l4-4M18.25 20.75l4.25 4v1.5" />
    </>
  ),
  // маршрут до метки: очередь регионов
  route: () => (
    <>
      <path d="M6.25 24.75c4.5 0 5-7 9.5-7 4 0 4.5-4 7.5-4" pathLength={24} strokeDasharray="0.01 2" />
      <circle cx="6.25" cy="24.75" r="2.5" fill="currentColor" stroke="none" />
      <circle className="fill-surface" cx="15.75" cy="17.75" r="2.25" />
      <path className="fill-surface" d="M23.75 14.25s-4.5-4.1-4.5-7.5a4.5 4.5 0 0 1 9 0c0 3.4-4.5 7.5-4.5 7.5z" />
      <circle cx="23.75" cy="6.75" r="1.5" />
    </>
  ),
  // окно с запретом: минус-площадки
  blocked: () => (
    <>
      <rect x="3.75" y="5.75" width="20.5" height="16.5" rx="2.5" />
      <path d="M3.75 10.25h20.5" />
      <circle className="fill-surface" cx="22.25" cy="21.75" r="6" />
      <path d="m18 26 8.5-8.5" />
    </>
  ),
  // календарь с галочкой: регистрация
  calendar: () => (
    <>
      <rect x="4.75" y="6.75" width="22.5" height="20.5" rx="2.5" />
      <path d="M4.75 12.25h22.5M10.75 4.25v5M21.25 4.25v5" />
      <path d="m11.75 19.25 3 3 5.5-5.5" />
    </>
  ),
  // камера с собеседником: видеозвонки
  video: () => (
    <>
      <rect x="3.75" y="8.75" width="17.5" height="14.5" rx="2.5" />
      <path d="m21.25 14.25 6.5-3.75v11l-6.5-3.75" />
      <circle cx="12.5" cy="14" r="2.25" />
      <path d="M8.75 20.75a3.75 3.75 0 0 1 7.5 0" />
    </>
  ),
  // пузырь с вопросом: ответы на сомнения
  faq: () => (
    <>
      <path d={bubble} />
      <path d="M13.25 11.25a2.75 2.75 0 1 1 3.75 2.55c-.6.25-1 .8-1 1.45v.5" />
      <circle cx="16" cy="18.75" r="1" fill="currentColor" stroke="none" />
    </>
  ),
  // пузырь с восклицанием: говорим прямо
  speak: () => (
    <>
      <path d={bubble} />
      <path d="M16.25 9.75v5.5" />
      <circle cx="16.25" cy="18.5" r="1" fill="currentColor" stroke="none" />
    </>
  ),
  // здание: о компании
  building: () => (
    <>
      <path d="M6.75 27.25v-20a2 2 0 0 1 2-2h8.5a2 2 0 0 1 2 2v20M19.25 12.25h4a2 2 0 0 1 2 2v13M4.25 27.25h23.5" />
      <path d="M10.75 10.25h1.5M13.75 10.25h1.5M10.75 14.25h1.5M13.75 14.25h1.5M10.75 18.25h1.5M13.75 18.25h1.5M21.75 17.25h.5M21.75 21.25h.5M11.75 27.25v-4h2.5v4" />
    </>
  ),
  // лоток входящих: заявки в CRM
  inbox: () => (
    <>
      <path d="M4.75 16.25v8.5a2.5 2.5 0 0 0 2.5 2.5h18a2.5 2.5 0 0 0 2.5-2.5v-8.5" />
      <path d="M4.75 16.25h6.5l1.5 3h7l1.5-3h6.5" />
      <path d="M16.25 4.25v10M12.25 10.25l4 4 4-4" />
    </>
  ),
  // сетка каталога, в одной плитке - найденный товар
  catalog: () => (
    <>
      <rect x="4.75" y="4.75" width="9.5" height="9.5" rx="2" />
      <rect x="17.75" y="4.75" width="9.5" height="9.5" rx="2" />
      <rect x="4.75" y="17.75" width="9.5" height="9.5" rx="2" />
      <rect x="17.75" y="17.75" width="9.5" height="9.5" rx="2" />
      <circle cx="22.5" cy="22.5" r="2" fill="currentColor" stroke="none" />
    </>
  ),
  // карточка товара: фото, цена, кнопка
  product: () => (
    <>
      <rect x="6.75" y="3.75" width="18.5" height="24.5" rx="2.5" />
      <rect x="10.25" y="7.25" width="11.5" height="8.5" rx="1" />
      <path d="m10.75 14.75 3.25-3.5 2.5 2.5 1.75-1.75 3 2.75M10.25 19.25h7" />
      <rect x="10" y="22" width="12" height="3" rx="1.5" fill="currentColor" stroke="none" />
    </>
  ),
  // банковская карта: оплата
  card: () => (
    <>
      <rect x="3.75" y="7.75" width="24.5" height="16.5" rx="2.5" />
      <rect x="4.5" y="11.5" width="23" height="3" fill="currentColor" stroke="none" />
      <path d="M7.75 19.75h5M15.75 19.75h2.5" />
    </>
  ),
  // две стрелки по кругу: обмен с учётной системой
  sync: () => (
    <>
      <path d="M25.5 14.25A9.5 9.5 0 0 0 7.75 11.25M7.75 5.75v5.5h5.5" />
      <path d="M6.5 18.25a9.5 9.5 0 0 0 17.75 3M24.25 26.75v-5.5h-5.5" />
    </>
  ),
  // спидометр: скорость
  speed: () => (
    <>
      <path d="M5.43 23.6A11.25 11.25 0 1 1 26.57 23.6" />
      <path d="M8.64 16.25 7.34 15.5M16 12v-1.5M23.36 16.25l1.3-.75M16 19.75l4.5-5.36" />
      <circle cx="16" cy="19.75" r="2" fill="currentColor" stroke="none" />
    </>
  ),
  // грузовик: доставка
  truck: () => (
    <>
      <rect x="3.75" y="7.75" width="14.5" height="13.5" rx="1.5" />
      <path d="M18.25 11.75h5l4 4.5v5h-9" />
      <circle className="fill-surface" cx="9.25" cy="22.25" r="2.75" />
      <circle className="fill-surface" cx="22.75" cy="22.25" r="2.75" />
    </>
  ),
  // команда: трое, центральный впереди
  team: () => (
    <>
      <circle cx="8.25" cy="12.75" r="2.75" />
      <circle cx="23.75" cy="12.75" r="2.75" />
      <path d="M3.25 24.25a5 5 0 0 1 7.5-4.33M28.75 24.25a5 5 0 0 0-7.5-4.33" />
      <circle className="fill-surface" cx="16" cy="11.25" r="4" />
      <path className="fill-surface" d="M8.75 26.75a7.25 7.25 0 0 1 14.5 0z" />
    </>
  ),
  // ключ: доступы
  key: () => (
    <>
      <circle cx="10.25" cy="16.25" r="5.5" />
      <circle cx="10.25" cy="16.25" r="1.5" />
      <path d="M15.75 16.25h11.5M22.25 16.25v3.5M25.75 16.25v3.5" />
    </>
  ),
  // глобус: домен, другие рынки
  globe: () => (
    <>
      <circle cx="16.25" cy="16.25" r="11.25" />
      <ellipse cx="16.25" cy="16.25" rx="4.75" ry="11.25" />
      <path d="M5 16.25h22.5M6.75 10.25h19M6.75 22.25h19" />
    </>
  ),
  // узел и три канала: одна система
  system: () => (
    <>
      <path d="M16.25 13.25v-4M13.19 19.17 9.2 22.01M19.31 19.17l3.99 2.84" />
      <circle cx="16.25" cy="17" r="3.75" fill="currentColor" stroke="none" />
      <circle cx="16.25" cy="6.25" r="3" />
      <circle cx="6.75" cy="23.75" r="3" />
      <circle cx="25.75" cy="23.75" r="3" />
    </>
  ),
  // два потока сливаются в один
  streams: () => (
    <>
      <path d="M4.25 8.25h2.5c5 0 5.5 8 10.5 8M4.25 24.25h2.5c5 0 5.5-8 10.5-8M17.25 16.25h10" />
      <path d="m23.75 12.75 3.5 3.5-3.5 3.5" />
    </>
  ),
  // медаль с галочкой: качество
  quality: () => (
    <>
      <circle cx="16.25" cy="12.75" r="8.5" />
      <path d="m12.75 12.75 2.5 2.5 4.5-4.75" />
      <path d="M11.37 19.71 9.25 27.25l7-3 7 3-2.12-7.54" />
    </>
  ),
  // глаз: прозрачность
  eye: () => (
    <>
      <path d="M3.75 16.25C6.75 10.75 11 8 16.25 8s9.5 2.75 12.5 8.25c-3 5.5-7.25 8.25-12.5 8.25S6.75 21.75 3.75 16.25z" />
      <circle cx="16.25" cy="16.25" r="4.25" />
      <circle cx="16.25" cy="16.25" r="1.5" fill="currentColor" stroke="none" />
    </>
  ),
  // весы: честная оценка
  scales: () => (
    <>
      <path d="M16.25 6.75v20M10.75 26.75h11M6.75 9.25h19" />
      <path d="M6.75 9.25 3.75 17.25M6.75 9.25l3 8M25.75 9.25l-3 8M25.75 9.25l3 8" />
      <path d="M3.75 17.25a3 3 0 0 0 6 0zM22.75 17.25a3 3 0 0 0 6 0z" />
      <circle cx="16.25" cy="5.25" r="1.5" />
    </>
  ),
} satisfies Record<string, () => ReactNode>;

export type GlyphName = keyof typeof GLYPHS;

/** Голый глиф без плитки. */
export function GlyphSvg({ name, className }: { name: GlyphName; className?: string }) {
  const G = GLYPHS[name];
  return (
    <svg
      viewBox="0 0 32 32"
      aria-hidden
      className={cn("h-8 w-8", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <G />
    </svg>
  );
}

/** Глиф на плитке (как эмблема услуги): рамка, подложка surface, штрих ink. */
export function Glyph({ name, className }: { name: GlyphName; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-border bg-surface text-ink",
        className,
      )}
    >
      <GlyphSvg name={name} />
    </span>
  );
}
