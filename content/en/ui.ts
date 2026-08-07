import type { UiDict } from "../types";

/** Мета EN-версии: дефолтные title/description корневого layout'а и JSON-LD. */
export const siteMetaEn = {
  title: "Marketing agency in Kazakhstan for global clients | Bankai",
  description:
    "Kazakhstan-based marketing agency: website, SEO and paid search as one lead generation system. Senior team in Almaty, clients in the US, Europe and Kazakhstan.",
};

/**
 * EN-строки обвязки (Header, Footer, ContactForm, FloatingCta, карточки кейсов).
 * EN-версия - выжимка: страницы только /en, /en/cases, /en/cases/[slug],
 * /en/contacts, /en/privacy, /en/terms. Ссылок на RU-разделы здесь быть не должно.
 */
export const uiEn: UiDict = {
  locale: "en",
  home: "/en",
  tagline: "Leads, not reports",
  nav: [
    { label: "Cases", href: "/en/cases" },
    { label: "Contacts", href: "/en/contacts" },
  ],
  headerCta: { label: "Get a free audit", href: "/en/contacts" },
  menuLabel: "Menu",
  footer: {
    slogan: "Clients come to you - growth stops being a guessing game",
    description:
      "Marketing agency based in Almaty, Kazakhstan. Website, SEO and paid search run as one system, measured in leads and revenue. We work with clients in the US, Europe and Kazakhstan.",
    columns: [
      {
        title: "Company",
        links: [
          { label: "Cases", href: "/en/cases" },
          { label: "Contacts", href: "/en/contacts" },
        ],
      },
    ],
    contactsTitle: "Contacts",
    city: "Almaty, Kazakhstan",
    legal: [
      { label: "Privacy Policy", href: "/en/privacy" },
      { label: "Terms of Use", href: "/en/terms" },
    ],
  },
  floatingCta: {
    eyebrow: "Free audit · 1-3 days",
    title: "We show you where your leads leak - in numbers",
    items: [
      "Where your site and ads lose leads - and what it costs you",
      "Your real cost per lead and return on ad spend",
      "A plan to get more clients - or an honest no, if you don't need one",
    ],
    closeLabel: "Close",
    hiddenOn: ["/en/contacts", "/en/privacy", "/en/terms"],
  },
  form: {
    services: [
      "Full-cycle lead generation",
      "SEO",
      "Paid search",
      "Website development",
      "Not sure yet",
    ],
    serviceLabel: "What you need",
    nameLabel: "Name",
    namePlaceholder: "How should we address you",
    nameError: "Enter your name",
    contactLabel: "Contact",
    contactPlaceholder: "Email, Telegram or phone",
    contactError: "Enter a way to reach you",
    nicheLabel: "Industry",
    nichePlaceholder: "What your business does",
    revenueLabel: "Monthly revenue",
    revenuePlaceholder: "A rough figure",
    commentLabel: "Comment",
    commentPlaceholder: "Your goal, website link, what you have tried",
    optional: "- optional",
    formError: "Fill in the required fields above.",
    sendError: "Could not send. Try again or message us on Telegram.",
    submit: "Send request",
    submitting: "Sending…",
    consent: "By sending this form you agree to our",
    consentLink: "privacy policy",
    consentAfter: ".",
    privacyHref: "/en/privacy",
    successTitle: "Request sent",
    successText:
      "Thanks. We reply within one business day - usually sooner. If it is urgent, message us on Telegram.",
  },
  cases: {
    /* Данные кейсов остаются на CaseChannel («SEO» | «Контекст» | «Сайт»), переводим только подпись. */
    channels: { SEO: "SEO", Контекст: "PPC", Сайт: "Web" },
    href: "/en/cases",
    allCases: "All cases",
    moreCases: "More cases →",
    empty: "No cases in this channel yet.",
    template: "Sample",
    inProgress: "In progress",
    viewCase: "View case",
  },
};
