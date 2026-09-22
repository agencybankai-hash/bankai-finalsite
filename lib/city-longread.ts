import { readFile } from "node:fs/promises";
import path from "node:path";

/**
 * Текст лонгрида городской страницы. Путь статически ограничен подпапкой
 * content/city-longreads (динамично - только имя файла), иначе Turbopack
 * трассирует весь проект в бандл - как у гайдов.
 */
export async function readLongread(file?: string): Promise<string | undefined> {
  if (!file) return undefined;
  return readFile(path.join(process.cwd(), "content/city-longreads", file), "utf8");
}
