import { cn } from "@/lib/utils";
import { Bar, Chip, LeadDot, SearchBar } from "../../parts";
import type { SceneProps } from "../../types";

type Result = { title: string; url: string; price?: boolean };

/* Органика первой страницы: ширины скелетона в % колонки текста; price - цена
   в версии магазина (без цены - категории и маркетплейсы). Строки 7-10 на
   телефоне скрыты, строку 4 накрывает слот сайта. */
const TOP_10: Result[] = [
  { title: "64%", url: "30%", price: true },
  { title: "52%", url: "24%" },
  { title: "70%", url: "34%", price: true },
  { title: "58%", url: "26%" },
  { title: "48%", url: "30%", price: true },
  { title: "66%", url: "22%", price: true },
  { title: "55%", url: "32%" },
  { title: "61%", url: "26%", price: true },
  { title: "50%", url: "20%" },
  { title: "68%", url: "28%", price: true },
];
const PAGE_2: Result = { title: "46%", url: "24%", price: true };

/** Строка выдачи: фавикон (у магазина - превью товара), заголовок, адрес, цена. */
function Row({ r, store, className }: { r: Result; store: boolean; className?: string }) {
  return (
    <div className={cn("seo-row flex items-center gap-[0.8em]", className)}>
      <span
        className={cn(
          "shrink-0 bg-ink/15",
          store ? "h-[1.4em] w-[1.4em] rounded-[0.3em]" : "h-[1.1em] w-[1.1em] rounded-full",
        )}
      />
      <span className="flex min-w-0 flex-1 flex-col gap-[0.3em]">
        <Bar w={r.title} />
        <Bar w={r.url} tone="faint" className="h-[0.45em]" />
      </span>
      {store && r.price && (
        <span className="flex shrink-0 items-center gap-[0.35em]">
          <Bar w="2.4em" />
          <span className="ill-t-sm leading-none text-muted">₸</span>
        </span>
      )}
    </div>
  );
}

/** Очередь регионов на одном домене: первый в работе, следующий, в очереди. */
function RegionQueue() {
  return (
    <div className="flex shrink-0 items-center gap-[0.4em]">
      <Chip tone="solid">Алматы</Chip>
      <span className="ill-t-sm leading-none text-muted">›</span>
      <Chip tone="outline">Астана</Chip>
      <span className="ill-t-sm leading-none text-muted">›</span>
      <Chip tone="dashed">Шымкент</Chip>
    </div>
  );
}

const PINS = [
  ["26%", "66%"],
  ["55%", "88%"],
  ["80%", "50%"],
];

/** Мини-блок карт в рельсе городской выдачи: две улицы и три нейтральные метки. */
function MapPack() {
  return (
    <div className="seo-map ill-detail absolute right-0 top-0 w-(--seo-rail) overflow-hidden rounded-[0.6em] border border-border bg-surface">
      <span className="absolute -left-[10%] top-[64%] h-px w-[120%] -rotate-[8deg] bg-ink/15" />
      <span className="absolute -top-[10%] left-[64%] h-[120%] w-px rotate-[14deg] bg-ink/15" />
      <span className="ill-t-sm absolute left-[0.5em] top-[0.45em] leading-none text-muted">
        карты
      </span>
      {PINS.map(([x, y]) => (
        <span
          key={x}
          className="absolute h-[0.9em] w-[0.9em] -translate-x-1/2 -translate-y-full rotate-45 rounded-full rounded-br-none bg-ink/60"
          style={{ left: x, top: y }}
        />
      ))}
    </div>
  );
}

/** Слот сайта: строка 4 и маркер в рельсе - один блок. Строки одной высоты,
 *  поэтому будущий подъём из-под линии ТОП-10 - один translateY. */
function SiteSlot({ store }: { store: boolean }) {
  return (
    <div className="seo-slot absolute inset-x-0">
      <div className="flex h-full items-center">
        <div className="relative ml-[0.3em] flex h-full min-w-0 flex-1 items-center gap-[0.8em] rounded-[0.7em] bg-surface pl-[0.8em]">
          <span className="absolute inset-0 rounded-[0.7em] border border-ink/30" />
          {store ? (
            <span className="relative grid h-[max(10px,1.4em)] w-[max(10px,1.4em)] shrink-0 grid-cols-2 gap-[max(1px,0.14em)]">
              {[0, 1, 2, 3].map((k) => (
                <span key={k} className="rounded-[0.1em] bg-ink/60" />
              ))}
            </span>
          ) : (
            <span className="relative h-[1.1em] w-[1.1em] shrink-0 rounded-full bg-ink/60" />
          )}
          <span className="relative flex min-w-0 flex-1 flex-col gap-[0.3em]">
            {store ? (
              <span className="ill-t-sm truncate leading-none text-ink">Каталог › Кроссовки</span>
            ) : (
              /* Обычный заголовок под заливкой: подсветка строки - протяжка заливки поверх. */
              <span className="relative block h-[0.55em] w-[60%]">
                <Bar w="100%" className="absolute inset-0" />
                <Bar w="100%" tone="strong" className="absolute inset-0" />
              </span>
            )}
            <Bar w="28%" tone="faint" className="h-[0.45em]" />
          </span>
        </div>

        <div className="seo-rail relative ml-[1.4em] flex h-full shrink-0 items-center">
          <span className="ill-t-sm relative whitespace-nowrap rounded-full border border-ink/40 bg-bg px-[0.7em] py-[0.3em] leading-none text-ink">
            <span className="absolute left-0 top-1/2 h-[0.55em] w-[0.55em] -translate-x-1/2 -translate-y-1/2 rotate-45 border-b border-l border-ink/40 bg-bg" />
            ваш сайт
          </span>
          <span className="absolute left-[0.7em] top-full flex items-center gap-[0.4em]">
            <LeadDot className="h-[max(7px,1.1em)] w-[max(7px,1.1em)]" />
            <span className="ill-t-sm leading-none text-muted">{store ? "заказы" : "заявки"}</span>
          </span>
        </div>
      </div>
    </div>
  );
}

/** Сцена SEO: органическая выдача, сайт в первой десятке, заявки без оплаты за клик. */
export function SeoScene({ v }: SceneProps) {
  const store = v.kind === "seo-store";
  const regions = v.kind === "seo-regions";

  return (
    <div
      className={cn(
        "seo-scene absolute inset-0 flex flex-col overflow-hidden",
        store && "seo-store",
        regions && "seo-regions",
      )}
    >
      <div className="seo-top flex items-center gap-x-[0.8em] gap-y-[0.6em]">
        <SearchBar query={v.copy.query ?? ""} className="min-w-0 flex-auto" />
        {regions && <RegionQueue />}
      </div>

      <div className="relative mt-[0.9em]">
        <div className="seo-col pl-[1.1em]">
          {TOP_10.map((r, i) => (
            <Row key={i} r={r} store={store} className={i >= 6 ? "ill-detail" : undefined} />
          ))}
        </div>

        {/* Граница первой страницы */}
        <div className="seo-line flex items-center gap-[0.6em] pl-[1.1em]">
          <span className="flex-1 border-t border-dashed border-ink/25" />
          <span className="ill-t-sm leading-none text-muted">ТОП-10</span>
        </div>

        {/* Вторая страница */}
        <div className="seo-col pl-[1.1em] opacity-40">
          <Row r={PAGE_2} store={store} />
        </div>

        {v.kind === "seo-city" && <MapPack />}
        <SiteSlot store={store} />
      </div>
    </div>
  );
}
