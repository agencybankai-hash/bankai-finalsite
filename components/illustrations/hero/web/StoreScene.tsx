import { cn } from "@/lib/utils";
import { Bar, Chip, LeadDot } from "../../parts";
import type { SceneProps } from "../../types";
import { anim } from "../../vars";
import { Block, Cta, Icon, IconBox, Nav, Phone, Photo, at, type IconName } from "./kit";

/* Интернет-магазин: телефон с фильтрами и карточкой товара - касание «В корзину»,
   в таб-баре «1»; справа оформление «Корзина → Доставка → Оплата» заполняется
   до «Заказ оформлен». Цены и остатки - из учёта. Алматы - оплата Kaspi и картой,
   доставка по городу и в регионы, источник «Kaspi · Instagram → свой сайт».
   Раскладка - web.css (.web-store-*). */

/** Таймлайн, с: телефон → блоки → касание 1.3 → «1» в корзине 1.45 →
 *  шаги 1.9-2.3 → заказ 2.4. */
const T = {
  phone: 0.5,
  block: 0.65,
  blockStep: 0.1,
  bar: 1.1,
  checkout: 0.9,
  sync: 1.1,
  source: 0.7,
  tap: 1.3,
  badge: 1.45,
  cart: 1.5,
  steps: 1.9,
  stepsDur: 0.4,
  done: 2.15,
  lead: 2.4,
};
const blockAt = (i: number) => at(T.block + i * T.blockStep);

/** Таб-бар магазина; «1» в корзине появляется после касания «В корзину». */
function StoreBar() {
  return (
    <div
      className="a-slide flex h-[3.7em] shrink-0 items-center justify-around border-t border-border bg-surface px-[0.8em] text-ink-2"
      style={anim({ delay: T.bar }, { "--a-y": "100%" })}
    >
      <Icon name="home" className="h-[1.4em] w-[1.4em]" />
      <Icon name="grid" className="h-[1.4em] w-[1.4em]" />
      <span className="relative text-ink">
        <Icon name="cart" className="h-[1.4em] w-[1.4em]" />
        <span
          className="a-rise ill-t-sm absolute bottom-[55%] left-[65%] grid h-[1.4em] min-w-[1.4em] place-items-center rounded-full bg-ink px-[0.3em] font-semibold leading-none text-bg ring-2 ring-surface"
          style={anim({ delay: T.badge, dur: 0.5 }, { "--a-y": "0.5em" })}
        >
          1
        </span>
      </span>
      <Icon name="user" className="h-[1.4em] w-[1.4em]" />
    </div>
  );
}

/** Каталог: фильтры, карточка товара, «В корзину» с касанием. */
function CatalogScreen() {
  return (
    <>
      <Nav icon="search" delay={blockAt(0)} />
      <Block delay={blockAt(1)} fill="flex gap-[0.35em] overflow-hidden">
        <Chip tone="outline" className="border-ink/40 text-ink">
          тип
        </Chip>
        <Chip>бренд</Chip>
        <Chip tone="outline" className="ill-detail px-[0.5em]">
          <Icon name="filter" className="h-[1em] w-[1em]" />
        </Chip>
      </Block>
      <Photo delay={blockAt(2)} art="paint" className="web-store-photo" />
      <Block delay={blockAt(3)} fill="flex flex-col gap-[0.5em]">
        <Bar w="90%" />
        <Bar w="55%" />
        <span className="mt-[0.3em] flex items-center gap-[0.35em]">
          <Bar w="4.5em" tone="strong" className="h-[0.8em]" />
          <span className="ill-t-sm leading-none text-muted">₸</span>
        </span>
      </Block>
      <Cta delay={blockAt(4)} label="В корзину" tap={T.tap} />
    </>
  );
}

const STEPS: { icon: IconName; label: string }[] = [
  { icon: "cart", label: "Корзина" },
  { icon: "truck", label: "Доставка" },
  { icon: "card", label: "Оплата" },
];

/** Шаги оформления: линия прогресса растёт от «Корзины» к «Оплате» (a-grow-x),
 *  кружок шага отмечается, когда линия до него доходит. */
function Stepper() {
  return (
    <div className="relative grid grid-cols-3">
      {/* линия - между центрами крайних кружков: по 1/6 ширины с краёв */}
      <span aria-hidden className="absolute left-[16.67%] right-[16.67%] top-[1.1em] h-[0.2em] -mt-[0.1em] rounded-full bg-ink/10" />
      <span
        aria-hidden
        className="a-grow-x absolute left-[16.67%] right-[16.67%] top-[1.1em] h-[0.2em] -mt-[0.1em] rounded-full bg-ink-2"
        style={anim({ delay: T.steps, dur: T.stepsDur, i: 0 }, { "--a-ease": "linear" })}
      />
      {STEPS.map((s, i) => (
        <div key={s.label} className="relative flex flex-col items-center gap-[0.5em]">
          <span className="relative grid h-[2.2em] w-[2.2em] place-items-center rounded-full bg-surface text-ink">
            <span className="absolute inset-0 rounded-full bg-ink/10" />
            <span
              className="a-fade absolute inset-0 rounded-full border border-ink-2"
              style={anim({ delay: at(T.steps + (i * T.stepsDur) / 2), dur: 0.2 })}
            />
            <Icon name={s.icon} className="relative h-[1.15em] w-[1.15em]" />
          </span>
          <span className="ill-t-sm leading-none text-ink">{s.label}</span>
        </div>
      ))}
    </div>
  );
}

