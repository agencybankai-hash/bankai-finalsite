import type { ReactNode } from "react";
import { Bar, Chip, LeadDot } from "../../parts";
import type { SceneProps } from "../../types";
import { anim } from "../../vars";
import { CityCard, hasCityCard } from "./CityCard";
import {
  Block,
  Cta,
  IconBox,
  Nav,
  Phone,
  Photo,
  RoundButton,
  at,
  type IconName,
} from "./kit";

/* Сцена «Сайт под заявки»: слева телефон с мини-сайтом, справа лента событий
   аналитики. Базовый стиль - финальный кадр. Движение - по одному примитиву:
   телефон, заливка каждого блока (под ней контур-вайрфрейм .web-wire),
   нижняя панель, касание, карточка ленты и её строки. Городские страницы -
   та же сцена, первые две строки ленты заменяет карточка города (CityCard). */

/** Таймлайн, с: телефон → блоки сверху вниз → панель связи → касание →
 *  события в ленте → заявка. */
const T = {
  phone: 0.6,
  block: 0.75,
  blockStep: 0.1,
  bar: 1.4,
  tap: 1.75,
  feed: 0.9,
  city: 1.35,
  row: 1.85,
  rowStep: 0.11,
  lead: 2.45,
};
const blockAt = (i: number) => at(T.block + i * T.blockStep);

type FeedRow = { icon: IconName; label: string; tag: string; tone: "outline" | "muted" };

const TRAFFIC: FeedRow[] = [
  { icon: "ad", label: "Визит · из рекламы", tag: "трафик", tone: "outline" },
  { icon: "search", label: "Визит · из поиска", tag: "трафик", tone: "outline" },
];
const WHATSAPP: FeedRow = { icon: "chat", label: "Клик в WhatsApp", tag: "цель ✓", tone: "muted" };

/** Нижняя панель выезжает снизу на всю высоту - до старта её прячет край экрана. */
function ContactBar() {
  return (
    <div
      className="a-slide flex h-[3.7em] shrink-0 items-center justify-around border-t border-border bg-surface px-[0.8em]"
      style={anim({ delay: T.bar }, { "--a-y": "100%" })}
    >
      <RoundButton icon="form" />
      <RoundButton icon="chat" tap={T.tap} />
      <RoundButton icon="phone" />
    </div>
  );
}

/** Заголовок мини-сайта; в компактной сцене - скелетон (текст не влезает в узкий экран). */
function SiteScreen() {
  return (
    <>
      <Nav icon="menu" delay={blockAt(0)} />
      <Block delay={blockAt(1)} fill="flex flex-col gap-[0.55em]">
        <span className="ill-t-sm ill-detail font-semibold leading-[1.2] text-ink">
          {"Ремонт квартир под\u00a0ключ"}
        </span>
        <span className="web-compact flex-col gap-[0.45em]">
          <Bar w="100%" tone="strong" />
          <Bar w="60%" tone="strong" />
        </span>
        <Bar w="85%" tone="faint" />
      </Block>
      <Block delay={blockAt(2)} fill="flex gap-[0.4em]">
        <Chip>цена</Chip>
        <Chip className="ill-detail">сроки</Chip>
      </Block>
      <Photo delay={blockAt(3)} art="room" className="h-[6.4em]" />
      <Cta delay={blockAt(4)} short="Заявка" />
    </>
  );
}

function Row({ r, delay }: { r: FeedRow; delay: number }) {
  return (
    <div
      className="a-rise flex h-[3.5em] items-center gap-[0.8em] border-t border-border"
      style={anim({ delay })}
    >
      <IconBox name={r.icon} />
      <span className="ill-t-sm min-w-0 flex-1 truncate text-ink">{r.label}</span>
      <Chip tone={r.tone} className="ill-detail">
        {r.tag}
      </Chip>
    </div>
  );
}

/** Карточка событий проявляется вместе с телефоном и ждёт; строки приходят каскадом
 *  после касания, точка заявки - последней. top - карточка города вместо двух строк трафика. */
function Feed({ title, top }: { title: string; top?: ReactNode }) {
  const rows = top ? [WHATSAPP] : [...TRAFFIC, WHATSAPP];
  // строки после карточки города идут на её местах в каскаде
  const first = top ? 2 : 0;
  return (
    <div
      className="a-fade absolute left-[18.5em] right-[1.2em] top-[4.4em] rounded-[1.4em] border border-border bg-surface p-[1.1em]"
      style={anim({ delay: T.feed })}
    >
      <div className="ill-t-sm flex h-[1.9em] items-center truncate font-medium uppercase tracking-[0.08em] text-muted">
        {title}
      </div>
      <div className="mt-[0.5em]">
        {top}
        {rows.map((r, i) => (
          <Row key={r.label} r={r} delay={at(T.row + (first + i) * T.rowStep)} />
        ))}
        <div
          className="a-rise mt-[0.3em] flex min-h-[4em] items-center gap-[0.8em] rounded-[0.9em] border border-border bg-surface-2 px-[0.7em] py-[0.5em]"
          style={anim({ delay: at(T.row + 3 * T.rowStep) })}
        >
          <IconBox name="send" className="bg-ink/10 text-ink" />
          <div className="flex min-w-0 flex-1 items-center gap-[0.6em]">
            <span className="ill-t-sm min-w-0 flex-1 truncate font-medium text-ink">Форма отправлена</span>
            <Chip tone="solid" className="ill-detail">
              заявка
            </Chip>
            <LeadDot delay={T.lead} />
          </div>
        </div>
      </div>
    </div>
  );
}

/** Сцена сайта: телефон с мини-сайтом ведёт к заявке, события видны в аналитике. */
export function WebScene({ v }: SceneProps) {
  const city = v.kind === "web-city" && hasCityCard(v.city) ? v.city : undefined;
  return (
    <div className="absolute inset-0">
      <Phone
        className="left-[1.5em] top-[1em] h-[28em] w-[14.5em]"
        delay={T.phone}
        bottom={<ContactBar />}
      >
        <SiteScreen />
      </Phone>
      <Feed
        title={`События · ${v.city ?? "аналитика"}`}
        top={city && <CityCard city={city} delay={T.city} />}
      />
    </div>
  );
}
