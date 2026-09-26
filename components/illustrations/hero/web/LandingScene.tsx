import { cn } from "@/lib/utils";
import { Bar, Chip, LeadDot } from "../../parts";
import type { SceneProps } from "../../types";
import { anim } from "../../vars";
import { Block, Cta, Field, Icon, IconBox, Logo, Nav, Phone, Tap, type IconName } from "./kit";

/* Лендинг под кампанию: объявление и первый экран говорят одно и то же
   (пунктирная связь «тот же оффер»), схема страницы справа - блоки сверху
   вниз, ползунок прокрутки проходит по ней до формы. Алматы - переключатель
   источника и версия KZ над объявлением; Астана - регистрация на мероприятие
   в телефоне и вторая посадочная - запрос КП. Вертикальная раскладка
   вариантов - web.css (.web-land-*). */

/** Таймлайн, с: объявление 0.6 → связь 0.9 → заголовок 1.2 → прокрутка схемы
 *  1.4-2.3 → заявка 2.5. Алматы - проход переключателя до «Поиск» до объявления;
 *  Астана - карточка КП, поля заполняются, касание кнопки. */
const T = {
  phone: 0.5,
  ad: 0.6,
  block: 0.75,
  map: 0.8,
  link: 0.9,
  head: 1.2,
  scroll: 1.4,
  lead: 2.5,
  source: 0.35,
  sourcePass: 0.45,
  quote: 1.3,
  fields: 1.8,
  tap: 2.2,
};

type Variant = "base" | "almaty" | "astana";

/** Заголовок объявления = заголовок первого экрана; tail - хвост объявления,
 *  на первом экране - только если заголовок повторяет объявление целиком. */
const OFFER: Record<Variant, { ad: string; tail: string; headTail: boolean }> = {
  base: { ad: "Ремонт квартир под\u00a0ключ", tail: " - цена за\u00a0м²", headTail: true },
  almaty: { ad: "Ремонт квартир под\u00a0ключ", tail: " - цена за\u00a0м²", headTail: true },
  astana: { ad: "Форум в\u00a0Астане", tail: " - регистрация", headTail: false },
};

function AdChip({ v }: { v: Variant }) {
  const { ad, tail } = OFFER[v];
  return (
    <div
      className="web-land-ad a-rise absolute left-[1.5em] z-20 flex max-w-[45em] items-center gap-[0.6em] rounded-full border border-ink/15 bg-surface-2 pl-[0.5em] pr-[1.1em]"
      style={anim({ delay: T.ad }, { "--a-y": "-0.8em" })}
    >
      <Chip tone="outline" className="border-ink/40 font-semibold text-ink">
        Реклама
      </Chip>
      <span className="ill-t-md min-w-0 truncate font-medium text-ink">
        {ad}
        <span className="ill-detail">{tail}</span>
      </span>
    </div>
  );
}

/** Связь объявления с заголовком первого экрана - поверх телефона: пунктир выезжает
 *  сверху вниз внутри обрезающей обёртки (a-slide), на конце - порт на рамке
 *  заголовка. Позиции - в em сцены: текстовый кегль только внутри обёрток. */
function OfferLink() {
  return (
    <>
      <div aria-hidden className="web-land-link absolute left-[11.3em] z-10 w-[0.2em] overflow-hidden">
        <span
          className="a-slide block h-full w-0 border-l border-dashed border-ink-2"
          style={anim({ delay: T.link, dur: 0.35 }, { "--a-y": "-100%" })}
        />
      </div>
      <span
        aria-hidden
        className="web-land-port a-pop absolute left-[11.3em] z-10 -ml-[0.28em] h-[0.6em] w-[0.6em] rounded-full bg-ink-2"
        style={anim({ delay: T.link + 0.3, dur: 0.3 })}
      />
      <div className="web-land-note a-fade absolute left-[12.1em]" style={anim({ delay: T.link + 0.1 })}>
        <span className="ill-t-sm block whitespace-nowrap leading-none text-ink-2">тот же оффер</span>
      </div>
    </>
  );
}

/** Заголовок первого экрана в пунктирной рамке совпадения; текст проявляется,
 *  когда до него доходит связь. */
function OfferHead({ v }: { v: Variant }) {
  const { ad, tail, headTail } = OFFER[v];
  return (
    <div className="shrink-0 rounded-[0.6em] border border-dashed border-ink-2/70 px-[0.45em] py-[0.5em]">
      <p
        className="ill-t-sm a-fade font-semibold leading-[1.2] text-ink"
        style={anim({ delay: T.head, dur: 0.4 })}
      >
        {ad}
        {headTail && <span className="ill-detail">{tail}</span>}
      </p>
    </div>
  );
}

