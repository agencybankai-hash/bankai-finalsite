import { Container } from "@/components/ui/Container";
import { getSql } from "@/lib/db";

export const dynamic = "force-dynamic";

export const metadata = { title: "Лиды — админка", robots: { index: false, follow: false } };

type Lead = {
  id: string;
  email: string | null;
  name: string | null;
  source: string;
  payload: { guide?: string } | null;
  user_agent: string | null;
  created_at: string;
};

const dtf = new Intl.DateTimeFormat("ru-RU", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Asia/Almaty",
});

function fmtDate(v: string) {
  const d = new Date(v);
  return isNaN(d.getTime()) ? v : dtf.format(d);
}

export default async function LeadsPage() {
  let rows: Lead[] = [];
  let error = "";
  try {
    const sql = getSql();
    rows = (await sql`
      SELECT id, email, name, source, payload, user_agent, created_at
      FROM leads
      ORDER BY created_at DESC
      LIMIT 500
    `) as Lead[];
  } catch (e) {
    console.error("leads page query failed:", e);
    error = "Не удалось загрузить лиды. Проверьте подключение к БД.";
  }

  return (
    <section className="py-12 sm:py-16">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
              Лиды
            </h1>
            <p className="mt-1 text-sm text-ink-2">
              Всего: {rows.length}
              {rows.length === 500 && " (показаны последние 500)"}
            </p>
          </div>
          {rows.length > 0 && (
            <a
              href="/api/admin/export"
              className="inline-flex h-10 items-center justify-center rounded-lg border border-border bg-bg px-4 text-sm font-medium text-ink hover:bg-surface"
            >
              Скачать CSV
            </a>
          )}
        </div>

        {error ? (
          <p className="mt-8 rounded-lg border border-border bg-surface p-4 text-sm text-ink-2">
            {error}
          </p>
        ) : rows.length === 0 ? (
          <p className="mt-8 rounded-lg border border-dashed border-border bg-surface p-8 text-center text-sm text-ink-2">
            Пока ни одного лида.
          </p>
        ) : (
          <div className="mt-8 overflow-x-auto rounded-xl border border-border">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border bg-surface text-left">
                  <th className="px-4 py-3 font-medium text-ink">Дата</th>
                  <th className="px-4 py-3 font-medium text-ink">Email</th>
                  <th className="px-4 py-3 font-medium text-ink">Источник</th>
                  <th className="px-4 py-3 font-medium text-ink">Устройство</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id} className="border-b border-border last:border-0">
                    <td className="whitespace-nowrap px-4 py-3 text-ink-2 tabular-nums">
                      {fmtDate(r.created_at)}
                    </td>
                    <td className="px-4 py-3 text-ink">{r.email ?? "—"}</td>
                    <td className="px-4 py-3 text-ink-2">{r.source}</td>
                    <td
                      className="max-w-[28ch] truncate px-4 py-3 text-muted"
                      title={r.user_agent ?? ""}
                    >
                      {r.user_agent ?? "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Container>
    </section>
  );
}
