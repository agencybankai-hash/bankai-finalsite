import { NextResponse } from "next/server";
import { getSql } from "@/lib/db";

export const dynamic = "force-dynamic";

/** Удаление лида. Доступ закрыт Basic-Auth в proxy.ts (/api/admin/*). */
export async function DELETE(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const { id } = await ctx.params;
  if (!/^\d{1,18}$/.test(id)) {
    return NextResponse.json({ ok: false, error: "bad_id" }, { status: 400 });
  }

  try {
    const sql = getSql();
    const rows = await sql`DELETE FROM leads WHERE id = ${id}::bigint RETURNING id`;
    if (rows.length === 0) {
      return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("lead delete failed:", e);
    return NextResponse.json({ ok: false, error: "server" }, { status: 500 });
  }
}
