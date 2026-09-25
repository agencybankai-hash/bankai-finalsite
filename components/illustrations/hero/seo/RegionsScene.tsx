import { cn } from "@/lib/utils";
import { Chip, LeadDot } from "../../parts";
import { anim } from "../../vars";

/* Очередь регионов: абстрактная схема городов (без контура страны - точки
   примерно по географии) и колонка очереди на одном домене. Город получает
   состояние вместе со своим пунктом очереди: в работе - заливка, следующий -
   кольцо, в очереди - пунктир. Базовый стиль - финальный кадр. */

/** Таймлайн, с: точки с запада на восток → очередь по пунктам → KZ → заявка у Алматы. */
const T = { dots: 0.9, dotStep: 0.04, kz: 2.2, lead: 2.4 };

type State = "work" | "next" | "queue";

/** Пункты очереди: смена состояния точки и пункт колонки - в один момент. */
const QUEUE: { n: number; city: string; status: string; state: State; at: number }[] = [
  { n: 1, city: "Алматы", status: "в работе", state: "work", at: 1.4 },
  { n: 2, city: "Астана", status: "следующий", state: "next", at: 1.7 },
  { n: 3, city: "Шымкент", status: "в очереди", state: "queue", at: 2.0 },
];

/** Точки схемы, % панели: долгота и широта в равнопромежуточной проекции, без
 *  контура страны. Порядок - с запада на восток: так идёт каскад появления. */
const DOTS: { x: number; y: number; city?: string }[] = [
  { x: 10, y: 76 }, // Актау
  { x: 11.8, y: 56.8 }, // Атырау
  { x: 25.2, y: 39 }, // Актобе
  { x: 41.4, y: 22.8 }, // Костанай
  { x: 51.8, y: 52.9 }, // Жезказган
  { x: 56.6, y: 83.5, city: "Шымкент" },
  { x: 61.3, y: 34.2, city: "Астана" },
  { x: 75, y: 78.3, city: "Алматы" },
  { x: 75.2, y: 27.8 }, // Павлодар
  { x: 89.5, y: 40.9 }, // Усть-Каменогорск
];

/** Алматы: у неё заявка. */
const ALMATY = DOTS.find((d) => d.city === "Алматы")!;

const MARK: Record<State, string> = {
  work: "bg-ink ring-[0.8em] ring-ink/10",
  next: "border-[max(1.5px,0.2em)] border-ink",
  queue: "border-[max(1.5px,0.2em)] border-dashed border-muted",
};

/** Метка состояния поверх точки города; подпись города внутри метки - появляется
 *  вместе с ней. */
function CityMark({ q, x, y }: { q: (typeof QUEUE)[number]; x: number; y: number }) {
  return (
    <span className="absolute" style={{ left: `${x}%`, top: `${y}%` }}>
      <span
        className={cn("reg-mark a-pop absolute block rounded-full", MARK[q.state])}
        style={anim({ delay: q.at })}
      >
        <span
          className={cn(
            "ill-t-sm absolute whitespace-nowrap leading-none",
            q.state === "queue" ? "text-muted" : "text-ink",
            `reg-label-${q.state}`,
          )}
        >
          {q.city}
        </span>
      </span>
    </span>
  );
}

/** Значок состояния в пункте очереди - тот же, что на схеме. */
function Glyph({ state }: { state: State }) {
  return (
    <span
      aria-hidden
      className={cn(
        "block h-[max(8px,0.9em)] w-[max(8px,0.9em)] shrink-0 rounded-full",
        state === "work" && "bg-bg",
        state === "next" && "border-[max(1.5px,0.18em)] border-ink",
        state === "queue" && "border-[max(1.5px,0.18em)] border-dashed border-muted",
      )}
    />
  );
}

function Scheme() {
  const byCity = new Map(QUEUE.map((q) => [q.city, q]));
  return (
    <div className="reg-map relative h-full shrink-0 overflow-hidden rounded-[0.9em] border border-border bg-surface">
      <span aria-hidden className="reg-grid absolute inset-0" />
      <span className="ill-t-sm ill-detail absolute left-[0.8em] top-[0.7em] leading-none text-muted">
        Казахстан
      </span>
      {DOTS.map((d, i) => (
        <span
          key={i}
          className="reg-dot a-pop absolute block rounded-full bg-ink/35"
          style={{
            left: `${d.x}%`,
            top: `${d.y}%`,
            ...anim({ delay: T.dots, i, step: T.dotStep }),
          }}
        />
      ))}
      {DOTS.filter((d) => d.city).map((d) => (
        <CityMark key={d.city} q={byCity.get(d.city!)!} x={d.x} y={d.y} />
      ))}
      {/* Заявка у Алматы */}
      <span
        className="reg-lead absolute flex items-center gap-[0.4em]"
        style={{ left: `${ALMATY.x}%`, top: `${ALMATY.y}%` }}
      >
        <LeadDot delay={T.lead} />
        <span
          className="a-fade ill-t-sm ill-detail leading-none text-muted"
          style={anim({ delay: T.lead + 0.05 })}
        >
          заявки
        </span>
      </span>
    </div>
  );
}

/** Сцена SEO по Казахстану: регионы по очереди на одном домене. */
export function SeoRegionsScene() {
  return (
    <div className="absolute inset-0 flex gap-[1.4em]">
      <Scheme />

      <div className="flex min-w-0 flex-1 flex-col justify-center">
        <span className="ill-t-sm ill-detail truncate leading-none text-muted">ваш-сайт.kz</span>
        <ol className="mt-[0.9em] flex flex-col gap-[0.6em]">
          {QUEUE.map((q) => (
            <li
              key={q.n}
              className={cn(
                "a-rise flex items-center gap-[0.7em] rounded-[0.8em] px-[0.9em] py-[0.7em]",
                q.state === "work" && "bg-ink text-bg",
                q.state === "next" && "border border-ink/50 text-ink",
                q.state === "queue" && "border border-dashed border-border text-muted",
              )}
              style={anim({ delay: q.at }, { "--a-y": "0.6em" })}
            >
              <Glyph state={q.state} />
              <span className="min-w-0">
                <span className="ill-t-md block truncate font-medium leading-tight">
                  {q.n} · {q.city}
                </span>
                <span
                  className={cn(
                    "ill-t-sm mt-[0.15em] block truncate leading-tight",
                    q.state === "work" ? "text-bg/70" : "text-muted",
                  )}
                >
                  {q.status}
                </span>
              </span>
            </li>
          ))}
        </ol>
        <div className="a-fade mt-[1.1em] flex" style={anim({ delay: T.kz })}>
          <Chip tone="outline" className="border-ink/40 text-ink">
            KZ-версия по данным
          </Chip>
        </div>
      </div>
    </div>
  );
}
