import { createElement, type ReactNode } from "react";
import { extendTailwindMerge } from "tailwind-merge";

/* Токены типо-шкалы DS - иначе twMerge принимает text-h2/text-label за цвет
   текста и вырезает размер при конфликте с text-ink. */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        { text: ["display", "h1", "hero", "h2", "h3", "lead", "label"] },
      ],
    },
  },
});

/** Join классов с разрешением конфликтов Tailwind: className вызова бьёт дефолт. */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return twMerge(parts.filter(Boolean).join(" "));
}

// Неразрывный пробел и word joiner (через код, чтобы не зависеть от кодировки исходника).
const NB = String.fromCharCode(160);
const WJ = String.fromCharCode(0x2060);

// Короткие служебные слова, которые не должны висеть в конце строки.
// Хвостовой пробел - любой, кроме уже неразрывного: иначе второй проход
// снова матчит первое слово пары и не доходит до второго («а не», «и в»).
const SHORT_WORDS =
  /(^|[\s (])([а-яёa-z]{1,2}|под|над|при|для|без|про|или|что|как|это)[^\S\u00A0]+/giu;

/**
 * Типографика: ставит неразрывные пробелы после коротких предлогов/союзов
 * и привязывает тире к предыдущему слову, чтобы они не отрывались
 * на следующую строку.
 */
export function nbsp(text: string): string {
  // тире прилипает к предыдущему слову: «слово<nb>- слово»
  let out = text.replace(/ - /g, NB + "- ");
  // дважды - чтобы захватить идущие подряд короткие слова («а не», «и в»)
  for (let i = 0; i < 2; i++) {
    out = out.replace(SHORT_WORDS, "$1$2" + NB);
  }
  return out;
}

/**
 * Значение с юнитом («25 млн ₸/мес», «от 250 000 ₸») - целиком неразрывным,
 * чтобы разряды и валюта не отрывались на следующую строку.
 */
export function nbspValue(text: string): string {
  return (
    text
      // разряды: «250 000»
      .replace(/(\d) (?=\d)/g, "$1" + NB)
      // цифра + юнит/короткое слово: «000 ₸», «25 млн», «60 → 91»
      .replace(/(\d) (?=[₸$€%→↑↓]|[а-яёa-z]{1,3}(?=[\s/]|$))/giu, "$1" + NB)
      // короткие слова прилипают вперёд: «от 250», «1 к 53»
      .replace(/(^|\s)([а-яёa-z]{1,2}) /giu, "$1$2" + NB)
      // «₸/мес» не рвётся по слэшу (браузер переносит по «/» даже без пробелов)
      .replace(/\//g, "/" + WJ)
  );
}

// Слово через дефис: «SEO-продвижение», «интернет-магазина», «E-commerce».
const HYPHENATED = /([a-zа-яё0-9]+(?:-[a-zа-яё0-9]+)+)/i;

/**
 * Слова через дефис не рвутся на строки: обёртка nowrap вместо U+2011.
 * Символ остаётся обычным дефисом - поиск по странице, копирование и
 * индексация видят исходный текст. На экранах меньше 360px перенос по
 * дефису разрешён: связка «о SEO-продвижении» там шире строки.
 */
export function keepHyphens(text: string): ReactNode {
  const parts = text.split(HYPHENATED);
  if (parts.length === 1) return text;
  return parts.map((part, i) =>
    i % 2
      ? createElement("span", { key: i, className: "min-[360px]:whitespace-nowrap" }, part)
      : part,
  );
}
