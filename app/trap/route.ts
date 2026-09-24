import { clientIp, recordTrap } from "@/lib/bot-traps";

export const dynamic = "force-dynamic";

/** Цель невидимой ссылки-ловушки: людям сюда не попасть, боту - метка на IP. */
export async function GET(req: Request) {
  await recordTrap(clientIp(req), req.headers.get("user-agent") ?? "");
  return new Response(null, {
    status: 204,
    headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" },
  });
}
