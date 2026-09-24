import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { getSql } from "@/lib/db";
import { REJECT_LABELS, type RejectReason } from "@/lib/rejections";
import { deviceLabel } from "@/lib/user-agent";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Отклонённые отправки — админка",
  robots: { index: false, follow: false },
};

type Row = {
  id: string;
  reason: RejectReason;
  detail: string | null;
  ip: string | null;
  user_agent: string | null;
  referer: string | null;
  payload: Record<string, string> | null;
  created_at: string;
};

const dtf = new Intl.DateTimeFormat("ru-RU", {
  day: "2-digit",
  month: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Asia/Almaty",
});

function fmtDate(v: string) {
  const d = new Date(v);
  return isNaN(d.getTime()) ? v : dtf.format(d);
}

function who(p: Row["payload"]) {
  if (!p) return "—";
  return [p.name, p.phone, p.contact].filter(Boolean).join(" · ") || "—";
}

const btnLink =
  "inline-flex h-10 items-center justify-center rounded-lg border border-border bg-bg px-4 text-sm font-medium text-ink hover:bg-surface";

/**
 * Журнал отклонённых отправок формы за 30 дней: что отбили и почему.
 * Статистика по ботам плюс страховка от ложных срабатываний: контакт
 * живого человека виден здесь, ему можно написать вручную.
 */
export default async function RejectedPage() {
  let rows: Row[] = [];
  let byReason: { reason: RejectReason; n: number }[] = [];
  let error = "";
  try {
    const sql = getSql();
    rows = (await sql`
      SELECT id, reason, detail, ip, user_agent, referer, payload, created_at
      FROM rejected_submissions
      ORDER BY created_at DESC
      LIMIT 300
    `) as Row[];
    byReason = (await sql`
      SELECT reason, count(*)::int AS n FROM rejected_submissions GROUP BY reason ORDER BY n DESC
    `) as { reason: RejectReason; n: number }[];
  } catch (e) {
    console.error("rejected page query failed:", e);
    error = "Не удалось загрузить журнал. Проверьте подключение к БД.";
  }
  const total = byReason.reduce((s, r) => s + r.n, 0);

  return (
    <section className="py-12 sm:py-16">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
              Отклонённые отправки
            </h1>
            <p className="mt-1 text-sm text-ink-2">
              За 30 дней: {total}
              {byReason.length > 0 && (
                <>
                  {" · "}
                  {byReason.map((r) => `${REJECT_LABELS[r.reason] ?? r.reason} ${r.n}`).join(", ")}
                </>
              )}
            </p>
          </div>
          <Link href="/admin/leads" className={btnLink}>
            ← К лидам
          </Link>
        </div>

        {error ? (
          <p className="mt-8 rounded-lg border border-border bg-surface p-4 text-sm text-ink-2">
            {error}
          </p>
        ) : rows.length === 0 ? (
          <p className="mt-8 rounded-lg border border-dashed border-border bg-surface p-8 text-center text-sm text-ink-2">
            Отклонённых попыток пока не было.
          </p>
        ) : (
          <>
            {/* Мобильная версия: карточки */}
            <ul className="mt-8 space-y-3 md:hidden">
              {rows.map((r) => (
                <li key={r.id} className="rounded-xl border border-border bg-bg p-4 text-sm">
                  <div className="flex items-start justify-between gap-3">
                    <span className="font-medium text-ink">
                      {REJECT_LABELS[r.reason] ?? r.reason}
                      {r.detail && <span className="text-ink-2"> · {r.detail}</span>}
                    </span>
                    <span className="shrink-0 text-xs text-muted tabular-nums">{fmtDate(r.created_at)}</span>
                  </div>
                  <div className="mt-2 break-words text-ink-2">{who(r.payload)}</div>
                  <div className="mt-2 break-all text-xs text-muted">
                    {r.ip} · {deviceLabel(r.user_agent)}
                    {r.referer && <> · {r.referer}</>}
                  </div>
                </li>
              ))}
            </ul>

            {/* Десктоп: таблица */}
            <div className="mt-8 hidden overflow-x-auto rounded-xl border border-border md:block">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b border-border bg-surface text-left">
                    <th className="px-4 py-3 font-medium text-ink">Когда</th>
                    <th className="px-4 py-3 font-medium text-ink">Причина</th>
                    <th className="px-4 py-3 font-medium text-ink">Кто (из полей)</th>
                    <th className="px-4 py-3 font-medium text-ink">IP · устройство</th>
                    <th className="px-4 py-3 font-medium text-ink">Referer</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.id} className="border-b border-border align-top last:border-0">
                      <td className="whitespace-nowrap px-4 py-3 text-ink-2 tabular-nums">
                        {fmtDate(r.created_at)}
                      </td>
                      <td className="px-4 py-3 text-ink">
                        {REJECT_LABELS[r.reason] ?? r.reason}
                        {r.detail && <div className="text-xs text-muted">{r.detail}</div>}
                      </td>
                      <td className="max-w-[36ch] break-words px-4 py-3 text-ink-2">{who(r.payload)}</td>
                      <td className="px-4 py-3 text-muted">
                        <div>{r.ip}</div>
                        <div className="text-xs">{deviceLabel(r.user_agent)}</div>
                      </td>
                      <td className="max-w-[28ch] break-all px-4 py-3 text-xs text-muted">
                        {r.referer || "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </Container>
    </section>
  );
}
