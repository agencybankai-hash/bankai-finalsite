/*
  Данные внутреннего контент-чеклиста (страница /checklist).
  Рабочий инструмент для команды: страница → секция → статус → что доделать.
  Не для публики: страница noindex, не в навигации и не в sitemap.
*/

export type CheckStatus = "done" | "data" | "media" | "legal" | "add";

export type CheckItem = {
  id: string;
  label: string;
  source?: string;
  status: CheckStatus;
  todo?: string;
};

export type CheckPage = {
  route: string;
  title: string;
  items: CheckItem[];
};

export const statusMeta: Record<
  CheckStatus,
  { label: string; tone: "done" | "accent" | "media" | "legal" | "add" }
> = {
  done: { label: "Готово", tone: "done" },
  data: { label: "Данные", tone: "accent" },
  media: { label: "Медиа", tone: "media" },
  legal: { label: "Юрист", tone: "legal" },
  add: { label: "Кандидат", tone: "add" },
};

/* Апруверы: пункт зачёркивается, когда все трое поставили галочку.
   Состояние общее (в БД), видно всем. Без логина — колонки именные,
   каждый ставит свою (доверие, внутренний инструмент). */
export const approvers = [
  { key: "artur", label: "Артур" },
  { key: "daniyar", label: "Данияр" },
  { key: "petr", label: "Пётр" },
] as const;
export type ApproverKey = (typeof approvers)[number]["key"];

