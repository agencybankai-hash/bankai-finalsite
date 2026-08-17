/** Локаль сайта. RU - основная версия, EN - выжимка на /en. */
export type Locale = "ru" | "en";

export type NavItem = { label: string; href: string; children?: NavItem[] };
export type Cta = { label: string; href: string };
export type StatItem = { value: string; label: string };
export type Step = { n: string; title: string; text: string; duration?: string };
export type ServicePlan = {
  name: string;
  price: string;
  sub?: string;
  includes: string[];
  featured?: boolean;
};
export type FaqItem = { q: string; a: string };
export type Feature = {
  title: string;
  text: string;
  details?: string;
  /** ключ иконки (см. components/ui/Icon) для icon-бейджа карточки */
  icon?: string;
};

/** Клиент для логотипной полосы. logo - путь к файлу (если есть), иначе wordmark-плейсхолдер; nda - показывать обезличенным. */
export type ClientLogo = { name: string; logo?: string; nda?: boolean };

export type Testimonial = {
  quote: string;
  author: string;
  role: string;
  company?: string;
};

export type ServiceChannel = {
  slug: string;
  navLabel: string;
  title: string;
  hero: { title: string; subtitle: string };
  badges?: string[];
  metaphor?: string;
  audience: string[];
  problem: { title: string; items: string[] };
  includes: Feature[];
  process: Step[];
  funnel: {
    title: string;
    lead: string;
    chain: StatItem[];
    note: string;
  };
  pricing: { value: string; sub: string; note?: string };
  plans?: ServicePlan[];
  faq: FaqItem[];
  partOfSystem: string;
};

/**
 * «Спутниковая» посадочная под НЧ-запрос внутри канала
 * (`/services/{channel}/{slug}`). Всё, чего в лендинге нет, наследуется от
 * родительского канала: состав работ, процесс, воронка, тарифы, кейсы.
 */
export type ServiceLanding = {
  slug: string;
  channel: "seo" | "context" | "web";
  /** Полный путь страницы, напр. "/services/seo/prodvizhenie-saitov-almaty". */
  path: string;
  /** meta title: ключ + гео, не слоган. */
  title: string;
  /** meta description. */
  description: string;
  hero: { title: string; subtitle: string };
  /**
   * Ключевая фраза лендинга в падежах - вместо channelForms в H2:
   * «Что входит в {acc}», «Стоимость {gen}», «Частые вопросы о {prep}».
   * Гео входит в фразу: acc «продвижение сайтов в Алматы».
   */
  keyPhrase: {
    acc: string;
    gen: string;
    prep: string;
    /** Готовая фраза для H2 процесса «Как мы {process}»; по умолчанию «ведём {acc}». */
    process?: string;
  };
  /** Абзац под hero - прямой ответ на запрос. */
  intro?: string;
  /** Ответный блок: структурированный ответ (этапы + сроки + цена) под AI Overview. */
  answer: {
    title: string;
    lead?: string;
    steps: { title: string; text: string }[];
    timeline?: string;
    /** Значение без «от»: «250 000 ₸/мес». */
    priceFrom?: string;
  };
  /** Своё «кому подходит»; не задано - берётся от канала. */
  audience?: string[];
  /** Своё «кому не подойдёт»; не задано - блок канала. */
  problem?: { title: string; items: string[] };
  faq: FaqItem[];
  /** Приписка к блоку тарифов канала. */
  pricingNote?: string;
  /** Слаги смежных лендингов для перелинковки. */
  related?: string[];
};

/** Бесплатный бонус внутри гайда (скачиваемый чек-лист). */
export type GuideBonus = {
  title: string;
  lead: string;
  bullets: string[];
  /** путь к файлу в /public, напр. "/guides/bankai-seo-checklist.pdf" */
  file: string;
};

/**
 * Гайд-лонгрид. Тело хранится в markdown-файле (`file`) и рендерится на странице;
 * здесь — метаданные и гейтнутый бонус. Один кластер контента = один гайд.
 */
