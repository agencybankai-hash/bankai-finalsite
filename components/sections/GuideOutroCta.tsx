import { Section } from "@/components/ui/Section";
import { nbsp } from "@/lib/utils";
import { contacts } from "@/content/site";
import type { GuideBonus } from "@/content/types";

/**
 * Хвост гайда без гейта: бесплатное скачивание чек-листа + мягкий CTA «подпишитесь».
 * Без email/API - вся ценность бесплатно.
 */
export function GuideOutroCta({ bonus }: { bonus: GuideBonus }) {
  return (
    <Section tone="surface" id="bonus">
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Бесплатный чек-лист */}
        <div className="rounded-xl border border-border bg-bg p-6 sm:p-8">
          <span className="inline-flex items-center rounded-md border border-ink bg-ink px-2.5 py-0.5 text-xs font-medium text-bg">
            Бесплатно
          </span>
          <h2 className="mt-4 text-xl font-semibold tracking-tight text-ink sm:text-2xl">
            {nbsp(bonus.title)}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-ink-2">{nbsp(bonus.lead)}</p>
          <ul className="mt-5 space-y-2.5">
            {bonus.bullets.map((b) => (
              <li key={b} className="flex gap-2.5 text-sm leading-relaxed text-ink-2">
                <span aria-hidden className="text-ink">
                  ✓
                </span>
                {nbsp(b)}
              </li>
            ))}
          </ul>
          <a
            href={bonus.file}
            download
            className="mt-6 inline-flex h-12 items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-ink px-6 text-base font-medium text-bg hover:bg-ink-2"
          >
            Скачать чек-лист (PDF)
          </a>
        </div>

        {/* Поблагодарить - подписаться */}
        <div className="flex flex-col justify-center rounded-xl border border-border bg-bg p-6 sm:p-8">
          <h3 className="text-lg font-semibold text-ink">
            Понравилось? Поблагодарите - подпишитесь
          </h3>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-ink-2">
            Мы отдаём это бесплатно. Если было полезно - подпишитесь на разборы по
            перформанс-маркетингу в Telegram и на YouTube.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={contacts.telegramChannelUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center justify-center rounded-lg border border-border bg-bg px-5 text-sm font-medium text-ink hover:bg-surface"
            >
              Telegram
            </a>
            <a
              href={contacts.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center justify-center rounded-lg border border-border bg-bg px-5 text-sm font-medium text-ink hover:bg-surface"
            >
              YouTube
            </a>
          </div>
        </div>
      </div>
    </Section>
  );
}
