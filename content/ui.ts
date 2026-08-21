import type { Cta, Locale, UiDict } from "./types";
import {
  contacts,
  floatingCta,
  headerCta,
  legalLinks,
  nav,
  serviceChannelsNav,
  siteMeta,
  slogan,
} from "./site";
import { landings } from "./landings";
import { uiEn } from "./en/ui";

/* Сквозной футерный анкор ведёт на посадочную лидогенерации, а не на «/»:
   у главной свои анкоры (логотип, хлебные крошки), а лендингу нужен ключ. */
const leadgen = landings.find((l) => l.slug === "lidogeneraciya-almaty");
const leadgenLink: Cta[] = leadgen
  ? [{ label: leadgen.hero.title, href: leadgen.path }]
  : [];

/** RU-строки обвязки: ровно то, что раньше было хардкодом в компонентах. */
export const uiRu: UiDict = {
  locale: "ru",
  home: "/",
  tagline: siteMeta.tagline,
  nav,
  headerCta,
  menuLabel: "Меню",
  footer: {
    slogan,
    description: siteMeta.description,
    columns: [
      {
        title: "Услуги",
        links: [
          ...serviceChannelsNav.map((n) => ({ label: n.label, href: n.href })),
          ...leadgenLink,
        ],
      },
      {
        title: "Компания",
        links: [
          { label: "Кейсы", href: "/cases" },
          { label: "Гайды", href: "/guides" },
          { label: "О нас", href: "/about" },
          { label: "Контакты", href: "/contacts" },
        ],
      },
    ],
    contactsTitle: "Контакты",
    city: contacts.city,
    legal: legalLinks,
  },
  floatingCta: {
    eyebrow: floatingCta.eyebrow,
    title: floatingCta.title,
    items: floatingCta.items,
    closeLabel: "Закрыть",
    hiddenOn: ["/contacts", "/privacy", "/terms"],
  },
  form: {
    services: [
      "Лидогенерация под ключ",
      "SEO-продвижение",
      "Контекстная реклама",
      "Разработка сайта",
      "Пока не определился",
    ],
    serviceLabel: "Что интересует",
    nameLabel: "Имя",
    namePlaceholder: "Как к вам обращаться",
    nameError: "Укажите имя",
    contactLabel: "Контакт",
    contactPlaceholder: "Telegram, email или телефон",
    contactError: "Укажите способ связи",
    nicheLabel: "Ниша",
    nichePlaceholder: "Чем занимается бизнес",
    revenueLabel: "Оборот в месяц",
    revenuePlaceholder: "Ориентировочно",
    commentLabel: "Комментарий",
    commentPlaceholder: "Задача, ссылка на сайт, что уже пробовали",
    optional: "— необязательно",
    formError: "Заполните обязательные поля выше.",
    sendError: "Не удалось отправить. Попробуйте ещё раз или напишите в Telegram.",
    submit: "Отправить заявку",
    submitting: "Отправляем…",
    consent: "Нажимая кнопку, вы соглашаетесь с",
    consentLink: "политикой конфиденциальности",
    consentAfter: ".",
    privacyHref: "/privacy",
    successTitle: "Заявка отправлена",
    successText:
      "Спасибо. Свяжемся в течение рабочего дня - обычно быстрее. Если срочно, напишите в Telegram.",
  },
  cases: {
    channels: { SEO: "SEO", Контекст: "Контекст", Сайт: "Сайт" },
    href: "/cases",
    allCases: "Все кейсы",
    moreCases: "Больше кейсов →",
    empty: "По этому каналу кейсов пока нет.",
    inProgress: "В работе",
    viewCase: "Смотреть кейс",
  },
};

const dicts: Record<Locale, UiDict> = { ru: uiRu, en: uiEn };

/** Словарь обвязки под локаль. Дефолт - ru, чтобы RU-рендер не менялся. */
export function ui(locale: Locale = "ru"): UiDict {
  return dicts[locale];
}
