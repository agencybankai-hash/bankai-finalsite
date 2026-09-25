import { getCase } from "@/content/cases";
import type { ProofBlock } from "@/content/types";
import { CaseList } from "./CaseList";

/**
 * Доказательство на странице услуги: 1-2 кейса, пересказанные под интент
 * страницы. Текст - свой у страницы, цифры и каналы - из самого кейса
 * (content/cases.ts), анатомия - общая с «Где это сработало».
 */
export function ProofCards({
  items,
  className,
}: {
  items: ProofBlock["items"];
  className?: string;
}) {
  const rows = items.map((it) => {
    const c = getCase(it.slug);
    if (!c) throw new Error(`ProofCards: кейс «${it.slug}» не найден в content/cases.ts`);
    return { case: c, title: it.case, text: it.text };
  });

  return <CaseList items={rows} className={className} />;
}
