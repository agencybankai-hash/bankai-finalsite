import { Reveal } from "@/components/motion/Reveal";
import { MessengerButton } from "@/components/ui/Button";
import { Disclosure } from "@/components/ui/Disclosure";
import { Section, SectionHeader } from "@/components/ui/Section";
import { contacts } from "@/content/site";
import type { FaqItem } from "@/content/types";
import { cn, keepHyphens, nbsp } from "@/lib/utils";

/** Список вопросов: строки на тонких линиях, «+» в круге. */
export function FAQ({ items, className }: { items: FaqItem[]; className?: string }) {
  return (
    <Reveal stagger className={cn("border-t border-border", className)}>
      {items.map((f) => (
        <div key={f.q} data-reveal className="border-b border-border">
          <Disclosure
            buttonClassName="group -mx-3 w-[calc(100%+--spacing(6))] items-start px-3 py-6 text-lg font-medium leading-snug text-ink"
            iconClassName="-mt-1.5 grid h-9 w-9 place-items-center rounded-full border border-border text-lg text-ink-2 transition-[transform,border-color,color] group-hover:border-ink group-hover:text-ink group-aria-expanded:border-ink group-aria-expanded:text-ink"
            panelClassName="pb-6 pr-12"
            label={<span>{keepHyphens(nbsp(f.q))}</span>}
          >
            <p className="text-base leading-relaxed text-ink-2">{nbsp(f.a)}</p>
          </Disclosure>
        </div>
      ))}
    </Reveal>
  );
}

/** «Не нашли ответ?» - прямой контакт для вопроса, которого нет в списке. */
function FaqContact({ className }: { className?: string }) {
  return (
    <Reveal className={cn("rounded-2xl border border-border p-7 sm:p-8", className)}>
      <h3 className="text-xl font-semibold tracking-tight text-ink">Не нашли ответ?</h3>
      <p className="mt-2 text-base leading-relaxed text-ink-2">
        {nbsp(
          "Напишите в WhatsApp, Telegram или на почту - ответим в течение рабочего дня, обычно быстрее.",
        )}
      </p>
      <div className="mt-6 grid max-w-sm grid-cols-2 gap-3">
        <MessengerButton
          messenger="whatsapp"
          label="WhatsApp"
          ariaLabel="Написать в WhatsApp"
          className="h-12"
        />
        <MessengerButton
          messenger="telegram"
          label="Telegram"
          ariaLabel="Написать в Telegram"
          className="h-12"
        />
      </div>
      <a
        href={`mailto:${contacts.email}`}
        className="mt-4 inline-block text-sm font-medium text-ink underline decoration-border underline-offset-4 transition duration-300 ease-osmo hover:decoration-ink"
      >
        {contacts.email}
      </a>
    </Reveal>
  );
}

/**
 * Секция FAQ: на десктопе слева заголовок и карточка контакта (липнет,
 * пока читают длинные ответы), справа вопросы. На мобиле - заголовок,
 * вопросы, карточка: порядок в DOM совпадает с порядком чтения.
 */
export function FaqSection({
  title,
  items,
  tone,
}: {
  title: string;
  items: FaqItem[];
  tone?: "default" | "surface";
}) {
  return (
    <Section tone={tone}>
      <div className="grid gap-10 lg:grid-cols-2 lg:grid-rows-[auto_1fr] lg:gap-x-16">
        <SectionHeader eyebrow="FAQ" title={title} className="lg:col-start-1 lg:row-start-1" />
        <FAQ items={items} className="lg:col-start-2 lg:row-span-2 lg:row-start-1" />
        <FaqContact
          className={cn(
            "lg:sticky lg:top-24 lg:col-start-1 lg:row-start-2 lg:self-start",
            tone === "surface" ? "bg-bg" : "bg-surface",
          )}
        />
      </div>
    </Section>
  );
}