export const checklist: CheckPage[] = [
  {
    route: "/",
    title: "Главная",
    items: [
      { id: "home-hero", label: "Hero — H1 (ключ+гео), подзаголовок, 2 CTA, бейджи", source: "site.ts:hero", status: "done" },
      { id: "home-clients", label: "Логотипы клиентов", source: "site.ts:clients", status: "data", todo: "6 SVG-лого или решение «под NDA»" },
      { id: "home-trust", label: "Статистика (50+/$14.6M/5.2x/−40%)", source: "site.ts:trustStats", status: "done" },
      { id: "home-problem", label: "Проблема — 3 группы болей", source: "site.ts:problem", status: "done" },
      { id: "home-system", label: "Система — лид + 3 слоя + итог", source: "site.ts:system", status: "media", todo: "3 иллюстрации: рынок / сад / цех" },
      { id: "home-services", label: "Услуги — 3 карточки-канала", source: "site.ts:servicesPreview", status: "done" },
      { id: "home-cases", label: "Кейсы (3)", source: "cases.ts:homeCases", status: "data", todo: "реальные метрики вместо [N]/[X]" },
      { id: "home-testimonials", label: "Отзывы (3)", source: "testimonials.ts", status: "data", todo: "реальные: текст + имя/должность + согласие" },
      { id: "home-includes", label: "Что вы получаете (6 фич)", source: "site.ts:homeIncludes", status: "done" },
      { id: "home-process", label: "Процесс (4 шага)", source: "site.ts:process", status: "done" },
      { id: "home-company", label: "Кто строит фабрику (текст + статы)", source: "site.ts:companyBlock", status: "done" },
      { id: "home-guarantee", label: "Гарантии (3)", source: "site.ts:guarantee", status: "done" },
      { id: "home-pricing", label: "Тарифы", source: "pricing.ts", status: "done" },
      { id: "home-leadmagnet", label: "Lead Magnet (гайд)", source: "site.ts:leadMagnet", status: "done" },
      { id: "home-faq", label: "FAQ", source: "faq.ts:homeFaq", status: "done" },
      { id: "home-cta", label: "Финальный CTA", source: "site.ts:finalCta", status: "done" },
      { id: "home-audience", label: "«Кому подходит» (квалификатор)", source: "site.ts:homeAudience", status: "add", todo: "готовый блок не выведен — решить, добавлять ли" },
    ],
  },
  {
    route: "/services/seo · /context · /web",
    title: "Услуги (3 канала)",
    items: [
      { id: "svc-hero", label: "Hero — H1 (ключ+гео) + подзаголовок + бейджи", source: "services.ts:hero", status: "done" },
      { id: "svc-metaphor", label: "Метафора «по-простому»", source: "services.ts:metaphor", status: "done" },
      { id: "svc-audience", label: "Кому подходит", source: "services.ts:audience", status: "done" },
      { id: "svc-notfor", label: "Кому НЕ подойдёт", source: "services.ts:problem", status: "done" },
      { id: "svc-includes", label: "Что мы делаем", source: "services.ts:includes", status: "done" },
      { id: "svc-process", label: "Как мы работаем (процесс)", source: "services.ts:process", status: "done" },
      { id: "svc-funnel", label: "Как даёт заявки (воронка)", source: "services.ts:funnel", status: "done" },
      { id: "svc-cases", label: "Где это сработало (кейсы канала)", source: "cases.ts (фильтр)", status: "data", todo: "метрики кейсов [N]/[X]" },
      { id: "svc-pricing", label: "Тарифы / тариф", source: "services.ts:plans/pricing", status: "done" },
      { id: "svc-partofsystem", label: "Часть системы", source: "services.ts:partOfSystem", status: "done" },
      { id: "svc-guide", label: "Гайд по каналу («нет секретов»)", source: "ссылка", status: "done" },
      { id: "svc-faq", label: "FAQ канала", source: "services.ts:faq", status: "done" },
      { id: "svc-cta", label: "Финальный CTA", status: "done" },
      { id: "svc-meta", label: "Meta description (сейчас = подзаголовок)", status: "add", todo: "оптимизировать под SERP на этапе SEO" },
      { id: "svc-social", label: "Отзыв/соц-доказательство по каналу", status: "add", todo: "решить, добавлять ли" },
    ],
  },
  {
    route: "/cases",
    title: "Кейсы — список",
    items: [
      { id: "caseslist-hero", label: "Hero — заголовок + лид", source: "cases.ts:casesIntro", status: "done" },
      { id: "caseslist-stats", label: "Статистика (3)", source: "cases.ts:casesStats", status: "done" },
      { id: "caseslist-kz", label: "Кейсы в Казахстане", source: "cases.ts:kzCases", status: "data", todo: "метрики" },
      { id: "caseslist-us", label: "Кейсы на рынке США", source: "cases.ts:intlCases", status: "data", todo: "метрики" },
      { id: "caseslist-templates", label: "Образцы подачи (8, помечены)", source: "cases.ts:templateCases", status: "done" },
      { id: "caseslist-cta", label: "Финальный CTA", status: "done" },
    ],
  },
  {
    route: "/cases/[slug]",
    title: "Кейс — деталь",
    items: [
      { id: "case-header", label: "Шапка: бейджи + H1 + headline + teaser + dl", status: "done" },
      { id: "case-visual", label: "Превью проекта (визуал/скриншоты)", status: "media", todo: "образцы ✅ (SVG); реальным нужны скриншоты" },
      { id: "case-challenge", label: "Задача + Стратегия", source: "c.challenge/strategy", status: "data", todo: "almaty-dental, almaty-renovation — пустые" },
      { id: "case-diagnosis", label: "Диагностика (опц.)", source: "c.diagnosis", status: "done" },
      { id: "case-thesis", label: "Тезис-инсайт (опц.)", source: "c.thesis", status: "done" },
      { id: "case-work", label: "Работа по каналам", source: "c.work", status: "done" },
      { id: "case-results", label: "Цифры проекта (до/после)", source: "c.results", status: "data", todo: "метрики [N]/[X] в реальных" },
      { id: "case-honesty", label: "Что не сработало / риски (опц.)", source: "c.honesty", status: "done" },
      { id: "case-conclusion", label: "Вывод (опц.)", source: "c.conclusion", status: "done" },
      { id: "case-testimonial", label: "Отзыв (опц.)", source: "c.testimonial", status: "data", todo: "[Отзыв… согласовать] в реальных" },
      { id: "case-related", label: "Похожие проекты", status: "done" },
      { id: "case-cta", label: "Финальный CTA", status: "done" },
      { id: "case-meta", label: "Meta каждого кейса", status: "add", todo: "довести до ключ+гео по нише на этапе SEO" },
    ],
  },
  {
    route: "/guides",
    title: "Гайды — список + статьи",
    items: [
      { id: "guideslist-grid", label: "Сетка гайдов (4)", source: "guides.ts", status: "done" },
      { id: "guide-marketing", label: "Гайд: Маркетинг под заявки (+PDF)", status: "done" },
      { id: "guide-seo", label: "Гайд: SEO-продвижение 2026 (+PDF)", status: "done" },
      { id: "guide-context", label: "Гайд: Контекстная реклама 2026 (+PDF)", status: "done" },
      { id: "guide-landing", label: "Гайд: Конверсионный лендинг 2026 (+PDF)", status: "done" },
      { id: "guides-intro", label: "Интро «зачем читать» на списке", status: "add", todo: "решить, нужно ли" },
      { id: "guides-more", label: "Новые гайды/статьи под семантику", status: "add", todo: "контент-движок SEO (локальное, по нишам)" },
    ],
  },
  {
    route: "/guides/[slug]",
    title: "Гайд — деталь",
    items: [
      { id: "guide-breadcrumb", label: "Хлебные крошки", status: "done" },
      { id: "guide-toc", label: "Оглавление (авто из H2/H3)", status: "done" },
      { id: "guide-body", label: "Тело статьи (markdown)", status: "done" },
      { id: "guide-bonus", label: "Бонус-гейт (PDF чек-лист)", status: "done" },
      { id: "guide-outro", label: "Outro + CTA-кнопки", status: "done" },
    ],
  },
  {
    route: "/about",
    title: "О нас",
    items: [
      { id: "about-hero", label: "Hero", source: "about.ts:hero", status: "done" },
      { id: "about-story", label: "История", source: "about.ts:story", status: "media", todo: "видео «о подходе»" },
      { id: "about-principles", label: "Принципы (4)", source: "about.ts:principles", status: "done" },
      { id: "about-stats", label: "Статистика (4)", source: "about.ts:stats", status: "done" },
      { id: "about-team", label: "Команда (5 ролей)", source: "about.ts:team", status: "media", todo: "реальные фото + имена/роли" },
      { id: "about-beyond", label: "Лиды — не деньги", source: "about.ts:beyond", status: "done" },
      { id: "about-process", label: "Как работаем (процесс)", source: "site.ts:process", status: "done" },
      { id: "about-geo", label: "Гео присутствия (KZ+US)", source: "about.ts:geo", status: "media", todo: "карта/изображение" },
      { id: "about-cta", label: "Финальный CTA", status: "done" },
      { id: "about-social", label: "Соц-доказательство (лого/мини-кейсы)", status: "add", todo: "решить, добавлять ли" },
    ],
  },
  {
    route: "/contacts",
    title: "Контакты",
    items: [
      { id: "contacts-hero", label: "Hero", status: "done" },
      { id: "contacts-form", label: "Форма заявки (→ /api/contact)", status: "done" },
      { id: "contacts-info", label: "Контактные данные", source: "site.ts:contacts", status: "data", todo: "Telegram-канал и YouTube = #; @may_work личный → агентский" },
      { id: "contacts-informers", label: "Информеры", status: "done" },
      { id: "contacts-response", label: "Время ответа / часы / мессенджеры", status: "add", todo: "решить" },
      { id: "contacts-map", label: "Карта/адрес офиса (локальное SEO)", status: "add", todo: "решить" },
    ],
  },
  {
    route: "/privacy · /terms",
    title: "Легал",
    items: [
      { id: "legal-privacy", label: "Политика конфиденциальности (8 разделов)", status: "legal", todo: "вычитка юристом под РК" },
      { id: "legal-terms", label: "Условия использования (7 разделов)", status: "legal", todo: "вычитка юристом под РК" },
    ],
  },
];

export const macroNote =
  "Структура сайта полная под конверсию+SEO. Критично-недостающих секций нет — основной объём это наполнение данными/медиа, а не достройка. Кандидаты на добавление помечены статусом «Кандидат».";
