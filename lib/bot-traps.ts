import { getSql } from "@/lib/db";

/**
 * Ловушка для ботов: невидимая людям ссылка на /trap (футер, закрыта
 * в robots.txt). Кто по ней сходил - бот: его IP на TRAP_TTL не может
 * отправить форму. Таблица bot_traps создаётся scripts/migrate.mjs.
 * Все ошибки БД глотаем: ловушка не должна ломать ни страницу, ни форму.
 */
const TRAP_TTL = "12 hours";

export function clientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  return (fwd ?? req.headers.get("x-real-ip") ?? "local").split(",")[0].trim();
}

/** source: "trap-link" (невидимая ссылка) или "referer:<домен>" (бот-редиректор, см. proxy.ts). */
export async function recordTrap(ip: string, userAgent: string, source = "trap-link"): Promise<void> {
  try {
    const sql = getSql();
    await sql`INSERT INTO bot_traps (ip, user_agent, source) VALUES (${ip}, ${userAgent.slice(0, 300)}, ${source})`;
  } catch (e) {
    console.error("bot trap insert failed:", e);
  }
}

export async function isTrapped(ip: string): Promise<boolean> {
  if (!ip || ip === "local") return false;
  try {
    const sql = getSql();
    const rows = await sql`
      SELECT 1 FROM bot_traps
      WHERE ip = ${ip} AND seen_at > now() - ${TRAP_TTL}::interval
      LIMIT 1
    `;
    return rows.length > 0;
  } catch (e) {
    console.error("bot trap lookup failed:", e);
    return false;
  }
}
