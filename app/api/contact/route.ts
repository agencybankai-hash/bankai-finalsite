import { NextResponse } from "next/server";
import { getSql } from "@/lib/db";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const clip = (v: unknown, n: number) => String(v ?? "").trim().slice(0, n);

/** Приём заявки из основной контакт-формы. Пишет в Neon (таблица leads). */
export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad_json" }, { status: 400 });
  }

  const b = (body ?? {}) as Record<string, unknown>;

  // honeypot
  if (String(b.company ?? "")) return NextResponse.json({ ok: true });

  const name = clip(b.name, 120);
  const contact = clip(b.contact, 200);
  if (!name || !contact) {
    return NextResponse.json({ ok: false, error: "required" }, { status: 422 });
  }

  const payload = {
    service: clip(b.service, 120),
    contact,
    niche: clip(b.niche, 200),
    revenue: clip(b.revenue, 120),
    comment: clip(b.comment, 4000),
  };
  const email = EMAIL_RE.test(contact) ? contact.toLowerCase() : null;

  try {
    const sql = getSql();
    const ua = (req.headers.get("user-agent") ?? "").slice(0, 300);
    await sql`
      INSERT INTO leads (email, name, source, payload, user_agent)
      VALUES (${email}, ${name}, ${"contact-form"}, ${JSON.stringify(payload)}::jsonb, ${ua})
    `;
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("contact insert failed:", e);
    return NextResponse.json({ ok: false, error: "server" }, { status: 500 });
  }
}
