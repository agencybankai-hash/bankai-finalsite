import { readFile } from "node:fs/promises";
import path from "node:path";

/*
 * Тексты лонгридов над футером. Путь статически ограничен подпапкой content
 * (динамично - только имя файла), иначе Turbopack трассирует весь проект
 * в бандл - как у гайдов. Городские лонгриды лежат отдельно, в
 * content/city-longreads, остальные страницы - в content/longreads.
 */
export async function readLongread(file?: string): Promise<string | undefined> {
  if (!file) return undefined;
  return readFile(path.join(process.cwd(), "content/longreads", file), "utf8");
}

export async function readCityLongread(file?: string): Promise<string | undefined> {
  if (!file) return undefined;
  return readFile(path.join(process.cwd(), "content/city-longreads", file), "utf8");
}
