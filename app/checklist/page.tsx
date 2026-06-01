import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { ContentChecklist } from "@/components/sections/ContentChecklist";

export const metadata: Metadata = {
  title: "Контент-чеклист (внутренний)",
  robots: { index: false, follow: false },
};

export default function ChecklistPage() {
  return (
    <Container>
      <div className="py-14 sm:py-20">
        <p className="text-label uppercase text-muted">Внутренний инструмент</p>
        <h1 className="mt-3 text-h2 text-ink">
          Контент-чеклист по всем страницам
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-ink-2">
          Рабочий список для команды: каждая страница → каждая секция → статус →
          что доделать. Отмечайте готовое галочкой — отметки сохраняются в этом
          браузере. Страница закрыта от индексации.
        </p>
        <div className="mt-10">
          <ContentChecklist />
        </div>
      </div>
    </Container>
  );
}
