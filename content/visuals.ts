import type { HeroVisualKind, VisualCopy, VisualFloat } from "./types";

/* ───────────────  Тематические визуалы hero  ───────────────
   Отдельно от services.ts и landings.ts: правка картинки не должна сдвигать
   lastmod страниц в sitemap. Правила копирайта:
   - сцена - пример-бизнес «ремонт квартир» и скелетоны, без цифр клиентов;
   - KPI - только факты с этой же страницы (сроки, способы), не повтор бейджей;
   - карточка - одна реальная цифра кейса, который показан на странице
     (блок доказательств или сетка кейсов). Нет подходящей - карточки нет.
   Какой вид у страницы - components/illustrations/resolve.ts. */

/** Виды хабов. */
export const channelVisuals: Record<string, HeroVisualKind> = {
  seo: "seo",
  context: "context",
  web: "web",
  leadgen: "leadgen",
};

/** Гео-нейтральные подуслуги и особые страницы. Городовые версии подуслуг
 *  наследуют вид родителя, остальные городовые - городской вид канала. */
export const landingVisuals: Record<string, HeroVisualKind> = {
  "prodvizhenie-internet-magazina": "seo-store",
  "prodvizhenie-saitov-kazakhstan": "seo-regions",
  "nastroika-google-ads": "google-ads",
  "nastroika-yandex-direct": "yandex-direct",
  "sozdanie-lendinga": "landing",
  "sozdanie-korporativnogo-saita": "corporate",
  "sozdanie-internet-magazina": "ecommerce",
};

/** Городской вид канала для городовых страниц без родителя. */
export const cityVisuals: Record<string, HeroVisualKind> = {
  seo: "seo-city",
  context: "context-city",
  web: "web-city",
};

/** Страницы со своим маршрутом (не ChannelPage): вид и город. */
export const pageVisuals: Record<string, { kind: HeroVisualKind; city?: string }> = {
  "/marketingovoe-agentstvo-astana": { kind: "leadgen", city: "Астана" },
};

const SEO_DISCLAIMER = "Схема, не прогноз: позиций не обещаем.";
const ADS_DISCLAIMER = "Иллюстрация кабинета, не данные клиента.";
const WEB_DISCLAIMER = "Иллюстрация, не данные клиента.";

const webKpi = {
  ways: { value: "3 способа", label: "форма, WhatsApp, звонок" },
  goals: { value: "до релиза", label: "цели в аналитике" },
};

