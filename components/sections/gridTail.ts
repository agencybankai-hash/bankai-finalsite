/**
 * Хвост неполного ряда сетки. Базовая сетка удваивается по колонкам
 * (2 → 4, 3 → 6), элементы занимают по 2 колонки — ширины и гэпы те же,
 * зато элементы последнего неполного ряда сдвигаются через col-start
 * и ряд встаёт по центру, без дыры справа.
 */
export function gridTail(index: number, count: number, columns: 2 | 3): string {
  const cls: string[] = [];
  const last = index === count - 1;

  if (count % 2 === 1 && last) cls.push("sm:col-start-2");

  if (columns === 3) {
    const rest = count % 3;
    if (rest === 1 && last) cls.push("lg:col-start-3");
    else if (rest === 2 && index === count - 2) cls.push("lg:col-start-2");
    else if (cls.length) cls.push("lg:col-start-auto");
  }

  return cls.join(" ");
}
