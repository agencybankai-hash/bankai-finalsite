import Link from "next/link";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { Section, SectionHeader } from "@/components/ui/Section";
import { LongreadFold } from "@/components/sections/LongreadFold";

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

/**
 * Лонгрид над футером: markdown из content/longreads или content/city-longreads.
 * Первая строка «## …» - H2 секции, текст до первого «### » - вводка, она видна
 * всегда. Остальное свёрнуто по высоте и раскрывается кнопкой, но целиком
 * лежит в HTML сервера. Типографика гайдов (.guide-prose), без оглавления.
 */
export function Longread({ markdown }: { markdown: string }) {
  const [first, ...rest] = markdown.trim().split("\n");
  const title = first.replace(/^##\s+/, "");
  const body = rest.join("\n");
  const cut = body.search(/^### /m);
  const intro = cut === -1 ? body : body.slice(0, cut);
  const more = cut === -1 ? "" : body.slice(cut);
  return (
    <Section>
      <div data-longread>
        <SectionHeader title={title} />
        <div className="guide-prose mt-8 max-w-3xl">
          <Markdown>{intro}</Markdown>
          {more && (
            <LongreadFold>
              <Markdown>{more}</Markdown>
            </LongreadFold>
          )}
        </div>
      </div>
    </Section>
  );
}
