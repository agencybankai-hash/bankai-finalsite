import { Icon, type IconName } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";
import { Bar, Chip, LeadDot } from "../../parts";
import type { SceneProps } from "../../types";

/* Лидген: граф узлов «Реклама / SEO → Сайт → Заявки → CRM».
   Геометрия - единицы viewBox 480×300 (10 ед. = 1em): узлы - HTML в em,
   связи - SVG, порт узла стоит ровно на конце своей связи. Размеры узлов
   фиксированы в em, поэтому пороги кегля не сдвигают порты. */

/** Связи. Частица (a-flow) - дубликат того же d с pathLength="1". */
const LINK = {
  ad: "M146 62 C166 62 164 150 208 150",
  seo: "M146 238 C166 238 164 150 208 150",
  out: "M308 150 H356",
  crm: "M411 176 V240",
};

const PORT = "absolute h-[0.9em] w-[0.9em] rounded-full border-[0.2em] border-muted bg-bg";
const PORT_Y = "top-1/2 -mt-[0.45em]";

/** Источник трафика: узел слева, выход - порт справа. */
function Source({
  icon,
  title,
  sub,
  className,
}: {
  icon: IconName;
  title: string;
  sub: string;
  className: string;
}) {
  return (
    <div
      className={cn(
        "absolute left-[1.2em] flex h-[6em] w-[13.4em] items-center gap-[0.7em] rounded-[0.9em] border border-border bg-surface px-[0.9em]",
        className,
      )}
    >
      <span className="ill-detail grid h-[2.4em] w-[2.4em] shrink-0 place-items-center rounded-[0.6em] bg-surface-2 text-ink-2">
        <Icon name={icon} className="h-[1.4em] w-[1.4em]" />
      </span>
      <span className="min-w-0">
        <span className="ill-t-md block truncate font-medium text-ink">{title}</span>
        <span className="ill-t-sm ill-detail mt-[0.15em] block truncate text-muted">{sub}</span>
      </span>
      <span aria-hidden className={cn(PORT, PORT_Y, "-right-[0.45em]")} />
    </div>
  );
}

export function LeadgenScene({ v }: SceneProps) {
  return (
    <>
      <svg
        viewBox="0 0 480 300"
        aria-hidden
        className="absolute inset-0 h-full w-full"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      >
        <path d={LINK.ad} pathLength={1} className="text-muted" />
        <path d={LINK.seo} pathLength={1} className="text-muted" />
        <path d={LINK.out} pathLength={1} className="text-ink-2" />
        <path d={LINK.crm} pathLength={1} className="ill-detail text-border" />
      </svg>

      <Source icon="target" title="Реклама" sub="с 1-й недели" className="top-[3.2em]" />
      <Source icon="search" title="SEO" sub="с 3-4 мес" className="top-[20.8em]" />

      {/* Сайт: окно браузера, строки сужаются к кнопке - намёк на конус сепаратора */}
      <div className="absolute left-[20.8em] top-[10em] flex h-[10em] w-[10em] flex-col rounded-[1.2em] border border-border bg-surface p-[0.9em]">
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[0.5em] border border-border bg-bg">
          <div className="flex h-[1.4em] shrink-0 items-center gap-[0.3em] border-b border-border px-[0.5em]">
            <span className="h-[0.4em] w-[0.4em] rounded-full bg-ink/20" />
            <span className="h-[0.4em] w-[0.4em] rounded-full bg-ink/20" />
            <span className="h-[0.4em] w-[0.4em] rounded-full bg-ink/20" />
          </div>
          <div className="flex flex-1 flex-col items-center justify-center gap-[0.45em] px-[0.7em]">
            <Bar w="100%" />
            <Bar w="64%" tone="faint" />
            <Bar w="34%" tone="strong" className="h-[0.8em]" />
          </div>
        </div>
        <span className="ill-t-md mt-[0.5em] text-center font-medium leading-none text-ink">
          Сайт
        </span>
        <span aria-hidden className={cn(PORT, PORT_Y, "-left-[0.45em]")} />
        <span aria-hidden className={cn(PORT, PORT_Y, "-right-[0.45em]")} />
      </div>
      {/* em позиции - от сцены: текстовый кегль только внутри обёртки */}
      <div className="ill-detail absolute left-[16.4em] top-[20.7em] w-[20em] text-center">
        <span className="ill-t-sm whitespace-nowrap text-muted">форма · WhatsApp · звонок</span>
      </div>

      {/* Заявки: светлый узел-цель, единственный коралл - точка заявки */}
      <div className="absolute left-[35.6em] top-[12.4em] flex h-[5.2em] w-[11em] items-center gap-[0.7em] rounded-[0.9em] bg-ink px-[1em] text-bg">
        <LeadDot className="h-[max(8px,1.2em)] w-[max(8px,1.2em)]" />
        <span className="ill-t-md truncate font-semibold">Заявки</span>
        <span aria-hidden className={cn(PORT, PORT_Y, "-left-[0.45em]")} />
        <span
          aria-hidden
          className={cn(PORT, "ill-detail -bottom-[0.45em] left-1/2 -ml-[0.45em]")}
        />
      </div>

      {v.city && (
        <div className="ill-detail absolute right-[1.4em] top-[9.2em]">
          <Chip tone="outline">
            <svg
              viewBox="0 0 24 24"
              aria-hidden
              className="h-[1.1em] w-[1.1em]"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z" />
              <circle cx="12" cy="10" r="2.3" />
            </svg>
            {v.city}
          </Chip>
        </div>
      )}

      <div className="ill-detail absolute right-[1.4em] top-[24em]">
        <Chip>CRM · цена каждой заявки</Chip>
      </div>
    </>
  );
}
