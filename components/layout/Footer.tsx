import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { contacts, siteMeta } from "@/content/site";
import { ui } from "@/content/ui";
import type { Locale } from "@/content/types";

export function Footer({ locale = "ru" }: { locale?: Locale }) {
  const { footer } = ui(locale);

  return (
    <footer className="border-t border-border bg-surface">
      <Container>
        <div className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
          {/* Бренд */}
          <div className="lg:col-span-1">
            <div className="text-2xl font-semibold tracking-tight text-ink">
              {siteMeta.name}
            </div>
            <p className="mt-2 max-w-xs text-sm font-medium text-ink">
              {footer.slogan}
            </p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-ink-2">
              {footer.description}
            </p>
          </div>

          {/* Разделы (услуги, компания) */}
          {footer.columns.map((col) => (
            <div key={col.title}>
              <div className="text-sm font-medium text-ink">{col.title}</div>
              <ul className="mt-4 space-y-2">
                {col.links.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="text-sm text-ink-2 hover:text-ink">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Контакты */}
          <div>
            <div className="text-sm font-medium text-ink">
              {footer.contactsTitle}
            </div>
            <ul className="mt-4 space-y-2 text-sm text-ink-2">
              <li>{footer.city}</li>
              <li>
                <a href={`mailto:${contacts.email}`} className="hover:text-ink">
                  {contacts.email}
                </a>
              </li>
              <li>
                <a
                  href={contacts.telegramUrl}
                  className="hover:text-ink"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Telegram {contacts.telegram}
                </a>
              </li>
              {contacts.youtubeUrl !== "#" && (
                <li>
                  <a
                    href={contacts.youtubeUrl}
                    className="hover:text-ink"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    YouTube
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-border py-6 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
          <div>© 2026 {siteMeta.fullName}</div>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {footer.legal.map((l) => (
              <Link key={l.href} href={l.href} className="hover:text-ink-2">
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </footer>
  );
}
