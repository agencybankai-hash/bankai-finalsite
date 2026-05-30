import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Basic-Auth на админку. Логин/пароль - из env (ADMIN_USER / ADMIN_PASSWORD).
// Next 16: конвенция proxy.ts (бывш. middleware.ts).
export const config = { matcher: ["/admin/:path*", "/api/admin/:path*"] };

export function proxy(req: NextRequest) {
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
