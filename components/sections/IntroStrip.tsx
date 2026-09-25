import { nbsp, nbspValue } from "@/lib/utils";
import { Container } from "@/components/ui/Container";
import type { IntroFacts } from "@/content/intro-facts";

/** Первое предложение абзаца - определение, его выделяем тоном. */
function splitLead(text: string): [string, string] {
  const m = text.match(/^(.+?[.!?])\s+(?=[А-ЯЁA-Z«])/);
  return m ? [m[1], text.slice(m[0].length)] : [text, ""];
}

/**
 * Интро-полоса под hero: абзац - прямой ответ на запрос, целиком (его читает
 * AI Overview), справа факты чипами - срок, цена, гео. Колонки стоят по сетке
 * hero: текст под текстом, чипы под визуалом. На мобиле чипы над текстом.
 */
export function IntroStrip({ text, timeline, priceFrom, geo }: { text: string } & IntroFacts) {
  const facts = [
    timeline && { label: "Срок", value: timeline },
    priceFrom && { label: "Цена", value: `от ${priceFrom}` },
    geo && { label: "Гео", value: geo },
  ].filter((f): f is { label: string; value: string } => Boolean(f));
  const [lead, rest] = splitLead(nbsp(text));

  return (
    <div className="border-b border-border bg-surface">
      <Container>
        <div className="grid gap-6 py-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-14 lg:py-12">
          {facts.length > 0 && (
            <dl className="flex flex-wrap gap-2 lg:col-start-2 lg:row-start-1 lg:flex-col lg:items-start lg:gap-2.5">
              {facts.map((f) => (
                <div
                  key={f.label}
                  className="inline-flex items-baseline gap-2 rounded-full border border-border bg-bg px-4 py-2 text-sm"
                >
                  <dt className="text-muted">{f.label}</dt>
                  <dd className="font-semibold text-ink">{nbspValue(f.value)}</dd>
                </div>
              ))}
            </dl>
          )}
          {/* max-w-xl при 18 px - до 60 знаков в строке */}
          <p className="max-w-xl text-base leading-relaxed text-ink-2 sm:text-lg sm:leading-relaxed lg:col-start-1 lg:row-start-1">
            <span className="font-medium text-ink">{lead}</span>
            {rest && ` ${rest}`}
          </p>
        </div>
      </Container>
    </div>
  );
}
