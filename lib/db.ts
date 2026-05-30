import { neon } from "@neondatabase/serverless";

/**
 * Neon HTTP-клиент (pooled endpoint из DATABASE_URL).
 * Ленивая инициализация: не падает на этапе сборки, бросает только при вызове,
 * если переменная не задана.
 */
export function getSql() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");
  return neon(url);
}
