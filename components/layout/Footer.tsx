import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { nav, legalLinks, contacts, siteMeta, slogan } from "@/content/site";

const servicesNav = nav.find((n) => n.label === "Услуги")?.children ?? [];

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <Container>
        <div className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
          {/* Бренд */}
          <div className="lg:col-span-1">
            <div className="text-2xl font-semibold tracking-tight text-ink">
              {siteMeta.name}
            </div>
            <p className="mt-2 max-w-xs text-sm font-medium text-ink">{slogan}</p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-ink-2">
              {siteMeta.description}
            </p>
          </div>

          {/* Услуги */}
          <div>
            <div className="text-sm font-medium text-ink">Услуги</div>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/" className="text-sm text-ink-2 hover:text-ink">
                  Лидогенерация под ключ
                </Link>
              </li>
              {servicesNav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm text-ink-2 hover:text-ink">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Навигация */}
          <div>
            <div className="text-sm font-medium text-ink">Компания</div>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/cases" className="text-sm text-ink-2 hover:text-ink">
                  Кейсы
                </Link>
              </li>
              <li>
                <Link href="/guides" className="text-sm text-ink-2 hover:text-ink">
                  Гайды
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-ink-2 hover:text-ink">
                  О нас
                </Link>
              </li>
              <li>
                <Link href="/contacts" className="text-sm text-ink-2 hover:text-ink">
                  Контакты
                </Link>
              </li>
            </ul>
          </div>

          {/* Контакты */}
          <div>
            <div className="text-sm font-medium text-ink">Контакты</div>
            <ul className="mt-4 space-y-2 text-sm text-ink-2">
              <li>{contacts.city}</li>
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
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-border py-6 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
          <div>© 2026 {siteMeta.fullName}</div>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {legalLinks.map((l) => (
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
