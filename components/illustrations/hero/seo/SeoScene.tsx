import type { SceneProps } from "../../types";

/** Сцена SEO: органическая выдача. Заглушка фундамента: трек заменяет сцену целиком. */
export function SeoScene({ v }: SceneProps) {
  return (
    <div className="absolute inset-0 grid place-items-center rounded-xl border border-dashed border-border text-muted">
      <span className="ill-t-md">
        {v.kind}
        {v.city ? ` · ${v.city}` : ""}
      </span>
    </div>
  );
}
