import { getSql } from "@/lib/db";

export const dynamic = "force-dynamic";

type Row = {
  id: string;
  email: string | null;
  name: string | null;
  source: string;
  payload: {
    guide?: string;
    contact?: string;
    service?: string;
    niche?: string;
    revenue?: string;
    comment?: string;
  } | null;
  user_agent: string | null;
  created_at: string;
};

// Апостроф перед = + - @ — чтобы Excel/Sheets не выполнили значение как формулу.
const esc = (v: unknown) => {
  const s = String(v ?? "");
  const safe = /^[=+\-@]/.test(s) ? `'${s}` : s;
  return `"${safe.replace(/"/g, '""')}"`;
};

function iso(v: string) {
  const d = new Date(v);
  return isNaN(d.getTime()) ? v : d.toISOString();
}

/** CSV-экспорт всех лидов. Доступ закрыт Basic-Auth в middleware (/api/admin/*). */
export async function GET() {
  const sql = getSql();
  const rows = (await sql`
    SELECT id, email, name, source, payload, user_agent, created_at
    FROM leads
    ORDER BY created_at DESC
  `) as Row[];

  const header = [
    "id",
    "created_at",
    "email",
    "contact",
    "name",
    "source",
    "service",
    "niche",
    "comment",
    "guide",
    "user_agent",
  ];
  const body = rows.map((r) =>
    [
      r.id,
      iso(r.created_at),
      r.email,
      r.payload?.contact ?? "",
      r.name,
      r.source,
      r.payload?.service ?? "",
      r.payload?.niche ?? "",
      r.payload?.comment ?? "",
      r.payload?.guide ?? "",
      r.user_agent,
    ]
      .map(esc)
      .join(","),
  );
  // BOM, чтобы Excel корректно открыл кириллицу
  const csv = "﻿" + [header.join(","), ...body].join("\r\n");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="bankai-leads.csv"',
    },
  });
}
