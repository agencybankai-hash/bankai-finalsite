// Миграция схемы Neon. Запуск: node --env-file=.env.local scripts/migrate.mjs
import { neon } from "@neondatabase/serverless";

const url = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;
if (!url) {
  console.error("Нет DATABASE_URL_UNPOOLED/DATABASE_URL в окружении");
  process.exit(1);
}
const sql = neon(url);

await sql`CREATE TABLE IF NOT EXISTS leads (
  id          bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email       text,
  name        text,
  source      text NOT NULL,
  payload     jsonb NOT NULL DEFAULT '{}'::jsonb,
  user_agent  text,
  created_at  timestamptz NOT NULL DEFAULT now()
)`;
await sql`CREATE INDEX IF NOT EXISTS leads_created_at_idx ON leads (created_at DESC)`;
await sql`CREATE INDEX IF NOT EXISTS leads_source_idx ON leads (source)`;

const [{ count }] = await sql`SELECT count(*)::int AS count FROM leads`;
console.log("OK: таблица leads готова, строк:", count);
