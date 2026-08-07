import type { CaseStudy, StatItem } from "../types";

/*
  EN-выжимка портфолио: 6 кейсов, убедительных для global-аудитории.
  Слаги совпадают с RU (/en/cases/{slug} зеркалит /cases/{slug}), цифры и факты
  переведены 1:1 - без приукрашивания. Отзыв переводим только реальный
  (у Object First); плейсхолдеры [..] из RU на EN не выносим.
  Валюта: тенге на EN не показываем - в $ переводим только там, где $-эквивалент
  уже есть в RU-версии; безвалютные соотношения (1:53) переносим как есть.
*/

export const casesEn: CaseStudy[] = [
  {
    slug: "object-first",
    client: "Object First",
    industry: "B2B SaaS · data protection (Veeam ecosystem)",
    geo: "United States + EU",
    size: "Embedded web team on retainer",
    channels: ["Сайт"],
    timeframe: "June 2024 - January 2026 (~2 years)",
    headline:
      "External web team for the vendor: 50+ landing pages in 6 languages, layered bot protection on every form and +291% bookings YoY - up to January 2026, when Veeam acquired the company",
    teaser:
      "For two years we ran the entire landing page infrastructure behind Object First's paid traffic, webinars and content - up to January 2026, when the company was acquired by Veeam.",
    cardMetrics: [
      { value: "+291%", label: "client bookings growth YoY (Q3 2025)" },
      { value: "Veeam", label: "exit - acquired in January 2026" },
    ],
    challenge:
      "Object First was scaling demand fast through PPC, webinars and content, and the landing page infrastructure had to keep up: a new page for every campaign, in several languages, with clean lead hand-off to Salesforce and Pardot and correct attribution. At the same time the paid traffic problem of the security niche kept growing - bots and junk leads that burned budget and clogged the funnel.",
    diagnosis: {
      title: "Where leads and budget were lost",
      items: [
        "Every new landing page was built almost from scratch - slow campaign launches",
        "Paid traffic brought in a stream of junk leads from bots - money down the drain",
        "Marketing did not trust the numbers in the funnel",
        "Lead hand-off and click to lead to deal attribution were incomplete",
      ],
    },
    thesis: {
      text: "A landing page for paid traffic is not just a page. It is the first filter for lead quality and the one place where you cannot afford to lose a single submission.",
    },
    strategy:
      "We embedded as an external web team with steady capacity and a daily sync with the client's marketing and PPC teams. The point was not to ship a website but to keep a living conversion system running: a library of reusable components, one landing page template, layered lead protection and end-to-end tracking built into every page by default.",
    work: [
      {
        channel: "Landing pages",
        points: [
          "50+ pages: PPC landing pages, webinars (Monthly Product Demo), event registrations (VeeamON Tour), gated video, quizzes",
          "6 languages: EN / DE / FR / ES / IT / PT-BR",
          "One shared template plus a brand refresh across the whole library",
        ],
        why: "With one template a landing page ships in hours, so PPC launches campaigns without waiting on development.",
      },
      {
        channel: "Lead protection",
        points: [
          "Custom email OTP verification",
          "Honeypot traps: decoy fields, detection of submits that come in too fast",
          "Cloudflare Turnstile CAPTCHA and a block on loading the page in an iframe",
        ],
        why: "Junk leads from bots were the top priority for PPC. The layered defense cut the noise without hurting conversion for real users.",
      },
      {
        channel: "Integrations and tracking",
        points: [
          "Forms → Object First API → Salesforce + Pardot/Marketo",
          "Zoom for webinars; GTM events + GA4",
          "SegmentStream and cross-device attribution (e-hash)",
        ],
        why: "Marketing needs the full click to lead to deal picture and a clean nurture flow in Pardot - without it there is no revenue attribution.",
      },
      {
        channel: "Lead-gen tools",
        points: [
          "Quizzes built on InputFlow",
          "VMCE practice exam: 30 questions with result sharing to LinkedIn",
          "NIS2 and Ransomware Resilience quizzes",
        ],
        why: "An interactive step qualifies a lead better than a static form, and sharing to LinkedIn adds organic reach.",
      },
      {
        channel: "Reliability and performance",
        points: [
          "Form refactor: validation, debounce, timeouts, fallback when the CDN fails",
          "Core Web Vitals in the green",
          "Supply chain: third-party JS moved to controlled hosting",
        ],
        why: "A landing page is the entry point for paid traffic, so a broken form is a direct loss. Not a single registration gets lost.",
      },
    ],
    results: [
      {
        group: "Scope of work",
        items: [
          { value: "50+", label: "landing pages" },
          { value: "230+", label: "tasks in ~2 years" },
          { before: "1", after: "6", label: "localization languages" },
        ],
      },
      {
        group: "Lead quality",
        items: [
          { before: "none", after: "4 layers", label: "form protection against bots" },
          {
            value: "stream → clean",
            label: "junk leads filtered out without losing conversion",
          },
        ],
      },
      {
        group: "Business outcome",
        items: [
          { value: "+291%", label: "client bookings growth YoY (Q3 2025)" },
          { value: "EXIT", label: "acquired by Veeam, January 2026" },
        ],
      },
    ],
    honesty: {
      title: "What did not work and the risks",
      items: [
        "The 2FA pages became a target themselves: OTP cut the junk, but bots switched to attacking it, so we had to layer honeypots and CAPTCHA on top. Lead protection is a process, not a one-off feature.",
        "Dependency on third-party CDN libraries: after an incident that took the registration form down, we added timeouts and a fallback so an external failure cannot break conversion.",
        "Supply chain hygiene: third-party JS served from a public repository is a risk - we found it and moved it to controlled hosting.",
      ],
    },
    conclusion:
      "For two years we ran the whole conversion infrastructure of Object First - from landing pages in 6 languages to layered lead protection and end-to-end tracking. Over that period the client grew several times over (+291% YoY bookings, Q3 2025) and in January 2026 was acquired by Veeam, the global leader in data protection. For us it confirms the embedded web team model: not a one-off website, but a living system that keeps up with a fast-growing B2B marketing team.",
    testimonial: {
      quote:
        "The Bankai team just closes questions. We come in with something custom and they immediately suggest a better way to do it. That is why we have been working together for years now.",
      author: "Demand Generation team",
      role: "Object First",
    },
  },
  {
    slug: "sos-moving",
    client: "SOS Moving",
    industry: "Logistics · moving services",
    geo: "United States · Los Angeles, California",
    size: "Residential and commercial moving across Los Angeles and California",
    channels: ["Сайт", "SEO"],
    timeframe: "September 2025 - June 2026 (~10 months)",
    headline:
      "Website, SEO and GEO for a Los Angeles mover: organic search from 196 to 546 clicks a month, orders from 60 to 91 and $652K in closed revenue from search",
    teaser:
      "We rebuilt the website for SEO and launched search marketing together with AI search optimization (GEO). In about 10 months organic search grew from 196 to 546 clicks a month, the average position moved from 33 to 18.4, and search brought in $652K of closed orders according to CRM data.",
    cardMetrics: [
      { value: "$652K", label: "revenue from organic search" },
      { value: "60 → 91", label: "closed orders a month" },
    ],
    challenge:
      "The Los Angeles moving market is competitive and seasonal. Before the start, organic search brought almost no leads, the site was not built for conversion, and inquiries came in unevenly. The business needed a system that delivers a predictable flow from search, lowers acquisition cost and shows how many real orders organic actually brings.",
    strategy:
      "First we rebuilt the site with structure and content designed for SEO from the start: landing pages for services and Los Angeles neighborhoods, a fast quote request, and a technical base for speed and indexing. On that foundation we launched search marketing for steady demand plus GEO - optimization for the answers of AI assistants (ChatGPT, Gemini, AI Overviews). Everything was wired into CRM and end-to-end analytics, so the path from click to closed deal is visible.",
    work: [
      {
        channel: "Website",
        points: [
          "Landing pages for services and Los Angeles neighborhoods",
          "Fast online moving estimate and short forms",
          "Core Web Vitals, clean structure and Schema.org for indexing",
          "GA4, goals and call tracking - forms and calls tied to CRM",
        ],
        why: "The site was rebuilt for SEO and conversion at once: the faster the page and the closer the form sits to the answer, the more leads organic brings, and end-to-end analytics shows the revenue behind every channel.",
      },
      {
        channel: "SEO",
        points: [
          "Technical audit, keyword map for commercial and local demand",
          "Technical optimization, internal linking, Schema.org markup",
          "Landing page content matched to queries and intent",
          "Link building and local SEO: Google Business Profile, Google Maps, geo pages, review management",
        ],
        why: "Organic delivers a steady flow of leads cheaper than a paid click and does not depend on bids. Local SEO is what decides the movers near me niche.",
      },
      {
        channel: "GEO (AI search optimization)",
        points: [
          "Brand mentions on the sources AI cites: Reddit, Wikipedia, industry media, rankings",
          "Articles written for likely prompts and pushed to the top - a ready answer for AI assistants",
          "Ranking, comparison and FAQ content",
          "The brand as an entity: Wikidata and Knowledge Graph",
        ],
        why: "AI assistants increasingly answer instead of the results page. SEO and GEO reinforce each other: links, local work and Schema raise the odds of showing up in answers from ChatGPT, Gemini and AI Overviews.",
      },
    ],
    results: [
      {
        group: "Organic traffic",
        items: [
          { before: "196", after: "546", label: "clicks from search a month" },
          { before: "33", after: "18.4", label: "average position in Google" },
          { value: "3.7x", label: "growth in search impressions (132K → 487K/mo)" },
        ],
      },
      {
        group: "Orders and revenue",
        items: [
          { before: "60", after: "91", label: "closed orders a month" },
          { before: "$64,874", after: "$119,274", label: "revenue a month" },
          { value: "$652K", label: "revenue from organic over the period" },
        ],
      },
      {
        group: "AI search visibility (GEO)",
        items: [
          { value: "30/100", label: "AI Visibility, US (Semrush)" },
          { value: "186", label: "brand mentions in AI answers" },
          { value: "159", label: "pages cited in AI answers" },
        ],
      },
    ],
    honesty: {
      items: [
        "GEO is still early: AI Visibility sits at 30/100 - the base is in place (186 mentions, 159 cited pages), next we grow entity recognition and presence in AI answers",
        "Brand and local queries are already in the top 3 (sos moving - 2, sos moving llc - 1.1), while broad ones (movers, movers near me) sit on page 2-3 - that is the headroom",
        "Moving is a seasonal market: demand dips in summer, so we plan for it and fill the gap with off-season clusters",
      ],
    },
    conclusion:
      "The site and SEO work as one system: organic grew from 196 to 546 clicks a month, closed orders from 60 to 91, and search brought in $652K of revenue according to CRM data. Next step - grow GEO visibility and take the broad non-local queries.",
  },
  {
    slug: "1kredit-kz",
    client: "1kredit.kz - collateral lending",
    industry: "Fintech · microfinance, loans against property and cars",
    geo: "Kazakhstan · Almaty, Astana, Shymkent, Aktobe",
    size: "Lender with 15 years on the market · 8 branches in 4 cities · ~3,800 clients",
    channels: ["Контекст", "Сайт", "SEO"],
    timeframe: "August 2025 - June 2026 (11 months)",
    headline:
      "A lead channel built from zero: 1,265 applications at ~$7.60, CTR ~8.8% against a 2-5% niche benchmark - and $53 in loans issued for every $1 of ad spend",
    teaser:
      "We built the marketing channel for a collateral lender from scratch: Google Ads across 5 regions plus dedicated landing pages produced 1,265 applications at ~$7.60 each, with CTR 1.8-4.4 times above the benchmark for the niche. Most of the volume comes from property-backed loans; on the car-backed pilot we are already lifting the operational ceiling - CRM, automated scoring, automated collateral valuation and a bank statement parser are live, credit bureau integration is in testing, and the automation rolls out to every product next.",
    cardMetrics: [
      { value: "1:53", label: "ad spend → loans issued" },
      { value: "1,265", label: "applications from zero" },
    ],
    challenge:
      "The lender had spent 15 years on branches and word of mouth: there were no inbound leads from the internet, the website did not collect them, and no performance advertising existed for the product. On top of that everything was manual - a manager called the client, the client had to come to the office, credit bureau scoring and collateral valuation happened outside any system, at the manager's discretion. The job was to build a lead channel from zero and remove the operational ceiling in parallel.",
    diagnosis: {
      title: "Where loan volume was lost",
      items: [
        "Manual calls and a mandatory office visit - a long path from application to payout, with drop-off at every step",
        "Borrower scoring against the credit bureau and the state population register - separate requests outside the system, slow and without a standard",
        "Collateral valued at the manager's discretion, with no single rulebook and no scoring model",
        "No CRM: applications lived in spreadsheets and messengers, statuses and deal history got lost",
        "1C was isolated from the website and the ad accounts - there was no end-to-end view from lead to payout",
      ],
    },
    thesis: {
      text: "In lending, marketing brings the application, but the money is made by the speed of processing it. No matter how many leads you pour in, as long as a decision needs an office visit and manual scoring, the flow hits an operational ceiling. So first we prove and scale the channel, and in parallel we remove the ceiling with technology - on one product first, then on all of them.",
    },
    strategy:
      "We built and proved the marketing channel from zero: a corporate website, landing pages for the property-backed and car-backed products, and Google Ads Search across 5 regions, moving the site off Webflow onto a custom stack for full control over SEO factors. In parallel, on the car-backed pilot product, we deployed CRM, automated scoring, automated collateral valuation and a bank statement parser, and are testing credit bureau integration - to lift the operational ceiling and then roll the automation out across every product.",
    work: [
      {
        channel: "Paid search",
        points: [
          "Google Ads Search across 5 regions: Almaty, Astana, Shymkent, Aktobe and the surrounding areas",
          "Most of the campaign volume goes to property-backed loans; a separate Almaty - Car campaign covers car-backed loans",
          "Ads served only on collateral-specific queries - cutting off the flow of unsecured loan requests you would otherwise pay for",
          "Optimized for cost per application, not clicks: CPL ~$7.60, average landing page conversion into an application 25%",
        ],
        why: "Keeping traffic clean in this niche is hard: unsecured loan leads are everywhere and you pay for them. We show up only on collateral queries, which is why CTR runs above the 2-5% benchmark for the niche and the applications are ready to buy, converting at around 25%.",
      },
      {
        channel: "Website",
        points: [
          "Corporate website and landing pages built for the ad campaigns",
          "Migration from Webflow to a custom stack - full control over SEO factors and speed",
          "Structure and forms built around the collateral loan application",
        ],
        why: "Webflow limited control over the technical SEO base. A custom stack removes the ceiling on speed and ranking factors - for organic growth over the long run.",
      },
      {
        channel: "SEO",
        points: [
          "Started right after the site moved to the custom stack",
          "Automated article pipeline: query clustering in Serpstat → generation → publishing",
        ],
        why: "Paid search delivers applications immediately but gets more expensive as competition grows. Organic lowers the average cost per application over time and does not depend on bids, and the article pipeline scales coverage of the keyword space.",
      },
      {
        channel: "Fintech system (pilot on the car-backed product)",
        points: [
          "CRM as a single application pipeline: intake, statuses, deal management (live)",
          "Automated borrower scoring and automated collateral valuation (live)",
          "Bank statement parser for automatic income verification (live)",
          "Real-time credit bureau integration - in testing; export to 1C for the credit committee - next in line",
        ],
        why: "The car-backed product is the pilot where we test the automation and the integrations. The goal is a remote decision on an application and a rollout across every product of the lender, including property-backed loans.",
      },
    ],
    results: [
      {
        group: "Channel efficiency",
        items: [
          { value: "~8.8%", label: "CTR - benchmark for the niche is 2-5%" },
          { value: "25%", label: "average landing page conversion: visit → application" },
          { value: "~$7.60", label: "cost per application (CPL) in an expensive lending niche" },
        ],
      },
      {
        group: "Channel scale (from zero)",
        items: [
          { value: "1,265", label: "applications in 11 months - channel built from scratch" },
          { value: "~120/mo", label: "steady flow of applications" },
        ],
      },
      {
        group: "Business impact",
        items: [
          { value: "1:53", label: "$53 in loans issued for every $1 of ad spend" },
          { value: "~$935/mo", label: "advertising budget" },
        ],
      },
    ],
    honesty: {
      items: [
        "Most of the application volume comes from the property-backed product; car-backed is smaller and serves as the pilot for the fintech automation",
        "Part of the campaigns is capped by budget and ad moderation (limited by budget, ads disapproved) - there is headroom once those limits are lifted",
        "SEO started only after the site migration, so organic is still building up and paid search still carries the main flow",
        "The real ceiling right now is not marketing but manual processing: until the automation proven on the car-backed product is rolled out, volume on the rest is limited by the speed of manual scoring",
      ],
    },
    conclusion:
      "From zero we built a channel that brings the lender about 120 applications a month and returns $53 in loans issued for every $1 put into advertising, at a CTR 1.8-4.4 times above the benchmark for the niche. The automation is proven on the car-backed pilot - the next step is to roll it out across every product, including property-backed loans, and make the decision fully remote, with no office visit.",
  },
  {
    slug: "green-moving",
    client: "Green Moving",
    industry: "Services · moving",
    geo: "United States · Los Angeles",
    size: "Local moving company",
    channels: ["Сайт", "Контекст", "SEO"],
    timeframe: "Since October 2025 (marketing in progress)",
    headline:
      "Website built and marketing launched from zero: Google Ads for immediate leads plus SEO for a durable channel - organic from 1 to 44 clicks a month in the first 8 months",
    teaser:
      "A new moving company in Los Angeles got a website and a marketing launch: Google Ads for immediate leads and SEO for an organic channel. Organic is already growing from zero and the ads are picking up.",
    cardMetrics: [
      { value: "1 → 44", label: "organic clicks a month" },
      { value: "Website + Ads + SEO", label: "marketing in progress" },
    ],
    challenge:
      "A new business on a new domain with no history, in the competitive Los Angeles moving niche. We had to build the site from scratch and launch two channels: advertising for immediate leads and SEO for a durable organic flow.",
    strategy:
      "First we built a site for conversion and SEO, then launched Google Ads against local demand and started search marketing in parallel - from brand queries towards commercial ones. Ads bring leads right away; organic brings their cost down over the long run.",
    work: [
      {
        channel: "Website",
        points: [
          "Website built around services and Los Angeles neighborhoods",
          "Forms, fast estimate and capture points",
          "Technical base for SEO and speed",
        ],
        why: "The site is the foundation of both channels: ads and organic both lead to it, so it was built for conversion and SEO from day one.",
      },
      {
        channel: "Paid search",
        points: [
          "Google Ads against local Los Angeles demand",
          "End-to-end lead tracking",
          "Cost per lead optimization (in progress)",
        ],
        why: "Ads bring leads from day one while organic waits for the domain to age - that keeps the flow insured at launch.",
      },
      {
        channel: "SEO",
        points: [
          "Launch and indexing of the new site, keyword map for local demand",
          "Landing pages for services and neighborhoods, Schema.org",
          "Local SEO and link authority building",
        ],
        why: "A new domain needs the trust of search first. We move from brand queries to broad ones so the channel grows steadily.",
      },
    ],
    results: [
      {
        group: "Organic launch (from zero)",
        items: [
          { before: "1", after: "44", label: "organic clicks a month" },
          { before: "33", after: "21,837", label: "impressions a month" },
          { value: "249", label: "clicks from search in 8 months" },
        ],
      },
      {
        group: "Query positions",
        items: [
          { value: "4.9", label: "green moving company" },
          { value: "5.1", label: "greenmovers" },
          { value: "6.3", label: "go green moving" },
        ],
      },
      {
        group: "Advertising (in progress)",
        items: [
          { value: "Google Ads", label: "launched against local demand" },
          { value: "in progress", label: "numbers as the data accumulates" },
        ],
      },
    ],
    honesty: {
      items: [
        "The project is young: the average position across the whole keyword set is down (21 → 40) - that is the keyword map expanding, with search indexing new queries the site does not rank for yet. Normal at launch",
        "Marketing is in progress: paid search and SEO are still building up, and the ad numbers will be shown as the data accumulates",
        "The keyword set is still brand and near-brand; the broad commercial ones (moving company los angeles - 47.8) are still ahead",
      ],
    },
    conclusion:
      "The site is live and both channels are running. Next - scaling Google Ads and pushing SEO into the broad commercial queries of Los Angeles.",
  },
  {
    slug: "ak-cabinet-craft",
    client: "AK Cabinet Craft",
    industry: "Manufacturing · custom cabinetry",
    geo: "United States · Chicago",
    size: "Custom furniture maker: kitchens, closets, vanities",
    channels: ["SEO"],
    timeframe: "June 2025 - May 2026 (12 months)",
    headline:
      "An honest case: in a year we took the site to the top of Google (37 → 8) and grew impressions 42 times - then the client shut the project down and the growth went to zero",
    teaser:
      "SEO worked: average position from 37 to 8, search impressions up 42 times, organic climbing. But the client closed the project at its peak, and the channel we had built went unused. We show it as it is: SEO growth on its own does not save a business that does not follow through.",
    cardMetrics: [
      { value: "37 → 8", label: "position in Google (our work)" },
      { value: "project shut down", label: "client closed it at the peak" },
    ],
    challenge:
      "A new website for a custom cabinetry maker in Chicago: almost no visibility in search, traffic coming from the brand query only. Demand for custom kitchens and cabinetry is there, but aggregators and competitors on aged domains take it. The job was to build an organic channel for measurement requests from scratch.",
    strategy:
      "Full-cycle SEO: technical foundation, a keyword map for commercial and local demand in Chicago, content matched to intent, and local SEO. The goal was to rank for custom cabinets and cabinet makers near me and remove the dependence on paid clicks.",
    work: [
      {
        channel: "SEO",
        points: [
          "Technical audit and optimization: speed, indexing, clean structure",
          "Keyword map: commercial and local near me clusters",
          "Schema.org and landing page content for services and intent",
          "Link building and local SEO: Google Business Profile, Google Maps, Chicago geo queries",
        ],
        why: "A new domain in a competitive niche needs both a technical foundation and an exact match between query and landing page. Local SEO takes the hot cabinet makers near me demand.",
      },
    ],
    results: [
      {
        group: "What we delivered (over the year)",
        items: [
          { before: "36.6", after: "7.6", label: "average position in Google (-29)" },
          { before: "1,157", after: "48,808", label: "impressions a month (peak, 42x)" },
          { before: "39", after: "232", label: "organic clicks a month (peak)" },
        ],
      },
      {
        group: "How it ended",
        items: [
          { value: "project closed", label: "client stopped the work at the peak of growth" },
          { value: "0", label: "follow-through - the channel went unused" },
        ],
      },
    ],
    honesty: {
      title: "Why this is a failure",
      items: [
        "The growth was real and it was ours: over 12 months the position went from 37 to 8, impressions grew 42 times, and organic started bringing traffic for measurement requests",
        "But the client shut the project down at its peak - they stopped running that line of business; traffic collapsed in May not because of SEO, but because there was nowhere left to send it",
        "The lesson for us and for the client: SEO builds the channel, the business makes the money. If there is nobody to handle the leads and nobody to sell, even the top of Google does not turn into revenue",
      ],
    },
    conclusion:
      "Technically the case is a success: we took a young site to the top of Google in Chicago within a year. As a business result it is a failure: the client shut the project down and the channel we built never produced revenue. We show it honestly - we choose clients who follow through, not only clients who launch.",
  },
  {
    slug: "unitel",
    client: "Unitel Group",
    industry: "Telecom · holding group",
    geo: "Mongolia",
    size: "Mongolian telecom holding · corporate website for the group (unitelgroup.mn)",
    channels: ["Сайт"],
    teaser:
      "Custom development of the corporate website for Unitel Group, a Mongolian telecom holding, built from a finished design: heavy interaction and animation, a preloader sequence, MN/EN localization. The result is live at unitelgroup.mn.",
    cardMetrics: [
      { value: "unitelgroup.mn", label: "live in production" },
      { value: "MN / EN", label: "two locales" },
    ],
    challenge:
      "A corporate website for a telecom holding from a complex design file: heavy interaction, animation and a preloader sequence, two locales (Mongolian and English), plus requirements for performance and cross-browser support. The task was to implement the design exactly without losing speed.",
    strategy:
      "Custom development from the design file: pixel-perfect markup, component architecture, careful animation and loading, localization - so the design reaches production with no compromises on quality or speed.",
    work: [
      {
        channel: "Website",
        points: [
          "Pixel-perfect implementation of the finished design",
          "Interaction, animation and a preloader sequence",
          "MN/EN localization, component architecture",
          "Performance and cross-browser support",
        ],
        why: "A complex animated design is easy to make heavy in development. A custom implementation holds both the accuracy of the design and the speed.",
      },
    ],
    results: [
      {
        group: "What we delivered",
        items: [
          { value: "Pixel-perfect", label: "implementation of the design file" },
          { value: "Interaction", label: "animation and preloader" },
          { value: "MN / EN", label: "two locales" },
          { value: "In production", label: "unitelgroup.mn" },
        ],
      },
    ],
  },
];

