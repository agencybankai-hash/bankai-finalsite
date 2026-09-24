import { NextResponse } from "next/server";
import type { NextFetchEvent, NextRequest } from "next/server";
import {
  isBlockedReferrer,
  SUSPICIOUS_TLD_MODE,
  suspiciousReferrer,
} from "@/content/blocked-referrers";
import { clientIp, recordTrap } from "@/lib/bot-traps";
import { navigationSource, recordReferrer } from "@/lib/referrers";

/**
 * Next 16: конвенция proxy.ts (бывш. middleware.ts). Три задачи:
 * 1) Referer из списка бот-редиректоров (content/blocked-referrers.ts),
 *    а в режиме "block" - и из подозрительных доменных зон оттуда же -
 *    403 на любой путь, заход пишется в bot_traps (IP, UA, источник);
 * 2) источник каждой загрузки страницы - в referrer_daily для ежедневного
 *    отчёта о новых доменах и всплесках (lib/referrers.ts);
 * 3) Basic-Auth на внутренние разделы: админка и контент-чеклист
 *    (логин/пароль из env ADMIN_USER / ADMIN_PASSWORD).
 * Статика и картинки исключены из matcher: там ни то, ни другое не нужно.
 */
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|icon\\.svg|apple-icon\\.png|fonts/|flags/|logos/|og/|guides/.*\\.pdf).*)",
  ],
};

const PRIVATE_PATH = /^\/(admin|checklist|api\/(admin|checklist))(\/|$)/;

export function proxy(req: NextRequest, event: NextFetchEvent) {
  const referer = req.headers.get("referer");
  const blocked =
    isBlockedReferrer(referer) ??
    (SUSPICIOUS_TLD_MODE === "block" ? suspiciousReferrer(referer) : null);
  if (blocked) {
    event.waitUntil(
      recordTrap(clientIp(req), req.headers.get("user-agent") ?? "", `referer:${blocked}`),
    );
    return new NextResponse("Forbidden", {
      status: 403,
      headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex" },
    });
  }

  const source = navigationSource(req);
  if (source) event.waitUntil(recordReferrer(source));

  if (!PRIVATE_PATH.test(req.nextUrl.pathname)) return NextResponse.next();

  const user = process.env.ADMIN_USER;
  const pass = process.env.ADMIN_PASSWORD;

  if (!user || !pass) {
    return new NextResponse("Админка не настроена (нет ADMIN_USER/ADMIN_PASSWORD).", {
      status: 503,
    });
  }

  const auth = req.headers.get("authorization") ?? "";
  if (auth.startsWith("Basic ")) {
    let decoded = "";
    try {
      decoded = atob(auth.slice(6));
    } catch {}
    const i = decoded.indexOf(":");
    if (i >= 0 && decoded.slice(0, i) === user && decoded.slice(i + 1) === pass) {
      return NextResponse.next();
    }
  }

  return new NextResponse("Требуется авторизация.", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Bankai Admin", charset="UTF-8"' },
  });
}