/** Первый экран лендинга: без меню, заголовок = объявление, доводы, кнопка. */
function OfferScreen({ v }: { v: Variant }) {
  return (
    <>
      <Nav icon="phone" delay={T.block} />
      <OfferHead v={v} />
      <div className="web-land-points ill-detail">
        <Block delay={T.block + 0.2} fill="flex flex-col gap-[0.55em]">
          {["75%", "60%"].map((w) => (
            <span key={w} className="flex items-center gap-[0.45em]">
              <Icon name="tick" className="h-[1em] w-[1em] text-ink-2" />
              <Bar w={w} />
            </span>
          ))}
        </Block>
      </div>
      <Cta delay={T.block + 0.3} short="Заявка" />
    </>
  );
}

/** Плавающая кнопка WhatsApp лендинга; в компактной сцене - только строка схемы. */
function ChatFab() {
  return (
    <span
      className="a-rise ill-detail absolute bottom-[1em] right-[0.9em] grid h-[2.8em] w-[2.8em] place-items-center rounded-full border border-ink/30 bg-surface-2 text-ink"
      style={anim({ delay: T.scroll }, { "--a-y": "1.5em" })}
    >
      <Icon name="chat" className="h-[1.35em] w-[1.35em]" />
    </span>
  );
}

const EVENT: { icon: IconName; label: string; w: string }[] = [
  { icon: "calendar", label: "дата", w: "45%" },
  { icon: "list", label: "программа", w: "25%" },
  { icon: "users", label: "спикеры", w: "35%" },
];

/** Астана: регистрация на мероприятие - заголовок = объявление, дата, программа, спикеры. */
function EventScreen({ v }: { v: Variant }) {
  return (
    <>
      <Nav icon="phone" delay={T.block} />
      <OfferHead v={v} />
      <Block delay={T.block + 0.2} fill="flex flex-col gap-[0.55em]">
        {EVENT.map((r) => (
          <span key={r.label} className="flex items-center gap-[0.5em]">
            <Icon name={r.icon} className="h-[1.1em] w-[1.1em] text-ink-2" />
            <span className="ill-t-sm leading-none text-ink">{r.label}</span>
            <Bar w={r.w} tone="faint" className="ill-detail ml-auto" />
          </span>
        ))}
      </Block>
      <Cta delay={T.block + 0.3} label="Регистрация" />
    </>
  );
}

const MAP: { icon: IconName; label: string }[] = [
  { icon: "ad", label: "Первый экран = объявление" },
  { icon: "clock", label: "Сроки" },
  { icon: "shield", label: "Гарантии" },
  { icon: "star", label: "Отзывы" },
];

const PANEL =
  "web-land-panel a-fade absolute left-[17.6em] right-[1.2em] flex flex-col rounded-[1.4em] border border-border bg-surface px-[1em] pb-[1em] pt-[0.9em]";

function PanelTitle({ children }: { children: string }) {
  return (
    <div className="ill-t-sm flex h-[1.9em] shrink-0 items-center truncate font-medium uppercase tracking-[0.08em] text-muted">
      {children}
    </div>
  );
}

/** Схема страницы: блоки сверху вниз, последний - одно действие. Подсветка текущего
 *  экрана и ползунок - одна обёртка (a-slide): стартуют на первом экране и
 *  прокручиваются до формы. */
function PageMap() {
  return (
    <div className={PANEL} style={anim({ delay: T.map })}>
      <PanelTitle>Схема страницы</PanelTitle>
      <div className="web-land-rows relative mt-[0.5em] flex flex-1 flex-col justify-between pr-[1.3em]">
        <span aria-hidden className="absolute inset-y-0 right-0 w-[0.35em] rounded-full bg-ink/10" />
        <div
          aria-hidden
          className="web-land-scroll a-slide absolute inset-x-0 top-0"
          style={anim({ delay: T.scroll, dur: 0.9 }, { "--a-ease": "cubic-bezier(0.65, 0, 0.35, 1)" })}
        >
          <span className="absolute left-0 right-[1.3em] rounded-[0.8em] border border-ink/15 bg-surface-2" />
          <span className="absolute right-0 w-[0.35em] rounded-full bg-ink-2" />
        </div>
        {MAP.map((r) => (
          <div key={r.label} className="web-land-row relative flex items-center gap-[0.7em] px-[0.6em]">
            <IconBox name={r.icon} className="ill-detail h-[2em] w-[2em]" />
            <span className="ill-t-sm min-w-0 truncate text-ink-2">{r.label}</span>
          </div>
        ))}
        <div className="web-land-row relative flex items-center gap-[0.7em] px-[0.6em]">
          <IconBox name="form" className="ill-detail h-[2em] w-[2em] bg-ink/10 text-ink" />
          <span className="ill-t-sm min-w-0 flex-1 truncate font-medium text-ink">
            Форма · WhatsApp · звонок
          </span>
          <LeadDot delay={T.lead} />
        </div>
      </div>
    </div>
  );
}

