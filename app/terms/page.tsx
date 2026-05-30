import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { contacts, siteMeta } from "@/content/site";

export const metadata: Metadata = {
  title: "Условия использования",
  description: "Условия использования сайта и обращения за услугами.",
};

export default function TermsPage() {
  return (
    <Container>
      <article className="max-w-3xl py-16 sm:py-20">
        <h1 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          Условия использования
        </h1>
        <p className="mt-3 text-sm text-muted">Редакция от 29 мая 2026 года</p>
        <div className="mt-4 rounded-lg border border-border bg-surface p-4 text-sm text-ink-2">
          Черновик-шаблон. Перед публикацией требует вычитки юристом.
        </div>

        <div className="prose-legal mt-8">
          <h2>1. Общие положения</h2>
          <p>
            Используя сайт {siteMeta.url}, вы соглашаетесь с настоящими условиями.
            Сайт принадлежит {siteMeta.fullName}, {contacts.city}.
          </p>

          <h2>2. Услуги</h2>
          <p>
            Сайт носит информационный характер. Описание услуг, цены и сроки не
            являются публичной офертой; итоговые условия фиксируются в договоре.
          </p>

          <h2>3. Заявки и коммуникация</h2>
          <p>
            Оставляя заявку, вы подтверждаете согласие на обработку персональных
            данных согласно политике конфиденциальности и на связь с вами по
            указанным контактам.
          </p>

          <h2>4. Интеллектуальная собственность</h2>
          <p>
            Материалы сайта - тексты, изображения, элементы дизайна - принадлежат{" "}
            {siteMeta.fullName}. Использование без письменного разрешения не
            допускается.
          </p>

          <h2>5. Ограничение ответственности</h2>
          <p>
            Информация на сайте предоставляется «как есть». Мы не несём
            ответственности за решения, принятые на основе материалов сайта без
            предварительной консультации.
          </p>

          <h2>6. Изменения</h2>
          <p>
            Мы можем обновлять условия. Актуальная редакция публикуется на этой
            странице.
          </p>

          <h2>7. Контакты</h2>
          <p>
            Вопросы по условиям: {contacts.email}, Telegram {contacts.telegram}.
          </p>
        </div>
      </article>
    </Container>
  );
}