/** Копирайт рамки по виду. Карточка - по странице (visualFloats). */
export const visualCopy: Record<HeroVisualKind, Omit<VisualCopy, "float">> = {
  seo: {
    title: "Органическая выдача",
    meta: "без оплаты за клик",
    label: "Схема: сайт поднимается в органической выдаче и получает заявки без оплаты за клик",
    query: "ремонт квартир под ключ",
    kpis: [
      { value: "с 3-4 мес", label: "рост заявок из поиска" },
      { value: "0 ₸", label: "за клик из поиска" },
    ],
    disclaimer: SEO_DISCLAIMER,
  },
  "seo-city": {
    title: "Органическая выдача",
    label: "Схема: сайт поднимается в выдаче по запросам города и получает заявки без оплаты за клик",
    query: "ремонт квартир",
    kpis: [
      { value: "с 3-4 мес", label: "рост заявок из поиска" },
      { value: "0 ₸", label: "за клик из поиска" },
    ],
    disclaimer: SEO_DISCLAIMER,
  },
  "seo-regions": {
    title: "Органическая выдача",
    meta: "регионы по очереди",
    label: "Схема: сайт поднимается в выдаче регион за регионом на одном домене",
    query: "ремонт квартир под ключ",
    kpis: [
      { value: "3-4 нед.", label: "на первый регион" },
      { value: "1 домен", label: "страницы по регионам" },
    ],
    disclaimer: SEO_DISCLAIMER,
  },
  "seo-store": {
    title: "Каталог в поиске",
    meta: "категории и карточки",
    label: "Схема: категория магазина поднимается в выдаче и получает заказы без оплаты за клик",
    query: "кроссовки для бега мужские",
    kpis: [
      { value: "с 3-4 мес", label: "рост заказов из поиска" },
      { value: "0 ₸", label: "за клик из поиска" },
    ],
    disclaimer: SEO_DISCLAIMER,
  },
  context: {
    title: "Google Ads · кабинет",
    meta: "неделя 1",
    label: "Схема: объявление в Google над выдачей, клик и заявка с понятной ценой",
    query: "ремонт квартир цена",
    kpis: [
      { value: "3-5 дней", label: "до первых показов" },
      { value: "3-6 нед.", label: "стабильная цена заявки" },
    ],
    disclaimer: ADS_DISCLAIMER,
  },
  "context-city": {
    title: "Зона показов",
    label:
      "Схема: объявление видят только в зоне показов - районы города выбраны списком, остальные закрыты радиусом вокруг точки",
    query: "ремонт квартир",
    kpis: [
      { value: "3-5 дней", label: "до первых показов" },
      { value: "3-6 нед.", label: "стабильная цена заявки" },
    ],
    disclaimer: "Схема, не карта: границы районов условные.",
  },
  "google-ads": {
    title: "Структура аккаунта",
    meta: "Google Ads",
    label:
      "Схема: аккаунт Google Ads - кампании и группы с типами соответствия, минус-слова и основные конверсии, по которым считается заявка",
    kpis: [
      { value: "3-5 дней", label: "от брифа до показов" },
      { value: "2-4 нед.", label: "первые выводы по цене" },
    ],
    disclaimer: ADS_DISCLAIMER,
  },
  "yandex-direct": {
    title: "Яндекс Директ",
    meta: "поиск и сеть врозь",
    label:
      "Схема: поиск и рекламная сеть Яндекса - разные кампании со своей ценой обращения, минус-площадки и цели в Метрике",
    kpis: [
      { value: "3-5 дней", label: "до первых показов" },
      { value: "2-4 нед.", label: "понятная цена обращения" },
    ],
    disclaimer: ADS_DISCLAIMER,
  },
  web: {
    title: "Сайт под заявки",
    meta: "сначала телефон",
    label: "Схема: сайт на телефоне ведёт к форме, WhatsApp или звонку, заявка видна в аналитике",
    kpis: [webKpi.ways, webKpi.goals],
    disclaimer: WEB_DISCLAIMER,
  },
  "web-city": {
    title: "Сайт под заявки",
    label: "Схема: сайт на телефоне ведёт к форме, WhatsApp или звонку, заявка видна в аналитике",
    kpis: [webKpi.ways, webKpi.goals],
    disclaimer: WEB_DISCLAIMER,
  },
  landing: {
    title: "Лендинг под заявки",
    meta: "одно действие",
    label: "Схема: лендинг на телефоне ведёт посетителя к одному действию - заявке",
    kpis: [{ value: "2-3 дня", label: "прототип" }, webKpi.goals],
    disclaimer: WEB_DISCLAIMER,
  },
  corporate: {
    title: "Корпоративный сайт",
    meta: "страницы направлений",
    label: "Схема: корпоративный сайт ведёт к заявке со страницы каждого направления",
    kpis: [{ value: "4-6 нед.", label: "сайт под ключ" }, webKpi.goals],
    disclaimer: WEB_DISCLAIMER,
  },
  ecommerce: {
    title: "Интернет-магазин",
    meta: "каталог → заказ",
    label: "Схема: магазин на телефоне ведёт от каталога к оформленному заказу",
    kpis: [{ value: "прототип", label: "в первые недели" }, webKpi.goals],
    disclaimer: WEB_DISCLAIMER,
  },
  leadgen: {
    title: "Система заявок",
    meta: "один отчёт",
    label: "Схема: реклама и SEO приводят людей на сайт, сайт превращает их в заявки, цена каждой видна в отчёте",
    kpis: [
      { value: "1 отчёт", label: "цена заявки по каналам" },
      { value: "6-12 мес", label: "до устойчивого потока" },
    ],
    disclaimer: "Схема системы.",
  },
};

