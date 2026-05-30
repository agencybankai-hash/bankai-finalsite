/**
 * Rehype-плагин: группирует под-блоки гайда (H3 фиксированного словаря + следующий
 * контент до следующего заголовка) в типизированные контейнеры-заметки.
 * Тип определяется по тексту H3. Незнакомые блоки проходят без изменений.
 */

type HastNode = {
  type: string;
  tagName?: string;
  value?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
};

const LABELS: { test: RegExp; type: string }[] = [
  { test: /^зачем/i, type: "why" },
  { test: /^как\s*(это\s*)?работает/i, type: "how" },
  { test: /^сделай сам/i, type: "do" },
  { test: /^где сливают/i, type: "warn" },
  { test: /^чек-?лист/i, type: "checklist" },
];

function textOf(node: HastNode): string {
  if (node.type === "text") return node.value ?? "";
  return (node.children ?? []).map(textOf).join("");
}

function classify(node: HastNode): string | null {
  if (node.type !== "element" || node.tagName !== "h3") return null;
  const t = textOf(node).trim();
  return LABELS.find((l) => l.test.test(t))?.type ?? null;
}

export function rehypeGuideCallouts() {
  return (tree: unknown) => {
    const root = tree as HastNode;
    const src = root.children ?? [];
    const out: HastNode[] = [];

    for (let i = 0; i < src.length; i++) {
      const node = src[i];
      const type = classify(node);
      if (!type) {
        out.push(node);
        continue;
      }
      // Собираем заголовок + контент до следующего h2/h3.
      const group: HastNode[] = [node];
      let j = i + 1;
      while (j < src.length) {
        const n = src[j];
        if (n.type === "element" && (n.tagName === "h2" || n.tagName === "h3")) break;
        group.push(n);
        j++;
      }
      i = j - 1;
      out.push({
        type: "element",
        tagName: "div",
        properties: { className: ["gp-callout", `gp-${type}`] },
        children: group,
      });
    }

    root.children = out;
  };
}
