import type { CaseStudy, ClientLogo, Cta, Feature, StatItem } from "../types";
import { clients as clientsRu } from "../site";
import { getCase } from "../cases";

/**
 * EN-контент главной (/en). Выжимка RU-главной под позиционирование
 * «Kazakhstan-based agency for global clients»: senior-команда из Алматы,
 * реальные US/EU-кейсы, честность, выгодная экономика - без тона дешёвого
 * аутсорса. Молочной метафоры здесь нет (непереводима) - вместо неё
 * короткий блок «Website, SEO and ads as one system».
 *
 * Деньги: на EN только реально существующая цифра «From $3,000» за
 * разработку сайтов. Тенге и выдуманных цен здесь быть не должно.
 */

export const heroEn = {
  title: "Marketing agency in Kazakhstan - lead generation for global clients",
  subtitle:
    "We bring you clients instead of writing reports. Website, SEO and paid search run as one system: you see what every lead costs and what the budget returns.",
  badge: "SEO · PPC · Web",
  ctaPrimary: { label: "Get a free audit", href: "/en/contacts" } as Cta,
  ctaSecondary: { label: "See our work", href: "/en/cases" } as Cta,
  badges: [
    "Free audit in 1-3 days",
    "Contract with measurable KPIs",
    "9+ years in the market",
  ],
  note: "Based in Almaty - we run projects for clients in the US, Europe and Kazakhstan.",
};

/* Логотипы те же, что на RU (файлы в /public/logos) - переводим только подпись. */
export const clientsEn: { caption: string; items: ClientLogo[] } = {
  caption: "Trusted by brands in the US, Europe and Kazakhstan",
  items: clientsRu.items,
};

export const trustStatsEn: StatItem[] = [
  { value: "50+", label: "projects launched" },
  { value: "$14.6M", label: "in client sales" },
  { value: "up to 5.2x", label: "ROAS on projects" },
  { value: "-40%", label: "peak drop in cost per lead" },
];

export const systemEn: { eyebrow: string; title: string; lead: string; items: Feature[] } = {
  eyebrow: "How it works",
  title: "Website, SEO and ads as one system",
  lead:
    "Three tools pointed at one goal - leads. Paid search picks up demand that already exists, SEO builds a flow that lasts, and the website turns both into requests.",
  items: [
    {
      title: "Paid search",
      icon: "target",
      text: "Google Ads delivers qualified leads within the first weeks, with bids set against your unit economics.",
    },
    {
      title: "SEO",
      icon: "search",
      text: "Organic demand that compounds: the flow grows over time and does not stop when the ad budget does.",
    },
    {
      title: "Website",
      icon: "window",
      text: "Speed, structure, forms and landing pages per source - so paid and organic traffic becomes leads instead of visits.",
    },
  ],
};

/**
 * Карточки услуг. EN-версия посадочных под каналы не имеет, поэтому карточки
 * без ссылок; общий CTA ведёт на /en/contacts. Цена только там, где она
 * реально есть.
 */
export type ServiceCardEn = {
  title: string;
  text: string;
  icon: Feature["icon"];
  bullets: string[];
  /** Нижняя строка карточки: реальная цена или формат работы. */
  terms: string;
};

export const servicesEn: {
  eyebrow: string;
  title: string;
  lead: string;
  cards: ServiceCardEn[];
  cta: Cta;
} = {
  eyebrow: "Services",
  title: "Three channels of one system",
  lead:
    "Start with the whole system or with a single channel - either way we work against leads and revenue, not rankings and clicks.",
  cards: [
    {
      title: "SEO",
      icon: "search",
      text: "Organic search demand that compounds and drives the cost per lead down over time.",
      bullets: [
        "Keyword research, technical audit and content",
        "Off-page and local SEO",
        "Reporting on rankings, leads and revenue",
      ],
      terms: "Monthly retainer",
    },
    {
      title: "Paid search",
      icon: "target",
      text: "Managed leads from Google Ads, priced against the economics of your business.",
      bullets: [
        "Campaign structure and launch",
        "Bid and cost-per-lead management",
        "Analytics from click to closed deal",
      ],
      terms: "Monthly retainer",
    },
    {
      title: "Web development",
      icon: "window",
      text: "A site built to convert the traffic you already pay for - the cheapest growth you own.",
      bullets: [
        "Landing pages and websites built for conversion",
        "Speed and mobile experience",
        "Forms, goals and CRM integration",
      ],
      terms: "From $3,000",
    },
  ],
  cta: { label: "Discuss your project", href: "/en/contacts" },
};

