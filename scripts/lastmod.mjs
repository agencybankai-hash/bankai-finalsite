// Даты правок контента из git -> content/lastmod.json.
// Запускать локально после правок контента: npm run lastmod. На Vercel клон
// неполный, поэтому JSON хранится в репозитории, а не считается при сборке.
import { execSync } from "node:child_process";
import { readdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const git = (args) => execSync(`git ${args}`, { cwd: root, encoding: "utf8" }).trim();

const files = [
  ...readdirSync(join(root, "content")).filter((f) => f.endsWith(".ts")).map((f) => `content/${f}`),
  ...readdirSync(join(root, "content/en")).filter((f) => f.endsWith(".ts")).map((f) => `content/en/${f}`),
  ...readdirSync(join(root, "content/guides")).filter((f) => f.endsWith(".md")).map((f) => `content/guides/${f}`),
  "app/(ru)/page.tsx", "app/(ru)/about/page.tsx", "app/(ru)/contacts/page.tsx",
  "app/(ru)/privacy/page.tsx", "app/(ru)/terms/page.tsx",
  "app/(en)/en/page.tsx", "app/(en)/en/contacts/page.tsx",
  "app/(en)/en/privacy/page.tsx", "app/(en)/en/terms/page.tsx",
];

const out = {};
for (const f of files) {
  const modified = git(`log -1 --format=%cs -- "${f}"`);
  const created = git(`log --diff-filter=A --format=%cs -- "${f}"`).split("\n").filter(Boolean).pop();
  if (modified) out[f] = { modified, created: created || modified };
}
writeFileSync(join(root, "content/lastmod.json"), JSON.stringify(out, null, 2) + "\n");
console.log(`lastmod: ${Object.keys(out).length} files -> content/lastmod.json`);
