import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { HeroVisualKind } from "@/content/types";
import type { SceneProps } from "../../types";
import { Bar, Chip, LeadDot } from "../../parts";

/* Сцена «Сайт под заявки»: слева телефон с мини-сайтом, справа лента событий
   аналитики. Базовый стиль - финальный кадр. Обёртки под движение (этап 2):
   телефон, заливка каждого блока (контур-вайрфрейм - ::before слота .web-wire),
   нижняя панель, касание, карточка ленты и её строки - по одному примитиву. */

/* ── Иконки: один path на 24×24, штрих currentColor ── */

const ICON = {
  menu: "M4 7h16M4 12h16M4 17h10",
  phone:
    "M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z",
  form: "M6 3h12a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zM9 8h6M9 12h6M9 16h3",
  chat: "M7.9 20A9 9 0 1 0 4 16.1L2 22z",
  ad: "M3 11l18-5v12L3 14v-3zM11.6 16.8a3 3 0 1 1-5.8-1.6",
  search: "M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM21 21l-4.3-4.3",
  send: "M22 2 15 22l-4-9-9-4zM22 2 11 13",
  scroll: "M12 4v12M6 11l6 6 6-6M5 21h14",
  eye: "M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  cart: "M2 3h2.5l2.4 11.2a2 2 0 0 0 2 1.6h8.9a2 2 0 0 0 1.9-1.5L21.5 7H5.4M9 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM18 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2z",
  truck:
    "M2 6h12v11H2zM14 10h4.5l3.5 3.5V17h-8M6.5 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM17.5 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4z",
  card: "M3 6h18a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1zM2 10h20",
  check: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM8 12l3 3 5-6",
  home: "M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z",
  grid: "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z",
  user: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0",
  down: "M6 9l6 6 6-6",
  tick: "M5 12.5l4.5 4.5L19 7.5",
} as const;

type IconName = keyof typeof ICON;

