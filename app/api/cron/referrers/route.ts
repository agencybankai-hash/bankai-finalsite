import { notifyTelegramText } from "@/lib/notify";
import {
  buildReferrerReport,
  claimRun,
  currentReportDay,
  markAlerted,
  pruneReferrers,
  releaseRun,
} from "@/lib/referrers";

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
  if (params.has("dry")) {
    const report = await buildReferrerReport({
      force: params.has("force"),
      day: params.get("day") ?? undefined,
    });
    return Response.json({ ok: true, dry: true, ...report });
  }

  // Vercel может доставить один запуск дважды: второй выходит сразу.
  const day = await currentReportDay();
  if (!(await claimRun(day))) return Response.json({ ok: true, day, skipped: "already-ran" });

  try {
    const report = await buildReferrerReport({ day });
    if (report.text) {
      await notifyTelegramText(report.text);
      await markAlerted(report.keys);
    }
    return Response.json({
      ok: true,
      day,
      sent: Boolean(report.text),
      newHosts: report.newHosts.length,
      spike: Boolean(report.spike),
    });
  } catch (e) {
    // Сбой отправки или БД: освобождаем день, повторный запуск (vercel crons run) пришлёт отчёт.
    await releaseRun(day).catch((err) => console.error("referrer run release failed:", err));
    throw e;
  } finally {
    await pruneReferrers().catch((err) => console.error("referrer prune failed:", err));
  }
}
