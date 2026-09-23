import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Section, SectionHeader } from "@/components/ui/Section";

/**
 * Лонгрид о рынке города в конце городской страницы: markdown из
 * content/city-longreads. Первая строка «## …» - H2 секции, дальше разделы H3.
 * Типографика гайдов (.guide-prose), но без оглавления и заметок-callout.
 */
export function CityLongread({ markdown }: { markdown: string }) {
  const [first, ...rest] = markdown.trim().split("\n");
  const title = first.replace(/^##\s+/, "");
  return (
    <Section>
      <SectionHeader title={title} />
      <div className="guide-prose mt-8 max-w-3xl">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
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
          }}
        >
          {rest.join("\n")}
        </ReactMarkdown>
      </div>
    </Section>
  );
}