/** Астана: вторая посадочная под одно действие - запрос КП для B2B: поля
 *  заполняются, касание кнопки, заявка. */
function QuoteCard() {
  return (
    <div className={PANEL} style={anim({ delay: T.quote })}>
      <PanelTitle>Запрос КП · B2B</PanelTitle>
      <div className="mt-[0.6em] flex flex-1 flex-col justify-between">
        <div className="ill-detail flex items-center gap-[0.6em]">
          <Logo />
          <Bar w="30%" tone="faint" className="ml-auto" />
        </div>
        {["объём", "сроки"].map((label, i) => (
          <div key={label} className="flex flex-col gap-[0.45em]">
            <span className="ill-t-sm leading-none text-ink-2">{label}</span>
            <Field>
              <Bar
                w={i ? "40%" : "55%"}
                className="a-grow-x"
                style={anim({ delay: T.fields + i * 0.2, dur: 0.4 })}
              />
            </Field>
          </div>
        ))}
        <div className="flex items-center gap-[0.8em]">
          <span className="relative grid h-[2.6em] min-w-0 flex-1 place-items-center overflow-hidden rounded-[0.7em] bg-ink px-[0.8em] text-bg">
            <Tap delay={T.tap} on="light" spot={false} className="right-[1em] top-[0.3em] h-[2em] w-[2em]" />
            <span className="ill-t-sm truncate font-semibold">Отправить запрос</span>
          </span>
          <LeadDot delay={T.lead} />
        </div>
      </div>
    </div>
  );
}

const SOURCES = ["Поиск", "Instagram", "2GIS"];

/** Переключатель источника: подсветка один раз проходит с 2GIS до «Поиск».
 *  Сегменты одной ширины в em кегля - путь подсветки не зависит от текста. */
function SourceSwitch() {
  return (
    <div
      className="web-land-source a-fade absolute left-[1.5em] flex items-center gap-[0.8em]"
      style={anim({ delay: T.source })}
    >
      <div className="ill-t-sm relative flex rounded-full border border-border bg-surface p-[0.2em] leading-none">
        <span
          aria-hidden
          className="a-slide absolute bottom-[0.2em] left-[0.2em] top-[0.2em] w-[6em] rounded-full bg-ink/15"
          style={anim({ delay: T.sourcePass, dur: 0.75 }, { "--a-x": "12em" })}
        />
        {SOURCES.map((s, i) => (
          <span
            key={s}
            className={cn("web-land-seg relative w-[6em] text-center", i ? "text-muted" : "font-medium text-ink")}
          >
            {s}
          </span>
        ))}
      </div>
      <span className="web-land-seg ill-t-sm flex items-center gap-[0.5em] rounded-full border border-border px-[0.8em] leading-none">
        <span className="font-medium text-ink">RU</span>
        <span className="text-muted">|</span>
        <span className="text-ink-2">KZ</span>
      </span>
    </div>
  );
}

/** Сцена лендинга: объявление = первый экран, страница ведёт к одному действию. */
export function LandingScene({ v }: SceneProps) {
  const variant: Variant = v.city === "Алматы" ? "almaty" : v.city === "Астана" ? "astana" : "base";
  return (
    <div className={cn("web-land absolute inset-0", variant !== "base" && `web-land-${variant}`)}>
      {variant === "almaty" && <SourceSwitch />}
      <AdChip v={variant} />
      <Phone
        className="web-land-phone left-[1.5em] w-[13.6em]"
        delay={T.phone}
        bottom={<ChatFab />}
      >
        {variant === "astana" ? <EventScreen v={variant} /> : <OfferScreen v={variant} />}
      </Phone>
      <OfferLink />
      {variant === "astana" ? <QuoteCard /> : <PageMap />}
    </div>
  );
}
