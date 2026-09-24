import { notifyTelegramText } from "@/lib/notify";
import { buildReferrerReport, markAlerted, pruneReferrers } from "@/lib/referrers";

export const dynamic = "force-dynamic";

/**
 * Ежедневный отчёт о подозрительных источниках (vercel.json → crons,
 * 04:00 UTC = 09:00 Алматы). Vercel присылает Authorization: Bearer CRON_SECRET;
 * без секрета в env эндпоинт закрыт. Проверка руками:
 *   ?dry=1          - отчёт в JSON, без отправки и без записи;
 *   ?dry=1&force=1  - то же без защиты от шума на старте;
 *   ?dry=1&day=YYYY-MM-DD - отчёт за другой день (например, за сегодня).
 */
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  const params = new URL(req.url).searchParams;
  const dry = params.has("dry");
  const report = await buildReferrerReport(
    dry ? { force: params.has("force"), day: params.get("day") ?? undefined } : {},
  );
  if (dry) return Response.json({ ok: true, dry: true, ...report });

  // Отметку ставим только после успешной отправки: при сбое Telegram
  // следующий запуск сообщит то же самое ещё раз.
  if (report.text) {
    await notifyTelegramText(report.text);
    await markAlerted(report.keys);
  }
  await pruneReferrers();

  return Response.json({
    ok: true,
    day: report.day,
    sent: Boolean(report.text),
    newHosts: report.newHosts.length,
    spikes: report.spikes.length,
  });
}