export function getCaseEn(slug: string): CaseStudy | undefined {
  return casesEn.find((c) => c.slug === slug);
}

/* Группировка листинга: сначала западные рынки (главная аудитория EN), затем регион. */
const westernSlugs = ["object-first", "sos-moving", "green-moving", "ak-cabinet-craft"];
export const westernCasesEn = casesEn.filter((c) => westernSlugs.includes(c.slug));
export const regionalCasesEn = casesEn.filter((c) => !westernSlugs.includes(c.slug));

export const casesIntroEn = {
  title: "Results, not pretty reports",
  lead:
    "Projects in the US, Europe, Kazakhstan and Mongolia. The numbers are real; some are under NDA and shown in a call.",
};

export const casesStatsEn: StatItem[] = [
  { value: "50+", label: "projects" },
  { value: "$14.6M", label: "in client sales" },
  { value: "4", label: "markets: KZ, US, RU, MN" },
];

/** Финальный CTA EN-страниц кейсов (CTASection локали не имеет - строки пропсами). */
export const casesCtaEn = {
  title: "Want to choose your clients instead of chasing them?",
  lead:
    "When leads come in steadily, you plan growth and work with the people you want, instead of taking whatever comes. The first step is seeing where you lose clients today: we show it on your own numbers and lay out a plan for a steady flow of leads. The audit is free, with no obligation.",
  cta: { label: "Get a free audit", href: "/en/contacts" },
};

/** Подписи секций страницы кейса на EN (RU-страница держит свои строки инлайном). */
export const caseUiEn = {
  back: "← All cases",
  industry: "Industry",
  geo: "Location",
  size: "Profile",
  timeframe: "Timeline",
  challenge: "Challenge",
  strategy: "Strategy",
  diagnosis: "What was broken at the start",
  work: "What we did, by channel",
  why: "Why: ",
  results: "Project numbers",
  resultsLead: "The metrics are real; some are under NDA and shown in a call.",
  honesty: "What did not work and the risks",
  honestyLead: "The decisions we rejected and the risks we planned for in advance.",
  conclusion: "Takeaway",
  related: "Related projects",
};
