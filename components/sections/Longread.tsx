import { Fragment } from "react";
import Link from "next/link";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { Section } from "@/components/ui/Section";
import { LongreadFold } from "@/components/sections/LongreadFold";
import { sectionId } from "@/lib/guide-toc";
import { cn, keepHyphens, nbsp } from "@/lib/utils";

const components: Components = {
  // Таблица шире колонки на телефоне прокручивается сама, а не вся страница
  table({ children }) {
    return (
      <div className="overflow-x-auto">
        <table>{children}</table>
      </div>
    );
  },
  a({ href, children }) {
    const h = String(href ?? "#");
    return h.startsWith("/") ? (
      <Link href={h}>{children}</Link>
    ) : (
      <a href={h} target="_blank" rel="nofollow noopener noreferrer">
        {children}
      </a>
    );
  },
};

function Markdown({ children }: { children: string }) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
      {children}
    </ReactMarkdown>
  );
}

type Part = {
  id: string;
  title: string;
  body: string;
  /** Раздел «Источники»: число ссылок в списке, раздел без номера. */
  sources?: number;
};

/** Разбор файла: «## » - заголовок, до первого «### » - вводка, дальше разделы. */
function parse(markdown: string) {
  const [first, ...rest] = markdown.trim().split("\n");
  const title = first.replace(/^##\s+/, "");
  const body = rest.join("\n");
  const cut = body.search(/^### /m);
  const intro = (cut === -1 ? body : body.slice(0, cut)).trim();
  const parts: Part[] = (cut === -1 ? "" : body.slice(cut))
    .split(/^### /m)
    .filter((chunk) => chunk.trim())
    .map((chunk) => {
      const nl = chunk.indexOf("\n");
      const heading = (nl === -1 ? chunk : chunk.slice(0, nl)).trim();
      const text = nl === -1 ? "" : chunk.slice(nl + 1);
      return {
        id: sectionId(heading),
        title: heading,
        body: text,
        sources: /^Источники/i.test(heading)
          ? (text.match(/^[-*] /gm) ?? []).length
          : undefined,
      };
    });
  // Время чтения: слова без адресов ссылок, 180 слов в минуту
  const words = markdown
    .replace(/\]\([^)]*\)/g, "]")
    .split(/\s+/)
    .filter((w) => /[\p{L}\p{N}]/u.test(w)).length;
  return { title, intro, parts, minutes: Math.max(1, Math.round(words / 180)) };
}

// Номер раздела - CSS-счётчик, в тексте заголовка и ссылки его нет:
// поиск по странице, копирование и выдача видят чистый заголовок.
const numbered =
  "before:[counter-increment:longread] before:content-[counter(longread,decimal-leading-zero)]";

/**
 * Лонгрид над футером: markdown из content/longreads или content/city-longreads.
 * Первая строка «## …» - H2 секции, текст до первого «### » - вводка, разделы
 * «### …» (простой текст) - оглавление с номерами. Статья свёрнута целиком и
 * раскрывается кнопкой или строкой оглавления, но лежит в HTML сервера.
 * Справочный блок: заголовок на ступень ниже продающих секций, отступы меньше.
 */
export function Longread({ markdown }: { markdown: string }) {
  const { title, intro, parts, minutes } = parse(markdown);

  const lead = (
    <>
      <p className="text-label uppercase text-muted">
        Статья · {minutes}&nbsp;мин чтения
      </p>
      <h2 className="mt-4 text-h3 text-balance text-ink">{keepHyphens(nbsp(title))}</h2>
      {intro && (
        <div className="guide-prose mt-5">
          <Markdown>{intro}</Markdown>
        </div>
      )}
    </>
  );

  return (
    <Section className="py-14 lg:py-20">
      <div data-longread>
        {parts.length === 0 ? (
          <div className="max-w-2xl">{lead}</div>
        ) : (
          <LongreadFold
            lead={lead}
            toc={
              <nav aria-label="Содержание статьи">
                <p className="text-label uppercase text-muted">Содержание</p>
                <ol className="mt-4 border-t border-border [counter-reset:longread]">
                  {parts.map((p) => (
                    <li key={p.id} className="border-b border-border">
                      <a
                        href={`#${p.id}`}
                        data-longread-jump
                        className={cn(
                          "group flex items-baseline gap-4 py-3 text-base leading-snug text-ink-2 transition-colors duration-300 ease-osmo hover:text-ink focus-visible:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
                          "before:w-6 before:shrink-0 before:text-sm before:tabular-nums before:text-muted",
                          p.sources === undefined ? numbered : "before:content-['']",
                        )}
                      >
                        <span className="flex-1">{keepHyphens(nbsp(p.title))}</span>
                        {p.sources === undefined ? (
                          <span
                            aria-hidden
                            className="text-muted opacity-0 transition duration-300 ease-osmo group-hover:translate-y-0.5 group-hover:opacity-100 group-focus-visible:opacity-100"
                          >
                            ↓
                          </span>
                        ) : (
                          <span className="text-sm tabular-nums text-muted">{p.sources}</span>
                        )}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            }
          >
            <div className="max-w-2xl [counter-reset:longread]">
              {parts.map((p) => (
                <Fragment key={p.id}>
                  <h3
                    id={p.id}
                    tabIndex={-1}
                    className={cn(
                      "mt-12 flex scroll-mt-24 items-baseline gap-3 text-lg leading-snug font-semibold text-ink outline-none first:mt-0",
                      p.sources === undefined &&
                        `${numbered} before:shrink-0 before:font-normal before:tabular-nums before:text-muted`,
                    )}
                  >
                    {/* Одна обёртка: иначе куски от keepHyphens станут flex-элементами с gap */}
                    <span>{keepHyphens(nbsp(p.title))}</span>
                  </h3>
                  {p.sources === undefined ? (
                    <div className="guide-prose mt-3">
                      <Markdown>{p.body}</Markdown>
                    </div>
                  ) : (
                    // Источники - справка к тексту: мельче и тише основного текста
                    <div className="mt-3 text-sm leading-relaxed text-ink-2 [&_a]:text-ink [&_a]:underline [&_a]:underline-offset-2 [&_li]:my-1.5 [&_li]:marker:text-muted [&_ul]:list-disc [&_ul]:pl-5">
                      <Markdown>{p.body}</Markdown>
                    </div>
                  )}
                </Fragment>
              ))}
            </div>
          </LongreadFold>
        )}
      </div>
    </Section>
  );
}