const sos = (value: string, note: string): VisualFloat => ({ case: "SOS Moving", value, note });
const kredit = (value: string, note: string): VisualFloat => ({ case: "1kredit.kz", value, note });
const resort = (value: string, note: string): VisualFloat => ({ case: "Горнолыжный курорт", value, note });
const objectFirst = (value: string, note: string): VisualFloat => ({ case: "Object First", value, note });

/** Карточка по пути страницы. Цифры - дословно из кейсов, показанных на ней. */
export const visualFloats: Record<string, VisualFloat | null> = {
  "/services/seo": sos("196 → 546", "кликов из поиска в месяц"),
  "/services/context": kredit("~$7,6", "цена заявки"),
  "/services/web": kredit("25%", "визитов → заявка"),
  "/services/leadgen": kredit("1 265", "заявок за 11 месяцев"),
  "/services/seo/prodvizhenie-saitov-almaty": sos("196 → 546", "переходов из органики в месяц"),
  "/services/seo/prodvizhenie-saitov-astana": sos("×2,8", "кликов из поиска за 10 месяцев"),
  "/services/seo/prodvizhenie-saitov-kazakhstan": {
    case: "AK Cabinet Craft",
    value: "39 → 232",
    note: "кликов из органики в месяц",
  },
  "/services/seo/prodvizhenie-internet-magazina": sos("196 → 546", "кликов из поиска в месяц"),
  "/services/context/kontekstnaya-reklama-almaty": resort("104", "обращения за неделю"),
  "/services/context/kontekstnaya-reklama-astana": kredit("~$7,6", "цена обращения"),
  "/services/context/nastroika-google-ads": resort("$3,37", "цена обращения"),
  "/services/context/nastroika-yandex-direct": kredit("~$7,6", "цена заявки в Google Ads"),
  "/services/web/sozdanie-lendinga": objectFirst("50+", "лендингов на 6 языках"),
  "/services/web/sozdanie-lendinga-almaty": kredit("25%", "визитов → заявка"),
  "/services/web/sozdanie-lendinga-astana": objectFirst("50+", "страниц на 6 языках"),
  "/services/web/sozdanie-korporativnogo-saita": kredit("1 265", "заявок за 11 месяцев"),
  "/services/web/sozdanie-internet-magazina": null,
  "/services/web/sozdanie-internet-magazina-almaty": null,
  "/services/web/sozdanie-saitov-almaty": resort("93%", "визитов с телефонов"),
  "/services/web/sozdanie-saitov-astana": kredit("1 265", "обращений за 11 месяцев"),
  "/services/web/sozdanie-saitov-shymkent": resort("18 из 104", "обращений пришли формой"),
  "/marketingovoe-agentstvo-astana": kredit("1 265", "заявок за 11 месяцев"),
};

/** KPI страниц, у которых факты отличаются от вида. */
export const visualKpis: Record<string, VisualCopy["kpis"]> = {
  "/marketingovoe-agentstvo-astana": [
    { value: "еженедельно", label: "разбор по заявкам" },
    { value: "1 отчёт", label: "цена заявки по каналам" },
  ],
};

/** Сцены страниц вне услуг. */
export const pageCopy: Record<"contacts" | "cases", VisualCopy> = {
  contacts: {
    title: "После заявки",
    meta: "без обязательств",
    label: "Схема первых шагов после заявки: ответ, бесплатный аудит, план и смета",
    kpis: [
      { value: "1 день", label: "ответ в рабочий день" },
      { value: "бесплатно", label: "аудит и план" },
    ],
    disclaimer: "Иллюстрация: так выглядят первые шаги.",
  },
  cases: {
    title: "Результаты клиентов",
    meta: "из кейсов ниже",
    label: "Три результата из реальных кейсов: 1kredit.kz, SOS Moving и горнолыжный курорт",
    disclaimer: "Цифры - из кейсов 1kredit.kz, SOS Moving и горнолыжного курорта, графики схематичные.",
  },
};
