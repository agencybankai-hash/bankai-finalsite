import lastmod from "@/content/lastmod.json";

type Entry = { modified: string; created: string };
const map = lastmod as Record<string, Entry>;

/** Дата последней правки среди файлов-источников страницы (YYYY-MM-DD) или undefined. */
export function modifiedAt(...files: string[]): string | undefined {
  const dates = files.map((f) => map[f]?.modified).filter(Boolean) as string[];
  return dates.length ? dates.sort().at(-1) : undefined;
}

/** Дата появления файла в репозитории: для datePublished статей. */
export function createdAt(file: string): string | undefined {
  return map[file]?.created;
}
