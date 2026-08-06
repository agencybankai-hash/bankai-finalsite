import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <Section>
      <div className="max-w-2xl">
        <p className="text-label uppercase text-muted">404</p>
        <h1 className="mt-3 text-h1 text-ink">Такой страницы нет</h1>
        <p className="mt-4 text-lead text-ink-2">
          Ссылка устарела или в адресе опечатка. Вот куда стоит заглянуть вместо
          неё.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button href="/" size="lg">
            На главную
          </Button>
          <Button href="/cases" variant="secondary" size="lg">
            Кейсы
          </Button>
          <Button href="/contacts" variant="secondary" size="lg">
            Контакты
          </Button>
        </div>
      </div>
    </Section>
  );
}
