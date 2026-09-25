import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { ContactForm } from "@/components/sections/ContactForm";
import { contacts, finalCta } from "@/content/site";
import { finalCtaEn } from "@/content/en/site";
import type { Locale } from "@/content/types";
import { nbsp } from "@/lib/utils";

/**
 * Финальный CTA - единственная тёмная полоса страницы: заголовок и короткий
 * текст, под линией форма заявки в строку. Форма та же, что на /contacts, с
 * той же защитой; метку формы она запрашивает сама - страницы статические.
 * id="cta": по нему плавающая кнопка прячется, пока блок на экране.
 */
export function CTASection({
  locale = "ru",
  service,
}: {
  locale?: Locale;
  /** Услуга заявки - на страницах услуг. */
  service?: string;
}) {
  const c = locale === "en" ? finalCtaEn : finalCta;
  return (
    <Section id="cta" tone="ink">
      <Reveal stagger>
        <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr] lg:items-end lg:gap-16">
          <h2 data-reveal className="max-w-2xl text-h2 text-balance text-ink">
            {c.title}
          </h2>
          <p data-reveal className="max-w-md text-lead text-ink-2">
            {nbsp(c.lead)}
          </p>
        </div>
        <div data-reveal className="mt-10 border-t border-border pt-10">
          <ContactForm
            variant="inline"
            locale={locale}
            service={service}
            submitLabel={c.submit}
            note={nbsp(c.note)}
            aside={
              <p className="shrink-0 text-ink-2">
                {c.messenger.text}{" "}
                <a
                  href={contacts.telegramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium whitespace-nowrap text-ink underline decoration-border underline-offset-4 transition duration-300 ease-osmo hover:decoration-ink"
                >
                  {c.messenger.link}
                </a>
              </p>
            }
          />
        </div>
      </Reveal>
    </Section>
  );
}
