import type { CaseStudy, Locale } from "@/content/types";
import { CaseList } from "./CaseList";

/**
 * Кейсы без превью-картинки (реальных нет): строки результатов, где
 * «картинка» - цифры кейса, плюс строка «ниша · гео». Анатомия - в CaseList.
 */
export function CaseGrid({
  items,
  locale = "ru",
}: {
  items: CaseStudy[];
  locale?: Locale;
}) {
  return <CaseList items={items.map((c) => ({ case: c }))} locale={locale} meta />;
}
