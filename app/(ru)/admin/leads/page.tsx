import { DeleteLeadButton } from "@/components/admin/DeleteLeadButton";
import { Container } from "@/components/ui/Container";
import { getSql } from "@/lib/db";
import { deviceLabel } from "@/lib/user-agent";

export const dynamic = "force-dynamic";

export const metadata = { title: "Лиды — админка", robots: { index: false, follow: false } };

type Lead = {
  id: string;
  email: string | null;
  name: string | null;
  source: string;
  payload: {
    guide?: string;
    phone?: string;
    contact?: string;
    service?: string;
    niche?: string;
    revenue?: string;
    comment?: string;
    page?: string;
    locale?: string;
  } | null;
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

/** Пары «подпись: значение» для деталей заявки, только заполненные. */
function detailRows(r: Lead): Array<[string, string]> {
  const p = r.payload;
  const rows: Array<[string, string | undefined]> = [
    ["Услуга", p?.service],
    ["Ниша", p?.niche],
    ["Оборот", p?.revenue],
    ["Гайд", p?.guide],
    ["Комментарий", p?.comment],
  ];
  return rows.flatMap(([k, v]) => (v ? [[k, v] as [string, string]] : []));
}

function detailsShort(r: Lead) {
  return detailRows(r)
    .map(([, v]) => v)
    .join(" · ");
}

/** Подпись лида для подтверждения удаления. */
function leadLabel(r: Lead) {
  return (
    [r.name, r.payload?.phone, r.payload?.contact || r.email].filter(Boolean).join(", ") ||
    `#${r.id}`
  );
}

const btnLink =
  "inline-flex h-10 items-center justify-center rounded-lg border border-border bg-bg px-4 text-sm font-medium text-ink hover:bg-surface";

/** Раскрывающийся текст: коротко в строке, полностью по тапу или клику. */
function Expandable({ short, full }: { short: string; full: React.ReactNode }) {
  return (
    <details className="group">
      <summary className="cursor-pointer list-none text-ink-2 marker:hidden [&::-webkit-details-marker]:hidden">
        <span className="block max-w-[40ch] truncate group-open:hidden">{short}</span>
        <span className="hidden text-xs text-muted group-open:block">Свернуть</span>
      </summary>
      <div className="mt-1 whitespace-pre-wrap text-ink">{full}</div>
    </details>
  );
}

function DetailsFull({ r }: { r: Lead }) {
  const rows = detailRows(r);
  if (rows.length === 0) return <>—</>;
  return (
    <dl className="space-y-1">
      {rows.map(([k, v]) => (
        <div key={k}>
          <dt className="text-xs text-muted">{k}</dt>
          <dd className="whitespace-pre-wrap">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

function ContactCell({ r }: { r: Lead }) {
  const contact = r.payload?.contact || r.email;
  return (
    <>
      {r.name && <div className="font-medium text-ink">{r.name}</div>}
      {r.payload?.phone && (
        <div>
          <a href={`tel:${r.payload.phone}`} className="text-ink hover:text-accent">
            {r.payload.phone}
          </a>
        </div>
      )}
      {contact && <div className="text-ink-2">{contact}</div>}
      {!r.name && !r.payload?.phone && !contact && "—"}
    </>
  );
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
            <a href="/api/admin/export" className={btnLink}>
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
          <>
            {/* Мобильная версия: карточка на заявку, всё видно без горизонтального скролла. */}
            <ul className="mt-8 space-y-4 md:hidden">
              {rows.map((r) => (
                <li key={r.id} className="rounded-xl border border-border bg-bg p-4 text-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <ContactCell r={r} />
                    </div>
                    <div className="shrink-0 text-right text-xs text-muted tabular-nums">
                      {fmtDate(r.created_at)}
                    </div>
                  </div>
                  <div className="mt-3 text-xs text-muted">
                    {r.source}
                    {r.payload?.page && (
                      <span className="break-all">
                        {" · "}
                        {r.payload.page}
                      </span>
                    )}
                    {" · "}
                    {deviceLabel(r.user_agent)}
                  </div>
                  <div className="mt-3 border-t border-border pt-3">
                    <DetailsFull r={r} />
                  </div>
                  <div className="mt-3 flex justify-end">
                    <DeleteLeadButton id={r.id} label={leadLabel(r)} />
                  </div>
                </li>
              ))}
            </ul>

            {/* Десктоп: таблица. Длинные поля раскрываются кликом, не наведением. */}
            <div className="mt-8 hidden overflow-x-auto rounded-xl border border-border md:block">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b border-border bg-surface text-left">
                    <th className="px-4 py-3 font-medium text-ink">Дата</th>
                    <th className="px-4 py-3 font-medium text-ink">Контакт</th>
                    <th className="px-4 py-3 font-medium text-ink">Источник</th>
                    <th className="px-4 py-3 font-medium text-ink">Детали</th>
                    <th className="px-4 py-3 font-medium text-ink">Устройство</th>
                    {/* relative: иначе sr-only-подпись позиционируется относительно
                        страницы и растягивает документ по ширине на мобильных. */}
                    <th className="relative px-4 py-3 font-medium text-ink">
                      <span className="sr-only">Действия</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.id} className="border-b border-border align-top last:border-0">
                      <td className="whitespace-nowrap px-4 py-3 text-ink-2 tabular-nums">
                        {fmtDate(r.created_at)}
                      </td>
                      <td className="px-4 py-3">
                        <ContactCell r={r} />
                      </td>
                      <td className="px-4 py-3 text-ink-2">
                        {r.source}
                        {r.payload?.page && (
                          <div className="max-w-[28ch] break-all text-xs text-muted">
                            {r.payload.page}
                          </div>
                        )}
                      </td>
                      <td className="max-w-[44ch] px-4 py-3">
                        {detailRows(r).length > 0 ? (
                          <Expandable short={detailsShort(r)} full={<DetailsFull r={r} />} />
                        ) : (
                          <span className="text-ink-2">—</span>
                        )}
                      </td>
                      <td className="max-w-[24ch] px-4 py-3 text-muted">
                        {r.user_agent ? (
                          <Expandable
                            short={deviceLabel(r.user_agent)}
                            full={<span className="break-all text-xs">{r.user_agent}</span>}
                          />
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <DeleteLeadButton id={r.id} label={leadLabel(r)} />
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
