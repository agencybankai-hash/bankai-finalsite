import { NextResponse } from "next/server";
import { issueFormToken, MIN_FILL_MS } from "@/lib/form-token";
import { toCountryCode } from "@/lib/phone";

export const dynamic = "force-dynamic";

/**
 * Метка формы для статических страниц (форма в CTASection). Выдать её при
 * рендере нельзя: страница собрана заранее, метка была бы из момента сборки -
 * проверка времени заполнения не работала бы, а через MAX_AGE все заявки
 * отклонялись бы как просроченные. Форма запрашивает метку, когда посетитель
 * до неё дошёл, и заодно получает страну по IP для флага телефона - как
 * страница контактов (lib/geo.ts). В БД ничего не пишется.
 */
export function GET(req: Request) {
  return NextResponse.json(
    {
      formToken: issueFormToken(),
      country: toCountryCode(req.headers.get("x-vercel-ip-country")),
      minAgeMs: MIN_FILL_MS,
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