function Icon({ name, className }: { name: IconName; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className={cn("block h-[1.2em] w-[1.2em] shrink-0", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={ICON[name]} />
    </svg>
  );
}

/* ── Лента событий по виду ── */

type Tone = "outline" | "muted";
type FeedRow = { icon: IconName; label: string; tag: string; tone: Tone };
type LeadRow = { icon: IconName; label: string; sub?: string; tag: string };
type Screen = "site" | "landing" | "corporate" | "store";
type Variant = { screen: Screen; rows: [FeedRow, FeedRow, FeedRow]; lead: LeadRow };

const traffic = (icon: IconName, label: string): FeedRow => ({
  icon,
  label,
  tag: "трафик",
  tone: "outline",
});
const step = (icon: IconName, label: string, tag: string): FeedRow => ({
  icon,
  label,
  tag,
  tone: "muted",
});
const WHATSAPP = step("chat", "Клик в WhatsApp", "цель ✓");
const FORM: LeadRow = { icon: "send", label: "Форма отправлена", tag: "заявка" };

const SITE: Variant = {
  screen: "site",
  rows: [traffic("ad", "Визит · из рекламы"), traffic("search", "Визит · из поиска"), WHATSAPP],
  lead: FORM,
};

const VARIANTS: Partial<Record<HeroVisualKind, Variant>> = {
  web: SITE,
  "web-city": SITE,
  landing: {
    screen: "landing",
    rows: [
      traffic("ad", "Визит · из объявления"),
      step("scroll", "Долистал до формы", "интерес"),
      WHATSAPP,
    ],
    lead: FORM,
  },
  corporate: {
    screen: "corporate",
    rows: [traffic("search", "Визит · из поиска"), step("eye", "Раздел «Кейсы»", "интерес"), WHATSAPP],
    lead: { ...FORM, sub: "страница «Направление 2»" },
  },
  ecommerce: {
    screen: "store",
    rows: [
      step("cart", "Товар в корзине", "шаг 1"),
      step("truck", "Доставка выбрана", "шаг 2"),
      step("card", "Оплата", "шаг 3"),
    ],
    lead: { icon: "check", label: "Заказ оформлен", tag: "заказ" },
  },
};

/* ── Телефон ── */

/** Корпус и экран. Обёртка - вход телефона (этап 2: a-rise); экран обрезает нижнюю панель. */
function Phone({ children, bottom }: { children: ReactNode; bottom: ReactNode }) {
  return (
    <div className="absolute left-[1.5em] top-[1em] h-[28em] w-[14.5em]">
      <span className="ill-detail absolute -left-[0.2em] top-[5.5em] h-[2.2em] w-[0.3em] rounded-l-[0.2em] bg-surface-2" />
      <span className="ill-detail absolute -left-[0.2em] top-[8.4em] h-[2.2em] w-[0.3em] rounded-l-[0.2em] bg-surface-2" />
      <span className="ill-detail absolute -right-[0.2em] top-[7em] h-[3.4em] w-[0.3em] rounded-r-[0.2em] bg-surface-2" />
      <div className="relative h-full rounded-[2.3em] bg-surface-2 p-[0.4em] ring-1 ring-inset ring-ink/10">
        <div className="relative flex h-full flex-col overflow-hidden rounded-[1.9em] bg-bg">
          <span className="mx-auto mt-[0.55em] h-[0.95em] w-[3.8em] shrink-0 rounded-full bg-surface-2" />
          <div className="flex flex-1 flex-col gap-[0.9em] px-[0.85em] pt-[0.9em]">{children}</div>
          {bottom}
        </div>
      </div>
    </div>
  );
}

/** Блок мини-сайта: пунктирный контур-вайрфрейм под заливкой. Заливка закрывает
 *  контур кольцом цвета экрана (.web-fill), поэтому в финальном кадре его не видно.
 *  Этап 2: одна анимация на блок - заливка a-fade сверху вниз по i, контур гаснет под ней. */
function Block({
  className,
  fill,
  children,
}: {
  className?: string;
  fill?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("relative shrink-0", className)}>
      <span aria-hidden className="web-wire" />
      <div className={cn("web-fill h-full", fill)}>{children}</div>
    </div>
  );
}

function Logo() {
  return (
    <span className="flex items-center gap-[0.45em]">
      <span className="h-[1.3em] w-[1.3em] rounded-[0.4em] bg-ink/70" />
      <Bar w="3.4em" />
    </span>
  );
}

function Nav({ icon }: { icon: IconName }) {
  return (
    <Block className="h-[1.8em]" fill="flex items-center justify-between">
      <Logo />
      <Icon name={icon} className="text-ink-2" />
    </Block>
  );
}

/** Заголовок мини-сайта; в компактной сцене - скелетон (текст не влезает в узкий экран). */
function Headline({ lines = 1 }: { lines?: number }) {
  return (
    <Block fill="flex flex-col gap-[0.55em]">
      <span className="ill-t-sm ill-detail font-semibold leading-[1.2] text-ink">
        {"Ремонт квартир под\u00a0ключ"}
      </span>
      <span className="web-compact flex-col gap-[0.45em]">
        <Bar w="100%" tone="strong" />
        <Bar w="60%" tone="strong" />
      </span>
      {Array.from({ length: lines }, (_, i) => (
        <Bar key={i} w={i ? "60%" : "85%"} tone="faint" />
      ))}
    </Block>
  );
}

/** Главная кнопка: светлая (единственная инверсия экрана). */
function Cta({ label = "Оставить заявку", short, tap }: { label?: string; short?: string; tap?: boolean }) {
  return (
    <Block className="rounded-[0.7em]">
      <span
        className={cn(
          "relative grid h-[2.6em] place-items-center rounded-[0.7em] bg-ink text-bg",
          tap && "overflow-hidden",
        )}
      >
        {tap && <Tap on="light" spot={false} className="right-[0.7em] top-[0.3em] h-[2em] w-[2em]" />}
        <span className={cn("ill-t-sm whitespace-nowrap font-semibold", short && "ill-detail")}>
          {label}
        </span>
        {short && <span className="ill-t-sm web-compact whitespace-nowrap font-semibold">{short}</span>}
      </span>
    </Block>
  );
}

function Field() {
  return (
    <span className="flex h-[2.1em] items-center rounded-[0.55em] border border-border px-[0.6em]">
      <Bar w="45%" tone="faint" />
    </span>
  );
}

function Form() {
  return (
    <Block fill="flex flex-col gap-[0.45em]">
      <Field />
      <Field />
    </Block>
  );
}

/** Касание пальцем: пятно (этап 2: a-pop) и кольцо-волна (этап 2: a-pulse, в финальном
 *  кадре не видно). spot={false} - только волна; on="light" - поверх светлой кнопки. */
function Tap({
  className,
  spot = true,
  on = "dark",
}: {
  className: string;
  spot?: boolean;
  on?: "dark" | "light";
}) {
  return (
    <>
      {spot && <span className={cn("absolute rounded-full bg-ink/15", className)} />}
      <span
        className={cn(
          "absolute rounded-full border opacity-0",
          on === "light" ? "border-bg/40" : "border-ink/50",
          className,
        )}
      />
    </>
  );
}

function RoundButton({ icon, tap }: { icon: IconName; tap?: boolean }) {
  return (
    <span
      className={cn(
        "relative grid h-[2.3em] w-[2.3em] place-items-center rounded-full border",
        tap ? "border-ink/30 bg-surface-2 text-ink" : "border-border text-ink-2",
      )}
    >
      {tap && <Tap className="-inset-[0.55em]" />}
      <Icon name={icon} className="relative" />
    </span>
  );
}

/** Нижняя панель связи: форма, WhatsApp, звонок (этап 2: a-slide снизу). */
function ContactBar() {
  return (
    <div className="flex h-[3.7em] shrink-0 items-center justify-around border-t border-border bg-surface px-[0.8em]">
      <RoundButton icon="form" />
      <RoundButton icon="chat" tap />
      <RoundButton icon="phone" />
    </div>
  );
}

/** Таб-бар магазина с корзиной «1» (этап 2: a-slide снизу). */
function StoreBar() {
  return (
    <div className="flex h-[3.7em] shrink-0 items-center justify-around border-t border-border bg-surface px-[0.8em] text-ink-2">
      <Icon name="home" className="h-[1.4em] w-[1.4em]" />
      <Icon name="grid" className="h-[1.4em] w-[1.4em]" />
      <span className="relative text-ink">
        <Icon name="cart" className="h-[1.4em] w-[1.4em]" />
        <span className="ill-t-sm absolute bottom-[55%] left-[65%] grid h-[1.4em] min-w-[1.4em] place-items-center rounded-full bg-ink px-[0.3em] font-semibold leading-none text-bg ring-2 ring-surface">
          1
        </span>
      </span>
      <Icon name="user" className="h-[1.4em] w-[1.4em]" />
    </div>
  );
}

/** Плавающая кнопка WhatsApp лендинга (этап 2: a-pop). */
function ChatFab() {
  return (
    <span className="absolute bottom-[1em] right-[0.9em] grid h-[2.8em] w-[2.8em] place-items-center rounded-full border border-ink/30 bg-surface-2 text-ink">
      <Tap className="-inset-[0.5em]" />
      <Icon name="chat" className="relative h-[1.35em] w-[1.35em]" />
    </span>
  );
}

/** Фото в блоке: комната (сайт) или банка краски (магазин), line-art. */
function Photo({ art, className }: { art: "room" | "paint"; className: string }) {
  return (
    <Block className={cn("rounded-[0.8em]", className)} fill="rounded-[0.8em] bg-surface-2">
      <svg
        viewBox="0 0 120 64"
        aria-hidden
        className="h-full w-full text-ink/35"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path
          d={
            art === "room"
              ? "M10 54h100M78 12h24v26H78zM90 12v26M78 25h24M36 4v9M29.5 19l2.5-6h8l2.5 6zM17 54v-2M55 54v-2M15 52V44a3 3 0 0 1 6 0v3h30v-3a3 3 0 0 1 6 0v8zM21 44v-5a3 3 0 0 1 3-3h24a3 3 0 0 1 3 3v5"
              : "M40 21h26v29a3 3 0 0 1-3 3H43a3 3 0 0 1-3-3zM38 17h30v4H38zM44 17c0-9 18-9 18 0M40 29h26M40 43h26M78 22h18a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H78a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2zM98 26h3v8l-14 3v16"
          }
        />
      </svg>
    </Block>
  );
}

function SiteScreen() {
  return (
    <>
      <Nav icon="menu" />
      <Headline />
      <Block fill="flex gap-[0.4em]">
        <Chip>цена</Chip>
        <Chip className="ill-detail">сроки</Chip>
      </Block>
      <Photo art="room" className="h-[6.4em]" />
      <Cta short="Заявка" />
    </>
  );
}

/** Лендинг: один экран - оффер, форма, кнопка; ниже - подсказка листать. */
function LandingScreen() {
  return (
    <>
      <Nav icon="phone" />
      <Headline lines={0} />
      <Block fill="flex flex-col gap-[0.55em]">
        {["75%", "60%"].map((w) => (
          <span key={w} className="flex items-center gap-[0.45em]">
            <Icon name="tick" className="h-[1em] w-[1em] text-ink-2" />
            <Bar w={w} />
          </span>
        ))}
      </Block>
      <Form />
      <Cta short="Заявка" />
      <Block fill="flex justify-center text-muted">
        <Icon name="down" className="h-[1.5em] w-[1.5em]" />
      </Block>
      {/* следующая секция выглядывает из-под сгиба */}
      <Block className="mt-auto" fill="flex h-[3em] flex-col gap-[0.5em] rounded-t-[0.9em] bg-surface px-[0.8em] pt-[0.9em]">
        <Bar w="55%" tone="soft" />
        <Bar w="80%" tone="faint" />
      </Block>
    </>
  );
}

/** Корпоративный: меню разделов, страница направления с формой. */
function CorporateScreen() {
  return (
    <>
      <Nav icon="menu" />
      <Block fill="flex gap-[0.9em] overflow-hidden whitespace-nowrap border-b border-border">
        <span className="ill-t-sm border-b border-ink pb-[0.4em] text-ink">Услуги</span>
        <span className="ill-t-sm pb-[0.4em] text-muted">Кейсы</span>
        <span className="ill-t-sm pb-[0.4em] text-muted">О компании</span>
      </Block>
      <Block fill="flex flex-col gap-[0.55em]">
        <span className="ill-t-sm ill-detail truncate font-semibold text-ink">Направление 2</span>
        <Bar w="75%" tone="strong" className="web-compact" />
        <Bar w="100%" tone="faint" />
        <Bar w="70%" tone="faint" />
      </Block>
      <Form />
      <Cta short="Заявка" />
    </>
  );
}

/** Магазин: карточка товара с кнопкой «В корзину». */
function StoreScreen() {
  return (
    <>
      <Nav icon="search" />
      <Photo art="paint" className="h-[8.4em]" />
      <Block fill="flex flex-col gap-[0.5em]">
        <Bar w="90%" />
        <Bar w="55%" />
        <Bar w="4.5em" tone="strong" className="mt-[0.3em] h-[0.8em]" />
      </Block>
      <Cta label="В корзину" tap />
    </>
  );
}

const SCREENS: Record<Screen, () => ReactNode> = {
  site: SiteScreen,
  landing: LandingScreen,
  corporate: CorporateScreen,
  store: StoreScreen,
};

/* ── Лента ── */

function IconBox({ name, className }: { name: IconName; className?: string }) {
  return (
    <span
      className={cn(
        "grid h-[2.2em] w-[2.2em] shrink-0 place-items-center rounded-[0.65em] bg-surface-2 text-ink-2",
        className,
      )}
    >
      <Icon name={name} />
    </span>
  );
}

/** Карточка событий (этап 2: a-fade); строки - a-rise каскадом, точка заявки - последней. */
function Feed({ title, variant }: { title: string; variant: Variant }) {
  const { rows, lead } = variant;
  return (
    <div className="absolute left-[18.5em] right-[1.2em] top-[4.4em] rounded-[1.4em] border border-border bg-surface p-[1.1em]">
      <div className="ill-t-sm flex h-[1.9em] items-center truncate font-medium uppercase tracking-[0.08em] text-muted">
        {title}
      </div>
      <div className="mt-[0.5em]">
        {rows.map((r) => (
          <div key={r.label} className="flex h-[3.5em] items-center gap-[0.8em] border-t border-border">
            <IconBox name={r.icon} />
            <span className="ill-t-sm min-w-0 flex-1 truncate text-ink">{r.label}</span>
            <Chip tone={r.tone} className="ill-detail">
              {r.tag}
            </Chip>
          </div>
        ))}
        <div className="mt-[0.3em] flex min-h-[4em] items-center gap-[0.8em] rounded-[0.9em] border border-border bg-surface-2 px-[0.7em] py-[0.5em]">
          <IconBox name={lead.icon} className="bg-ink/10 text-ink" />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-[0.6em]">
              <span className="ill-t-sm min-w-0 flex-1 truncate font-medium text-ink">{lead.label}</span>
              <Chip tone="solid" className="ill-detail">
                {lead.tag}
              </Chip>
              <LeadDot delay={2.45} />
            </div>
            {lead.sub && <div className="ill-t-sm ill-detail truncate text-muted">{lead.sub}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

/** Сцена сайта: телефон с мини-сайтом ведёт к заявке, события видны в аналитике. */
export function WebScene({ v }: SceneProps) {
  const variant = VARIANTS[v.kind] ?? SITE;
  const ScreenContent = SCREENS[variant.screen];
  const bottom =
    variant.screen === "store" ? <StoreBar /> : variant.screen === "landing" ? <ChatFab /> : <ContactBar />;
  return (
    <div className="absolute inset-0">
      <Phone bottom={bottom}>
        <ScreenContent />
      </Phone>
      <Feed title={`События · ${v.city ?? "аналитика"}`} variant={variant} />
    </div>
  );
}
