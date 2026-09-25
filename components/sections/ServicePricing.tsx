import { Section, SectionHeader } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Pill } from "@/components/ui/Pill";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/motion/Reveal";
import { cn, nbsp, nbspValue } from "@/lib/utils";
import type { ServicePlan, ServicePrice } from "@/content/types";

const NB = String.fromCharCode(160);

/** Сумма целиком неразрывная; nbspValue не держит «млн ₸» - знак валюты приклеиваем. */
const money = (s: string) => nbspValue(s).replace(/ (?=₸)/g, NB);
/** Текст с суммами: разряды, предлоги и тире не отрываются. */
const prose = (s: string) => nbsp(money(s));

function Checks({ items, className }: { items: string[]; className?: string }) {
  return (
    <ul className={cn("space-y-2.5", className)}>
      {items.map((i) => (
        <li key={i} className="flex gap-2.5 text-sm text-ink-2">
          <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
          <span>{prose(i)}</span>
        </li>
      ))}
    </ul>
  );
}

/**
 * Сетка тарифов. На десктопе строки карточек - общая сетка (subgrid): название,
 * цена, подпись, состав и кнопка стоят на одной линии во всех карточках.
 * Популярный тариф - тёмная карточка чуть выше соседей, пилюля на кромке.
 */
function PlanGrid({ plans }: { plans: ServicePlan[] }) {
  return (
    <Reveal stagger className="mt-12 grid gap-7 lg:mt-16 lg:grid-cols-3 lg:gap-x-5 lg:gap-y-0">
      {plans.map((p) => (
        <div
          key={p.name}
          data-reveal
          className={cn(
            "relative flex flex-col rounded-xl border border-border p-7 lg:row-span-5 lg:grid lg:grid-rows-subgrid",
            // -my-4 и py-11 гасят друг друга в subgrid: строки остаются на линии соседей
            p.featured ? "tone-ink shadow-float lg:-my-4 lg:py-11" : "bg-bg shadow-card",
          )}
        >
          {p.featured && (
            // accent в tone-ink светлеет - на мягкой пилюле держим базовый тон
            <Pill variant="soft" size="sm" className="absolute -top-3.5 left-7 text-accent-strong">
              Популярно
            </Pill>
          )}
          <h3 className="text-lg font-semibold tracking-tight text-ink">{p.name}</h3>
          <div className="mt-5 text-3xl font-semibold tracking-tight text-ink">
            {money(p.price)}
          </div>
          <div className="mt-1.5 text-sm text-muted">{p.sub ? prose(p.sub) : NB}</div>
          <Checks items={p.includes} className="mt-6" />
          <Button
            href="/contacts"
            variant={p.featured ? "accent" : "secondary"}
            // белый на светлом коралле тёмной карточки - ниже AA, заливка базовым тоном
            className={cn("mt-8 w-full", p.featured && "bg-accent-strong")}
          >
            Обсудить тариф
          </Button>
        </div>
      ))}
    </Reveal>
  );
}

/**
 * Одна карточка: слева цена и кнопка, справа что входит в стоимость и что
 * оплачивается отдельно; без фактов справа встаёт приписка. На мобиле кнопка -
 * последней, после деталей.
 */
function PriceCard({ price, note }: { price: ServicePrice; note?: string }) {
  // «/мес» мельче суммы и переносится целиком, если сумма не влезла
  const [, amount = price.value, period] = price.value.match(/^(.*?)(\/\s*мес)$/) ?? [];
  const hasDetails = Boolean(price.facts || price.separate || note);
  return (
    <Reveal
      className={cn(
        "mx-auto mt-10 grid max-w-4xl gap-8 rounded-xl border border-border bg-bg p-7 shadow-card sm:p-9",
        hasDetails && "lg:grid-cols-2 lg:grid-rows-[auto_1fr] lg:gap-x-12",
      )}
    >
      <div>
        <div className="text-h2 text-ink">
          {money(amount)}
          {period && (
            <>
              <wbr />
              <span className="text-lg font-medium leading-none tracking-normal text-muted">
                {money(period)}
              </span>
            </>
          )}
        </div>
        <div className="mt-2 text-sm text-muted">{prose(price.sub)}</div>
      </div>
      {hasDetails && (
        <div className="flex flex-col gap-5 lg:row-span-2 lg:border-l lg:border-border lg:pl-12">
          {price.facts && (
            <div>
              <div className="text-label uppercase text-muted">Входит в стоимость</div>
              <Checks items={price.facts} className="mt-4" />
            </div>
          )}
          {price.separate && (
            <p
              className={cn(
                "flex gap-2.5 text-sm text-ink",
                price.facts && "border-t border-border pt-5",
              )}
            >
              <span aria-hidden className="w-4 shrink-0 text-center font-semibold">
                +
              </span>
              <span>{prose(price.separate)}</span>
            </p>
          )}
          {note && <p className="text-sm leading-relaxed text-ink-2">{prose(note)}</p>}
        </div>
      )}
      <div className="lg:self-start">
        <Button href="/contacts" variant="accent" size="lg" className="max-sm:w-full">
          Узнать точную смету
        </Button>
      </div>
    </Reveal>
  );
}

/** Секция «Тарифы» страницы услуги: сетка тарифов или одна карточка цены + приписка. */
export function ServicePricing({
  title,
  plans,
  price,
  note,
}: {
  title: string;
  /** Тарифы сеткой; не заданы - одна карточка `price`. */
  plans?: ServicePlan[];
  price: ServicePrice;
  /** Приписка: под сеткой или внутри одной карточки. */
  note?: string;
}) {
  return (
    <Section>
      <SectionHeader eyebrow="Тарифы" title={title} align="center" />
      {plans ? (
        <>
          <PlanGrid plans={plans} />
          {note && (
            <Reveal className="mt-10">
              <p className="mx-auto max-w-2xl text-center text-sm leading-relaxed text-ink-2">
                {prose(note)}
              </p>
            </Reveal>
          )}
        </>
      ) : (
        <PriceCard price={price} note={note} />
      )}
    </Section>
  );
}
