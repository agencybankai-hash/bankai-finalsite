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

// Апрувы контент-чеклиста (страница /checklist). API создаёт таблицу сам,
// здесь — для полноты схемы.
await sql`CREATE TABLE IF NOT EXISTS checklist_approvals (
  item_id    text PRIMARY KEY,
  artur      boolean NOT NULL DEFAULT false,
  daniyar    boolean NOT NULL DEFAULT false,
  petr       boolean NOT NULL DEFAULT false,
  note       text,
  updated_at timestamptz NOT NULL DEFAULT now()
)`;
await sql`ALTER TABLE checklist_approvals ADD COLUMN IF NOT EXISTS note text`;

await sql`CREATE TABLE IF NOT EXISTS bot_traps (
  id          bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  ip          text NOT NULL,
  user_agent  text,
  seen_at     timestamptz NOT NULL DEFAULT now()
)`;
await sql`CREATE INDEX IF NOT EXISTS bot_traps_ip_seen_idx ON bot_traps (ip, seen_at DESC)`;
await sql`ALTER TABLE bot_traps ADD COLUMN IF NOT EXISTS source text NOT NULL DEFAULT 'trap-link'`;

await sql`CREATE TABLE IF NOT EXISTS rejected_submissions (
  id          bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  reason      text NOT NULL,
  detail      text,
  ip          text,
  user_agent  text,
  referer     text,
  payload     jsonb,
  created_at  timestamptz NOT NULL DEFAULT now()
)`;
await sql`CREATE INDEX IF NOT EXISTS rejected_submissions_created_idx ON rejected_submissions (created_at DESC)`;

// Источники заходов по дням (lib/referrers.ts) и отметки об уже отправленных
// оповещениях cron /api/cron/referrers.
await sql`CREATE TABLE IF NOT EXISTS referrer_daily (
  day   date    NOT NULL,
  host  text    NOT NULL,
  hits  integer NOT NULL DEFAULT 0,
  PRIMARY KEY (day, host)
)`;
await sql`CREATE TABLE IF NOT EXISTS referrer_alerts (
  key         text PRIMARY KEY,
  alerted_at  timestamptz NOT NULL DEFAULT now()
)`;

const [{ count }] = await sql`SELECT count(*)::int AS count FROM leads`;
console.log("OK: таблица leads готова, строк:", count);
