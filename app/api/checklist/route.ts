import { NextResponse } from "next/server";
import { getSql } from "@/lib/db";
import { checklist, approvers } from "@/content/checklist";

/**
 * Общее хранилище апрувов + заметок контент-чеклиста (/checklist).
 * Одна строка на пункт: 3 булевых апрувера + текстовая заметка.
 * Состояние общее — апрувы/зачёркивание/заметки видят все.
 */

const VALID_IDS = Array.from(
  new Set<string>(checklist.flatMap((p) => p.items.map((i) => i.id))),
);
const VALID_ID_SET = new Set(VALID_IDS);
const VALID_APPROVERS = new Set<string>(approvers.map((a) => a.key));

type Sql = ReturnType<typeof getSql>;

async function ensureTable(sql: Sql) {
  await sql`
    CREATE TABLE IF NOT EXISTS checklist_approvals (
      item_id    text PRIMARY KEY,
      artur      boolean NOT NULL DEFAULT false,
      daniyar    boolean NOT NULL DEFAULT false,
      petr       boolean NOT NULL DEFAULT false,
      note       text,
      updated_at timestamptz NOT NULL DEFAULT now()
    )
  `;
  await sql`ALTER TABLE checklist_approvals ADD COLUMN IF NOT EXISTS note text`;
}

/* Лёгкий best-effort рейт-лимит в памяти инстанса (на serverless не строгий). */
const hits = new Map<string, number[]>();
function rateLimited(ip: string, max = 40, windowMs = 10_000) {
  const now = Date.now();
  const arr = (hits.get(ip) ?? []).filter((t) => now - t < windowMs);
  arr.push(now);
  hits.set(ip, arr);
  return arr.length > max;
}

export async function GET() {
  try {
    const sql = getSql();
    await ensureTable(sql);
    // Чистим осиротевшие строки (id, которых больше нет в чеклисте).
    await sql`DELETE FROM checklist_approvals WHERE NOT (item_id = ANY(${VALID_IDS}::text[]))`;
    const rows = (await sql`
      SELECT item_id, artur, daniyar, petr, note FROM checklist_approvals
    `) as Array<{
      item_id: string;
      artur: boolean;
      daniyar: boolean;
      petr: boolean;
      note: string | null;
    }>;
    const approvals: Record<string, unknown> = {};
    for (const r of rows) {
      if (!VALID_ID_SET.has(r.item_id)) continue;
      approvals[r.item_id] = {
        artur: r.artur,
        daniyar: r.daniyar,
        petr: r.petr,
        note: r.note ?? "",
      };
    }
    return NextResponse.json({ ok: true, approvals });
  } catch (e) {
    console.error("checklist GET failed:", e);
    return NextResponse.json({ ok: false, error: "server" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const ip = (req.headers.get("x-forwarded-for") ?? "local").split(",")[0].trim();
  if (rateLimited(ip)) {
    return NextResponse.json({ ok: false, error: "rate" }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad_json" }, { status: 400 });
  }
  const b = (body ?? {}) as Record<string, unknown>;
  const itemId = String(b.itemId ?? "");
  if (!VALID_ID_SET.has(itemId)) {
    return NextResponse.json({ ok: false, error: "bad_id" }, { status: 422 });
  }

  try {
    const sql = getSql();
    await ensureTable(sql);

    // Заметка (комментарий к пункту)
    if (typeof b.note === "string") {
      const note = b.note.slice(0, 500);
      await sql`
        INSERT INTO checklist_approvals (item_id, note) VALUES (${itemId}, ${note})
        ON CONFLICT (item_id) DO UPDATE SET note = ${note}, updated_at = now()
      `;
      return NextResponse.json({ ok: true });
    }

    // Апрув
    const approver = String(b.approver ?? "");
    if (!VALID_APPROVERS.has(approver)) {
      return NextResponse.json({ ok: false, error: "bad_input" }, { status: 422 });
    }
    const value = Boolean(b.value);
    if (approver === "artur") {
      await sql`INSERT INTO checklist_approvals (item_id, artur) VALUES (${itemId}, ${value})
        ON CONFLICT (item_id) DO UPDATE SET artur = ${value}, updated_at = now()`;
    } else if (approver === "daniyar") {
      await sql`INSERT INTO checklist_approvals (item_id, daniyar) VALUES (${itemId}, ${value})
        ON CONFLICT (item_id) DO UPDATE SET daniyar = ${value}, updated_at = now()`;
    } else {
      await sql`INSERT INTO checklist_approvals (item_id, petr) VALUES (${itemId}, ${value})
        ON CONFLICT (item_id) DO UPDATE SET petr = ${value}, updated_at = now()`;
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("checklist POST failed:", e);
    return NextResponse.json({ ok: false, error: "server" }, { status: 500 });
  }
}
