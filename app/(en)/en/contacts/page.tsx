import { Section } from "@/components/ui/Section";
import { Hero } from "@/components/sections/Hero";
import { ContactForm } from "@/components/sections/ContactForm";
import { contacts } from "@/content/site";
import { ui } from "@/content/ui";
import { pageMetadata } from "@/lib/metadata";

const t = ui("en");

export const generateMetadata = pageMetadata({
  title: "Contacts",
  description:
    "Tell us about your business and the goal - we run a free audit and come back with a plan.",
  path: "/en/contacts",
  locale: "en",
});

export default function EnContactsPage() {
  return (
    <>
      {/* visual={false}: HeroVisual - иллюстрация с русскими подписями и без
          локали, на EN её показывать нельзя. Вернуть, когда у неё появится locale. */}
      <Hero
        title="Let's talk about your lead flow"
        subtitle="Tell us about your business and the goal. We run a free audit and come back with a plan for your market and budget - no strings attached."
        badge="SEO · PPC · Web"
        visual={false}
      />

      <Section>
        <div className="grid gap-12 lg:grid-cols-[1.6fr_1fr]">
          <div>
            <ContactForm locale="en" />
          </div>

          <aside className="space-y-8">
            <div>
              <div className="text-sm font-medium text-ink">Direct contacts</div>
              <ul className="mt-4 space-y-3 text-sm text-ink-2">
                <li>{t.footer.city}</li>
                <li>
                  <a href={`mailto:${contacts.email}`} className="hover:text-ink">
                    {contacts.email}
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
              <div className="text-sm font-medium text-ink">Time zone</div>
              <p className="mt-2 text-sm leading-relaxed text-ink-2">
                Almaty (GMT+5) - overlap with EU and US mornings. We reply within
                one business day, usually sooner. If it is urgent, message us on
                Telegram.
              </p>
            </div>

            <div className="rounded-xl border border-border bg-surface p-6">
              <div className="text-sm font-medium text-ink">
                What happens next
              </div>
              <ol className="mt-3 space-y-2 text-sm text-ink-2">
                <li>1. We read your request and look at your market</li>
                <li>2. We run a free audit</li>
                <li>3. We send a plan and a quote</li>
              </ol>
            </div>
          </aside>
        </div>
      </Section>
    </>
  );
}
