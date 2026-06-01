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

/* Секции сервисной страницы (ChannelPage) одинаковы для всех 3 каналов.
   Свои id на канал → апрувим каждую страницу и секцию отдельно. */
function channelItems(p: string): CheckItem[] {
  return [
    { id: `${p}-hero`, label: "Hero — H1 (ключ+гео) + подзаголовок + бейджи", source: "services.ts:hero", status: "done" },
    { id: `${p}-metaphor`, label: "Метафора «по-простому»", source: "services.ts:metaphor", status: "done" },
    { id: `${p}-audience`, label: "Кому подходит", source: "services.ts:audience", status: "done" },
    { id: `${p}-notfor`, label: "Кому НЕ подойдёт", source: "services.ts:problem", status: "done" },
    { id: `${p}-includes`, label: "Что мы делаем", source: "services.ts:includes", status: "done" },
    { id: `${p}-process`, label: "Как мы работаем (процесс)", source: "services.ts:process", status: "done" },
    { id: `${p}-funnel`, label: "Как даёт заявки (воронка)", source: "services.ts:funnel", status: "done" },
    { id: `${p}-cases`, label: "Где это сработало (кейсы канала)", source: "cases.ts (фильтр)", status: "data", todo: "2-3 кейса канала (из 5), метрики [N]/[X]" },
    { id: `${p}-pricing`, label: "Тарифы / тариф", source: "services.ts:plans/pricing", status: "done" },
    { id: `${p}-partofsystem`, label: "Часть системы", source: "services.ts:partOfSystem", status: "done" },
    { id: `${p}-guide`, label: "Гайд по каналу («нет секретов»)", source: "ссылка", status: "done" },
    { id: `${p}-faq`, label: "FAQ канала", source: "services.ts:faq", status: "done" },
    { id: `${p}-cta`, label: "Финальный CTA", status: "done" },
  ];
}

/* Слот кейса (страница /cases/[slug]) — подбираем и наполняем. 5 флагманов;
   каждый помечается каналом(ами), чтобы сервисные тянули по 2-3 своих. */
function caseItems(p: string): CheckItem[] {
  return [
    { id: `${p}-pick`, label: "Подобрать кейс: клиент, ниша, гео, канал(ы)", status: "data" },
    { id: `${p}-headline`, label: "Заголовок-результат + шапка (индустрия/гео/срок)", source: "c.headline/teaser", status: "data" },
    { id: `${p}-visual`, label: "Превью / скриншоты проекта", status: "media" },
    { id: `${p}-challenge`, label: "Задача + Стратегия", source: "c.challenge/strategy", status: "data" },
    { id: `${p}-diagnosis`, label: "Диагностика (что было плохо)", source: "c.diagnosis", status: "data" },
    { id: `${p}-thesis`, label: "Тезис-инсайт", source: "c.thesis", status: "data" },
    { id: `${p}-work`, label: "Работа по каналам", source: "c.work", status: "data" },
    { id: `${p}-results`, label: "Цифры до/после", source: "c.results", status: "data" },
    { id: `${p}-honesty`, label: "Что не сработало / риски", source: "c.honesty", status: "data" },
    { id: `${p}-conclusion`, label: "Вывод", source: "c.conclusion", status: "data" },
    { id: `${p}-testimonial`, label: "Отзыв (+ согласие)", source: "c.testimonial", status: "data" },
  ];
}

/* Гайд (статья) — тексты готовы; апрувим каждый отдельно. */
function guideItems(p: string): CheckItem[] {
  return [
    { id: `${p}-article`, label: "Текст статьи (markdown)", status: "done" },
    { id: `${p}-pdf`, label: "PDF чек-лист", status: "done" },
    { id: `${p}-meta`, label: "Meta / SEO-заголовок", status: "add", todo: "оптимизировать на этапе SEO" },
  ];
}

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
    route: "/services/seo",
    title: "Услуги · SEO продвижение",
    items: channelItems("svc-seo"),
  },
  {
    route: "/services/context",
    title: "Услуги · Контекстная реклама",
    items: channelItems("svc-context"),
  },
  {
    route: "/services/web",
    title: "Услуги · Разработка сайтов",
    items: channelItems("svc-web"),
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
  { route: "/cases/[slug] · слот 1", title: "Кейс 1 (подобрать)", items: caseItems("case1") },
  { route: "/cases/[slug] · слот 2", title: "Кейс 2 (подобрать)", items: caseItems("case2") },
  { route: "/cases/[slug] · слот 3", title: "Кейс 3 (подобрать)", items: caseItems("case3") },
  { route: "/cases/[slug] · слот 4", title: "Кейс 4 (подобрать)", items: caseItems("case4") },
  { route: "/cases/[slug] · слот 5", title: "Кейс 5 (подобрать)", items: caseItems("case5") },
  {
    route: "/guides",
    title: "Гайды — список",
    items: [
      { id: "guideslist-grid", label: "Сетка гайдов (4)", source: "guides.ts", status: "done" },
      { id: "guides-intro", label: "Интро/лид-магнит на списке", status: "add", todo: "решить, нужно ли" },
      { id: "guides-more", label: "Новые гайды под семантику", status: "add", todo: "контент-движок SEO (локальное, по нишам)" },
    ],
  },
  { route: "/guides/marketing", title: "Гайд · Маркетинг под заявки", items: guideItems("guide-marketing") },
  { route: "/guides/seo", title: "Гайд · SEO-продвижение", items: guideItems("guide-seo") },
  { route: "/guides/context", title: "Гайд · Контекстная реклама", items: guideItems("guide-context") },
  { route: "/guides/landing", title: "Гайд · Конверсионный лендинг", items: guideItems("guide-landing") },
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
