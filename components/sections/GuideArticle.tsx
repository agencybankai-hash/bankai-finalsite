import { Fragment, type ReactNode } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { sectionId } from "@/lib/guide-toc";
import { rehypeGuideCallouts } from "@/lib/rehype-guide-callouts";

/** Плоский текст из children заголовка (заголовки в гайде - простой текст). */
function nodeText(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(nodeText).join("");
  if (node && typeof node === "object" && "props" in node) {
    return nodeText((node as { props: { children?: ReactNode } }).props.children);
  }
  return "";
}

/* ── Инфографика-цепочка: абзац вида **A → B → C** ── */
type Hast = { type: string; tagName?: string; value?: string; children?: Hast[] };

function hastText(n: Hast): string {
  return n.type === "text" ? (n.value ?? "") : (n.children ?? []).map(hastText).join("");
}

function chainSteps(node: unknown): string[] | null {
  const el = node as Hast | undefined;
  const kids = (el?.children ?? []).filter(
    (c) => !(c.type === "text" && !(c.value ?? "").trim()),
  );
  if (kids.length !== 1) return null;
  const only = kids[0];
  if (only.type !== "element" || only.tagName !== "strong") return null;
  const txt = hastText(only);
  if (!txt.includes("→")) return null;
  const steps = txt.split("→").map((s) => s.trim()).filter(Boolean);
  return steps.length >= 2 ? steps : null;
}

function GuideChain({ steps }: { steps: string[] }) {
  return (
    <div className="gp-chain">
      {steps.map((s, i) => (
        <Fragment key={i}>
          <span className="gp-chain-step">{s}</span>
          {i < steps.length - 1 && (
            <span className="gp-chain-arrow" aria-hidden>
              →
            </span>
          )}
        </Fragment>
      ))}
    </div>
  );
}

/**
 * Рендер тела гайда из markdown. remark-gfm - таблицы/чек-боксы; rehypeGuideCallouts
 * группирует под-блоки в типизированные заметки. Оформление - в .guide-prose.
 */
export function GuideArticle({ markdown }: { markdown: string }) {
  return (
    <div className="guide-prose">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeGuideCallouts]}
        components={{
          h2({ children }) {
            return <h2 id={sectionId(nodeText(children))}>{children}</h2>;
          },
          p(props) {
            const steps = chainSteps((props as { node?: unknown }).node);
            if (steps) return <GuideChain steps={steps} />;
            return <p>{props.children}</p>;
          },
          a({ href, children }) {
            const h = String(href ?? "#");
            return h.startsWith("/") ? (
              <Link href={h}>{children}</Link>
            ) : (
              <a href={h} target="_blank" rel="noopener noreferrer">
                {children}
              </a>
            );
          },
        }}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
}
