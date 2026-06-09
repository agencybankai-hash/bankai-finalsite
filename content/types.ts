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
