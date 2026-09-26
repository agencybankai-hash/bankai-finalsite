import { Section } from "@/components/ui/Section";
import { Hero } from "@/components/sections/Hero";
import { ContactForm } from "@/components/sections/ContactForm";
import { ContactsHero } from "@/components/illustrations/pages/ContactsHero";
import { contacts } from "@/content/site";
import { pageMetadata } from "@/lib/metadata";
import { visitorCountry } from "@/lib/geo";
import { issueFormToken } from "@/lib/form-token";

export const generateMetadata = pageMetadata({
  title: "Контакты",
  description:
    "Расскажите о бизнесе и задаче - проведём бесплатный аудит и предложим план.",
  path: "/contacts",
});

export default async function ContactsPage() {
  const country = await visitorCountry();
  const formToken = issueFormToken();
  return (
    <>
      <Hero
        title="Обсудим ваш поток заявок"
        subtitle="Расскажите о бизнесе и задаче. Проведём бесплатный аудит и предложим план под вашу нишу и бюджет - без обязательств."
        visual={<ContactsHero />}
      />

      <Section>
        <div className="grid gap-12 lg:grid-cols-[1.6fr_1fr]">
          <div>
            <ContactForm defaultCountry={country} formToken={formToken} />
          </div>

          <aside className="space-y-8">
            <div>
              <div className="text-sm font-medium text-ink">Прямые контакты</div>
              <ul className="mt-4 space-y-3 text-sm text-ink-2">
                <li>{contacts.city}</li>
                <li>
                  <a href={`mailto:${contacts.email}`} className="hover:text-ink">
                    {contacts.email}
                  </a>
                </li>
                <li>
                  <a
                    href={contacts.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-ink"
                  >
                    WhatsApp {contacts.whatsapp}
                  </a>
                </li>
                <li>
                  <a
                    href={contacts.telegramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-ink"
                  >
                    Telegram {contacts.telegram}
                  </a>
                </li>
              </ul>
            </div>

            <div className="rounded-xl border border-border bg-surface p-6">
              <div className="text-sm font-medium text-ink">Время ответа</div>
              <p className="mt-2 text-sm leading-relaxed text-ink-2">
                Отвечаем в течение рабочего дня, обычно быстрее. Если срочно -
                пишите в WhatsApp или Telegram.
              </p>
            </div>

            <div className="rounded-xl border border-border bg-surface p-6">
              <div className="text-sm font-medium text-ink">Что будет дальше</div>
              <ol className="mt-3 space-y-2 text-sm text-ink-2">
                <li>1. Изучим заявку и нишу</li>
                <li>2. Проведём бесплатный аудит</li>
                <li>3. Предложим план и смету</li>
              </ol>
            </div>
          </aside>
        </div>
      </Section>
    </>
  );
}