export type Guide = {
  slug: string;
  title: string;
  description: string;
  badge?: string;
  /** имя md-файла внутри content/guides/, напр. "seo-guide.md" */
  file: string;
  bonus: GuideBonus;
};

export type CaseChannel = "SEO" | "Контекст" | "Сайт";

/** Метрика результата. Если заданы before/after — рендерим «до → после». */
export type CaseMetric = {
  value?: string;
  label: string;
  before?: string;
  after?: string;
  note?: string;
};
export type CaseResultGroup = { group: string; items: CaseMetric[] };

/** Блок работы по каналу. why — логика решения («почему так»). */
export type CaseWorkBlock = { channel: string; points: string[]; why?: string };

export type CaseStudy = {
  slug: string;
  client: string;
  industry: string;
  geo: string;
  size: string;
  channels: CaseChannel[];
  teaser: string;
  cardMetrics: StatItem[];
  challenge: string;
  strategy: string;
  work: CaseWorkBlock[];
  results: CaseResultGroup[];
  testimonial?: Testimonial;

  /* --- Сильные приёмы подачи (опционально) --- */
  /** Образец-шаблон, а не реальный клиент. */
  template?: boolean;
  /** Проект в работе: бейдж «В работе», результаты — заглушка до завершения. */
  inProgress?: boolean;
  /** Квантифицированный заголовок-результат (хук). */
  headline?: string;
  /** Срок проекта. */
  timeframe?: string;
  /** Диагностика «Что было плохо» до старта работ. */
  diagnosis?: { title?: string; items: string[] };
  /** Реформулирующий тезис-инсайт. */
  thesis?: { label?: string; text: string };
  /** Честность: что не сработало и риски. */
  honesty?: { title?: string; items: string[] };
  /** Вывод / что дальше. */
  conclusion?: string;
  /** Ключ оригинального мок-визуала (иллюстрация результата, не реальный скриншот). */
  visual?: "seo" | "context" | "web" | "combined";
};

/* ─────────────────────────  UI-словарь локали  ───────────────────────── */

export type UiFooterColumn = { title: string; links: Cta[] };

/**
 * Строки «обвязки» (Header, Footer, ContactForm, FloatingCta, карточки кейсов).
 * Реализации: `content/ui.ts` (ru) и `content/en/ui.ts` (en); резолвер - `ui(locale)`.
 */
export type UiDict = {
  locale: Locale;
  /** Корень локали: "/" для ru, "/en" для en - ссылка логотипа и точка отсчёта активного пункта. */
  home: string;
  /** Подпись рядом с логотипом. */
  tagline: string;
  nav: NavItem[];
  headerCta: Cta;
  /** aria-label бургера. */
  menuLabel: string;
  footer: {
    slogan: string;
    description: string;
    columns: UiFooterColumn[];
    contactsTitle: string;
    city: string;
    legal: Cta[];
  };
  floatingCta: {
    eyebrow: string;
    title: string;
    items: string[];
    closeLabel: string;
    /** Префиксы путей, где плавающий CTA избыточен. */
    hiddenOn: string[];
  };
  form: {
    services: string[];
    serviceLabel: string;
    nameLabel: string;
    namePlaceholder: string;
    nameError: string;
    contactLabel: string;
    contactPlaceholder: string;
    contactError: string;
    nicheLabel: string;
    nichePlaceholder: string;
    revenueLabel: string;
    revenuePlaceholder: string;
    commentLabel: string;
    commentPlaceholder: string;
    /** Пометка необязательного поля. */
    optional: string;
    formError: string;
    sendError: string;
    submit: string;
    submitting: string;
    /** Согласие: текст до ссылки, текст ссылки, хвост после. */
    consent: string;
    consentLink: string;
    consentAfter: string;
    privacyHref: string;
    successTitle: string;
    successText: string;
  };
  cases: {
    /** Лейблы каналов: данные (CaseChannel) не переводим, переводим подпись. */
    channels: Record<CaseChannel, string>;
    /** Базовый путь листинга: "/cases" | "/en/cases". */
    href: string;
    allCases: string;
    moreCases: string;
    empty: string;
    inProgress: string;
    viewCase: string;
  };
};
