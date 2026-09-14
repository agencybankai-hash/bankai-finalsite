// Копирует SVG-флаги из пакета country-flag-icons в public/flags перед dev и build.
// Файлы в git не хранятся (см. .gitignore), источник - node_modules.
import { cpSync, mkdirSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const src = join(root, "node_modules", "country-flag-icons", "3x2");
const dst = join(root, "public", "flags");
mkdirSync(dst, { recursive: true });
const files = readdirSync(src).filter((f) => f.endsWith(".svg"));
for (const f of files) cpSync(join(src, f), join(dst, f));
console.log(`flags: ${files.length} svg -> public/flags`);
