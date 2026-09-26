import { cn } from "@/lib/utils";
import { Bar, Chip, LeadDot } from "../../parts";
import { anim } from "../../vars";
import { Icon, IconBox, Logo, type IconName } from "./kit";

/* Корпоративный сайт: браузер «компания.kz» с меню и языками, внутри
   прорисовывается карта сайта «Главная → Услуги → Направление 1/2/3», у
   каждой страницы направления - форма. Заявка с формы «Направления 2»
   точкой уходит вниз в карточку CRM с пометкой страницы и канала.
   Вертикальная раскладка - web.css (.web-corp-*). */

/** Таймлайн, с: браузер → узлы → дерево 1.1-1.5 и карточки направлений до 1.7
 *  (средняя - первой: к ней ведёт ствол) → CRM → точка от формы к CRM 1.9 →
 *  заявка 2.5. */
const T = {
  browser: 0.5,
  home: 0.8,
  services: 0.95,
  stem: 1.1,
  trunk: 1.2,
  fork: 1.25,
  cards: [1.4, 1.35, 1.4],
  crm: 1.55,
  drop: 1.75,
  dot: 1.9,
  lead: 2.5,
};

function Node({ icon, children, className }: { icon: IconName; children: string; className?: string }) {
  return (
    <span
      className={cn(
        "web-corp-node ill-t-sm relative flex items-center gap-[0.45em] rounded-full border bg-bg px-[0.9em] leading-none",
        className,
      )}
    >
      <Icon name={icon} className="h-[1.1em] w-[1.1em] text-ink-2" />
      {children}
    </span>
  );
}

/** Линия дерева: растёт сверху вниз (a-grow-y, опора - верх: web.css). */
function Stem({ delay, dur, className }: { delay: number; dur: number; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn("a-grow-y block w-0 border-l border-muted", className)}
      style={anim({ delay, dur })}
    />
  );
}

/** Страница направления: название, скелетон, глиф формы. У «Направления 2» с формы
 *  уходит заявка: связь вниз к CRM и точка по ней (едет, у CRM гаснет). */
function Direction({ n, i }: { n: number; i: number }) {
  const lead = n === 2;
  return (
    <div
      className={cn(
        "web-corp-card a-rise flex min-w-0 flex-col justify-between rounded-[0.9em] border bg-surface-2",
        lead ? "border-ink/30" : "border-border",
      )}
      style={anim({ delay: T.cards[i], dur: 0.3 }, { "--a-y": "0.6em" })}
    >
      <span className={cn("ill-t-sm truncate leading-none", lead ? "font-medium text-ink" : "text-ink-2")}>
        Направление {n}
      </span>
      <span className="flex items-end gap-[0.6em]">
        <span className="flex min-w-0 flex-1 flex-col gap-[0.4em]">
          <Bar w="90%" tone="faint" />
          <Bar w="60%" tone="faint" />
        </span>
        <span
          className={cn(
            "relative grid h-[1.9em] w-[1.9em] shrink-0 place-items-center rounded-[0.5em]",
            lead ? "bg-ink/15 text-ink" : "bg-ink/5 text-ink-2",
          )}
        >
          <Icon name="form" className="h-[1.1em] w-[1.1em]" />
          {lead && (
            <>
              <span aria-hidden className="web-corp-drop absolute left-1/2 top-full w-0">
                <Stem delay={T.drop} dur={0.2} className="h-full" />
              </span>
              <span aria-hidden className="web-corp-dot a-slide absolute left-1/2 -ml-[0.35em] h-[0.7em] w-[0.7em]" style={anim({ delay: T.dot, dur: 0.45 })}>
                <span
                  className="a-fade-out block h-full w-full rounded-full bg-ink"
                  style={anim({ delay: T.dot + 0.4, dur: 0.2 })}
                />
              </span>
            </>
          )}
        </span>
      </span>
    </div>
  );
}