export const whyKzEn: { eyebrow: string; title: string; lead: string; items: Feature[] } = {
  eyebrow: "Why Kazakhstan",
  title: "A senior team in Almaty, working on Western markets",
  lead:
    "We are not an offshore back office. You work directly with the people who run your account - and pay for their time, not for an agency's overhead.",
  items: [
    {
      title: "Senior team, no hand-off",
      icon: "users",
      text: "Five specialists in Almaty: strategy, SEO, paid search, development and analytics. The people you meet on the call are the people doing the work.",
    },
    {
      title: "US and EU track record",
      icon: "trending",
      text: "Two years as the embedded web team for a US B2B SaaS vendor, SEO and paid search for service businesses in Los Angeles, brand sites for international groups.",
    },
    {
      title: "Western standards, better economics",
      icon: "gauge",
      text: "You get a senior team at a rate US and EU agencies cannot match. The difference comes from where we are based, not from cutting scope or seniority.",
    },
    {
      title: "Time zones that cover the day",
      icon: "spark",
      text: "Almaty is UTC+5. Europe overlaps for most of the working day; for the US we hold an evening window and hand work over async - your night is our working day.",
    },
  ],
};

/* ─────────────────────────  Кейсы-превью  ─────────────────────────
   Реальные кейсы из content/cases.ts: цифры не трогаем, переводим только
   поля карточки. Так превью не расходится с данными и не дублирует их. */

const enCaseCard = (
  slug: string,
  patch: Pick<CaseStudy, "industry" | "geo" | "teaser" | "cardMetrics">,
): CaseStudy => {
  const base = getCase(slug);
  if (!base) throw new Error(`EN case preview: unknown case "${slug}"`);
  return { ...base, ...patch };
};

export const casesPreviewEn: {
  eyebrow: string;
  title: string;
  lead: string;
  items: CaseStudy[];
} = {
  eyebrow: "Cases",
  title: "What the work turns into",
  lead:
    "Projects in the US, Europe, Kazakhstan and Mongolia. The numbers below come from client analytics and CRM; part of our portfolio is under NDA and shown on a call.",
  items: [
    enCaseCard("object-first", {
      industry: "B2B SaaS · data protection (Veeam ecosystem)",
      geo: "US + EU",
      teaser:
        "For two years we ran the entire landing infrastructure behind Object First's paid traffic, webinars and content - 50+ pages in 6 languages, layered bot protection and end-to-end tracking - until Veeam acquired the company in January 2026.",
      cardMetrics: [
        { value: "+291%", label: "client bookings YoY (Q3 2025)" },
        { value: "Veeam", label: "exit - acquired in January 2026" },
      ],
    }),
    enCaseCard("sos-moving", {
      industry: "Logistics · moving services",
      geo: "US · Los Angeles, California",
      teaser:
        "Rebuilt the website around SEO and launched search marketing with AI-search optimization (GEO). In about 10 months organic went from 196 to 546 clicks per month, average position from 33 to 18.4, and search brought $652K in closed orders according to CRM data.",
      cardMetrics: [
        { value: "$652K", label: "revenue from organic search" },
        { value: "60 → 91", label: "orders per month" },
      ],
    }),
    enCaseCard("green-moving", {
      industry: "Services · moving",
      geo: "US · Los Angeles",
      teaser:
        "A new moving company in Los Angeles on a brand-new domain: we built the website and launched marketing from scratch - Google Ads for immediate leads, SEO for a channel that lasts. Organic is growing from zero while ads ramp up.",
      cardMetrics: [
        { value: "1 → 44", label: "organic clicks per month" },
        { value: "Web + Ads + SEO", label: "marketing in progress" },
      ],
    }),
  ],
};

export const finalCtaEn = {
  title: "Want to choose your clients instead of chasing them?",
  lead:
    "When leads come in steadily, you plan growth and work with the clients you want. The first step is seeing where you lose them today: we show it on your own numbers and lay out a plan for a steady flow of leads. The audit is free and comes with no obligations.",
  cta: { label: "Get a free audit", href: "/en/contacts" } as Cta,
};