/** Выбор в шаге: иконка шага и варианты; первый вариант выбран. */
function Choice({ icon, options }: { icon: IconName; options: string[] }) {
  return (
    <div className="flex items-center gap-[0.6em]">
      <Icon name={icon} className="h-[1.2em] w-[1.2em] text-muted" />
      <span className="flex min-w-0 flex-wrap gap-[0.35em]">
        {options.map((o, i) => (
          <Chip
            key={o}
            tone={i ? "muted" : "outline"}
            className={cn(i ? "" : "border-ink/40 text-ink", i > 1 && "ill-detail")}
          >
            {o}
          </Chip>
        ))}
      </span>
    </div>
  );
}

/** Строка корзины: товар из каталога приходит после касания «В корзину». */
function CartLine() {
  return (
    <div className="a-rise flex items-center gap-[0.8em]" style={anim({ delay: T.cart, dur: 0.4 }, { "--a-y": "0.5em" })}>
      <span className="grid h-[2.6em] w-[2.6em] shrink-0 place-items-center rounded-[0.6em] bg-surface-2 text-ink/40">
        <Icon name="cart" className="h-[1.2em] w-[1.2em]" />
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-[0.45em]">
        <Bar w="75%" />
        <Bar w="40%" tone="faint" />
      </span>
      <span className="flex shrink-0 items-center gap-[0.3em]">
        <Bar w="3em" tone="strong" />
        <span className="ill-t-sm leading-none text-muted">₸</span>
      </span>
    </div>
  );
}

function Checkout({ almaty }: { almaty: boolean }) {
  return (
    <div
      className="web-store-card a-fade flex w-full flex-col rounded-[1.4em] border border-border bg-surface p-[1.1em]"
      style={anim({ delay: T.checkout })}
    >
      <div className="ill-t-sm flex h-[1.9em] shrink-0 items-center truncate font-medium uppercase tracking-[0.08em] text-muted">
        Оформление заказа
      </div>
      <Stepper />
      {almaty ? (
        <div className="flex flex-col gap-[0.6em]">
          <Choice icon="truck" options={["по Алматы", "самовывоз", "регионы"]} />
          <Choice icon="card" options={["Kaspi", "карта"]} />
        </div>
      ) : (
        <CartLine />
      )}
      <div
        className="a-rise flex min-h-[3.6em] items-center gap-[0.8em] rounded-[0.9em] border border-border bg-surface-2 px-[0.7em] py-[0.4em]"
        style={anim({ delay: T.done, dur: 0.35 })}
      >
        <IconBox name="check" className="bg-ink/10 text-ink" />
        <div className="flex min-w-0 flex-1 items-center gap-[0.6em]">
          <span className="ill-t-sm min-w-0 flex-1 truncate font-medium text-ink">Заказ оформлен</span>
          <Chip tone="solid" className="ill-detail">
            заказ
          </Chip>
          <LeadDot delay={T.lead} />
        </div>
      </div>
    </div>
  );
}

/** Цены и остатки - из учётной системы. */
function SyncChip() {
  return (
    <div className="a-fade" style={anim({ delay: T.sync })}>
      <Chip tone="outline" className="gap-[0.5em]">
        <span className="text-ink">Учёт</span>
        <Icon name="sync" className="h-[1.1em] w-[1.1em] text-ink" />
        <span>цены · остатки</span>
      </Chip>
    </div>
  );
}

/** Алматы: откуда уже идут продажи и куда ведёт магазин. */
function SourceChip() {
  return (
    <div className="web-store-source a-fade absolute left-[18.5em] top-[1.1em]" style={anim({ delay: T.source })}>
      <Chip tone="outline" className="gap-[0.45em]">
        <span>Kaspi · Instagram</span>
        <span className="text-muted">→</span>
        <span className="font-medium text-ink">свой сайт</span>
      </Chip>
    </div>
  );
}

/** Сцена магазина: от карточки товара до оформленного заказа. */
export function StoreScene({ v }: SceneProps) {
  const almaty = v.city === "Алматы";
  return (
    <div className={cn("web-store absolute inset-0", almaty && "web-store-almaty")}>
      <Phone className="left-[1.5em] top-[1em] h-[28em] w-[14.5em]" delay={T.phone} bottom={<StoreBar />}>
        <CatalogScreen />
      </Phone>
      {almaty && <SourceChip />}
      {/* правая колонка: оформление, под ним - учёт */}
      <div className="web-store-col absolute left-[18.5em] right-[1.2em] top-[4.4em] flex flex-col items-end">
        <Checkout almaty={almaty} />
        <SyncChip />
      </div>
    </div>
  );
}