function Browser() {
  return (
    <div
      className="web-corp-browser a-rise absolute left-[1.2em] right-[1.2em] top-[0.6em] flex flex-col rounded-[1.3em] border border-border bg-surface"
      style={anim({ delay: T.browser })}
    >
      <div className="web-corp-bar flex shrink-0 items-center gap-[0.9em] border-b border-border px-[1em]">
        <span className="ill-detail flex gap-[0.4em]">
          {[0, 1, 2].map((k) => (
            <span key={k} className="h-[0.55em] w-[0.55em] rounded-full bg-ink/20" />
          ))}
        </span>
        <span className="ill-t-sm flex min-w-0 items-center gap-[0.4em] rounded-full bg-bg px-[0.8em] py-[0.3em] leading-none text-ink-2">
          <Icon name="lock" className="h-[1em] w-[1em]" />
          компания.kz
        </span>
      </div>
      <div className="web-corp-bar flex shrink-0 items-center gap-[1.2em] border-b border-border px-[1em]">
        <span className="ill-detail">
          <Logo />
        </span>
        <span className="ill-t-sm flex min-w-0 gap-[0.9em] whitespace-nowrap leading-none">
          <span className="text-ink underline decoration-ink/60 underline-offset-[0.35em]">Услуги</span>
          <span className="text-muted">Кейсы</span>
          <span className="text-muted">О компании</span>
        </span>
        <span className="ill-t-sm ml-auto flex shrink-0 items-center gap-[0.35em] leading-none">
          <span className="font-medium text-ink">RU</span>
          <span className="text-muted">·</span>
          <span className="text-ink-2">KZ</span>
          <span className="text-muted">·</span>
          <span className="text-ink-2">EN</span>
        </span>
      </div>

      {/* Карта сайта */}
      <div className="web-corp-tree flex flex-1 flex-col items-center px-[1em]">
        <span className="a-pop" style={anim({ delay: T.home, dur: 0.4 })}>
          <Node icon="home" className="border-border text-ink-2">
            Главная
          </Node>
        </span>
        <Stem delay={T.stem} dur={0.2} className="web-corp-gap" />
        <span className="a-pop" style={anim({ delay: T.services, dur: 0.4 })}>
          <Node icon="grid" className="border-ink/30 font-medium text-ink">
            Услуги
          </Node>
        </span>
        {/* Ветвление: ствол до средней карточки, перекладина с краями - к крайним */}
        <div className="web-corp-gap relative w-full">
          <Stem delay={T.trunk} dur={0.25} className="absolute left-1/2 top-0 h-full" />
          <span
            aria-hidden
            className="web-corp-fork a-grow-x absolute bottom-0 top-1/2 rounded-t-[0.4em] border-x border-t border-muted"
            style={anim({ delay: T.fork, dur: 0.25 })}
          />
        </div>
        <div className="web-corp-cols grid w-full grid-cols-3">
          {[1, 2, 3].map((n, i) => (
            <Direction key={n} n={n} i={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

/** CRM: заявка с пометкой страницы и канала; точка заявки - единственный коралл. */
function Crm() {
  return (
    <div
      className="web-corp-crm a-rise absolute left-[3.5em] w-[27.3em] rounded-[1.2em] border border-border bg-surface px-[1em]"
      style={anim({ delay: T.crm, dur: 0.5 }, { "--a-y": "0.8em" })}
    >
      <div className="flex items-center gap-[0.7em]">
        <IconBox name="inbox" className="ill-detail bg-ink/10 text-ink" />
        <span className="ill-t-sm min-w-0 flex-1 truncate font-medium text-ink">Новая заявка</span>
        <Chip tone="outline">CRM</Chip>
        <LeadDot delay={T.lead} />
      </div>
      <div className="ill-t-sm mt-[0.5em] flex flex-wrap gap-x-[1.1em] gap-y-[0.25em] leading-tight text-muted">
        <span className="whitespace-nowrap">
          страница: <span className="text-ink">Направление 2</span>
        </span>
        <span className="whitespace-nowrap">
          канал: <span className="text-ink">поиск</span>
        </span>
      </div>
    </div>
  );
}

/** Сцена корпоративного сайта: страница под каждое направление, заявка - в CRM. */
export function CorporateScene() {
  return (
    <div className="web-corp absolute inset-0">
      <Browser />
      <Crm />
    </div>
  );
}
