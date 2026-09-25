import { Icon } from "@/components/ui/Icon";
import { pageCopy } from "@/content/visuals";
import { cn } from "@/lib/utils";
import { HeroFrame } from "../frame/HeroFrame";
import { Bar, LeadDot } from "../parts";

/* Сцена /contacts: заявка → ответ → бесплатный аудит → план и смета.
   Факты - со страницы контактов; строки аудита - скелетоны, без цифр. */

/** Разделы аудита: ok - порядок, иначе - здесь теряются заявки. */
const AUDIT = [
  { name: "Сайт", w: "72%", ok: true },
  { name: "Реклама", w: "54%", ok: false },
  { name: "SEO", w: "84%", ok: true },
  { name: "Аналитика", w: "44%", ok: false },
];

/** Отметка аудита: ✓ - контур, «!» - заливка (важнее). Путь рисуется (a-draw). */
function Mark({ ok }: { ok: boolean }) {
  return (
    <span
      className={cn(
        "grid h-[1.6em] w-[1.6em] shrink-0 place-items-center rounded-full",
        ok ? "border border-border text-ink-2" : "bg-ink text-bg",
      )}
    >
      <svg
        viewBox="0 0 16 16"
        aria-hidden
        className="h-[1.1em] w-[1.1em]"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path pathLength={1} d={ok ? "M4.4 8.4 6.9 10.9 11.6 5.6" : "M8 4.3v4.6M8 11.7v.01"} />
      </svg>
    </span>
  );
}

function ContactsScene() {
  return (
    <>
      {/* Переписка: сообщение посетителя справа, наш ответ слева */}
      <div className="absolute inset-x-[1.2em] top-[0.9em] flex flex-col">
        <p className="ill-t-md self-end whitespace-nowrap rounded-[1.1em] rounded-br-[0.3em] bg-ink px-[1.1em] py-[0.7em] text-bg">
          Хочу больше заявок. С чего начать?
        </p>
        <div className="mt-[0.5em] flex items-center gap-[0.5em] self-end pr-[0.2em]">
          <span className="ill-t-sm text-muted">ваша заявка</span>
          <LeadDot delay={0.85} />
        </div>
        {/* Слот ответа: сюда же ляжет индикатор набора (переходный слой) */}
        <div className="relative mt-[0.4em] self-start">
          <p className="ill-t-md whitespace-nowrap rounded-[1.1em] rounded-bl-[0.3em] bg-surface-2 px-[1.1em] py-[0.7em] text-ink">
            Изучим нишу и сайт - пришлём аудит
          </p>
        </div>
      </div>

      {/* Документ аудита */}
      <div className="absolute bottom-[1.2em] right-[1.2em] w-[36em] rounded-[1em] border border-border bg-surface px-[1.2em] py-[1em]">
        <div className="flex items-center gap-[0.6em]">
          <Icon name="doc" className="h-[1.5em] w-[1.5em] shrink-0 text-ink-2" />
          <span className="ill-t-md truncate font-medium text-ink">
            Аудит · где теряются заявки
          </span>
        </div>
        <div className="mt-[0.6em] flex flex-col gap-[0.3em]">
          {AUDIT.map((r) => (
            <div key={r.name} className="flex items-center gap-[0.9em]">
              <span className="ill-t-sm w-[7.4em] shrink-0 truncate text-ink-2">{r.name}</span>
              <span className="min-w-0 flex-1">
                <Bar w={r.w} tone={r.ok ? "faint" : "soft"} />
              </span>
              <Mark ok={r.ok} />
            </div>
          ))}
        </div>
        <div className="ill-t-sm mt-[0.8em] border-t border-border pt-[0.7em] font-medium text-ink">
          <span className="underline decoration-ink/30 underline-offset-[0.25em]">
            План и смета
          </span>{" "}
          →
        </div>
      </div>
    </>
  );
}

/** Hero /contacts: первые шаги после заявки. Только десктоп - на мобиле форма выше. */
export function ContactsHero() {
  return (
    <HeroFrame kind="contacts" copy={pageCopy.contacts} mobile="hide">
      <ContactsScene />
    </HeroFrame>
  );
}
