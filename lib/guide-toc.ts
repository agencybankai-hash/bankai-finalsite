/** Стабильный id раздела: для нумерованных - s-<номер>, иначе slug. */
export function sectionId(text: string): string {
  const t = text.trim();
  const m = t.match(/^(\d+)\./);
  if (m) return `s-${m[1]}`;
  return (
    "s-" +
    t
      .toLowerCase()
      .replace(/[^\p{L}\p{N}]+/gu, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 40)
  );
}

export type GuideSection = { id: string; label: string };

/** Достаёт H2-разделы из markdown-тела гайда (для оглавления). */
export function extractSections(markdown: string): GuideSection[] {
  const out: GuideSection[] = [];
  for (const line of markdown.split("\n")) {
    const m = line.match(/^##\s+(.+?)\s*$/); // только H2 (### не матчится)
    if (m) {
      const label = m[1].trim();
      out.push({ id: sectionId(label), label });
    }
  }
  return out;
}
