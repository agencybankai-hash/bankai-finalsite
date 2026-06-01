import { NextResponse } from "next/server";
import { getSql } from "@/lib/db";
import { checklist, approvers } from "@/content/checklist";

/**
 * Общее хранилище апрувов контент-чеклиста (страница /checklist).
 * Одна строка на пункт, 3 булевых колонки апруверов. Состояние общее
 * для всех — зачёркивание (все 3) видят все при заходе/фокусе.
 */

const VALID_IDS = new Set<string>(
  checklist.flatMap((p) => p.items.map((i) => i.id)),
);
const VALID_APPROVERS = new Set<string>(approvers.map((a) => a.key));

type Sql = ReturnType<typeof getSql>;

async function ensureTable(sql: Sql) {
  await sql`
    CREATE TABLE IF NOT EXISTS checklist_approvals (
      item_id    text PRIMARY KEY,
      artur      boolean NOT NULL DEFAULT false,
      daniyar    boolean NOT NULL DEFAULT false,
      petr       boolean NOT NULL DEFAULT false,
      updated_at timestamptz NOT NULL DEFAULT now()
    )
  `;
}

export async function GET() {
  try {
    const sql = getSql();
    await ensureTable(sql);
    const rows = (await sql`
      SELECT item_id, artur, daniyar, petr FROM checklist_approvals
    `) as Array<{
      item_id: string;
      artur: boolean;
      daniyar: boolean;
      petr: boolean;
    }>;
    const approvals: Record<
      string,
      { artur: boolean; daniyar: boolean; petr: boolean }
    > = {};
    for (const r of rows) {
      approvals[r.item_id] = {
        artur: r.artur,
        daniyar: r.daniyar,
        petr: r.petr,
      };
    }
    return NextResponse.json({ ok: true, approvals });
  } catch (e) {
    console.error("checklist GET failed:", e);
    return NextResponse.json({ ok: false, error: "server" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad_json" }, { status: 400 });
  }
  const b = (body ?? {}) as Record<string, unknown>;
  const itemId = String(b.itemId ?? "");
  const approver = String(b.approver ?? "");
  const value = Boolean(b.value);

  if (!VALID_IDS.has(itemId) || !VALID_APPROVERS.has(approver)) {
    return NextResponse.json({ ok: false, error: "bad_input" }, { status: 422 });
  }

  try {
    const sql = getSql();
    await ensureTable(sql);
    // Колонка-апрувер статична (валидирована по белому списку выше).
    if (approver === "artur") {
      await sql`
        INSERT INTO checklist_approvals (item_id, artur) VALUES (${itemId}, ${value})
        ON CONFLICT (item_id) DO UPDATE SET artur = ${value}, updated_at = now()
      `;
    } else if (approver === "daniyar") {
      await sql`
        INSERT INTO checklist_approvals (item_id, daniyar) VALUES (${itemId}, ${value})
        ON CONFLICT (item_id) DO UPDATE SET daniyar = ${value}, updated_at = now()
      `;
    } else {
      await sql`
        INSERT INTO checklist_approvals (item_id, petr) VALUES (${itemId}, ${value})
        ON CONFLICT (item_id) DO UPDATE SET petr = ${value}, updated_at = now()
      `;
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("checklist POST failed:", e);
    return NextResponse.json({ ok: false, error: "server" }, { status: 500 });
  }
}
