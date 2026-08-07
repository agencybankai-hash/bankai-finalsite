import { notFound } from "next/navigation";

/**
 * Ловушка неизвестных адресов внутри /en. Без неё такой URL не совпадает ни с
 * одним маршрутом EN-группы, и Next отдаёт глобальный app/not-found.tsx - он
 * русский, поэтому на EN-разделе показывалась кириллица. Здесь 404 остаётся
 * внутри группы и попадает в app/(en)/en/not-found.tsx, в EN root-layout.
 *
 * Сегмент обязателен ([...rest], не [[...rest]]), поэтому саму /en не перехватывает,
 * а конкретные маршруты (/en/cases, /en/contacts) как более специфичные выигрывают.
 */
export default function EnNotFoundCatchAll() {
  notFound();
}
