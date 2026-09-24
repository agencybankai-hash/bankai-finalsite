import { cn } from "@/lib/utils";
import type { VisualFloat } from "@/content/types";
import { anim } from "../vars";

/**
 * Плавающая карточка поверх панели: одна реальная цифра кейса со страницы.
 * Нейтральная (коралл в сцене один - точка заявки). Внешняя обёртка плавает
 * (3 цикла), внутренняя проявляется - по одному примитиву на элемент.
 */
export function FloatChip({ float, className }: { float: VisualFloat; className?: string }) {
  return (
    <div className={cn("a-float", className)} style={anim({ delay: 3.1 })}>
      <div
        className="a-rise rounded-xl border border-border bg-bg p-4 shadow-float"
        style={anim({ delay: 2.7 })}
      >
        <div className="text-xs text-muted">Кейс · {float.case}</div>
        <div className="mt-1.5 text-2xl font-semibold tracking-tight text-ink tabular-nums">
          {float.value}
        </div>
        <div className="mt-0.5 text-xs leading-snug text-ink-2">{float.note}</div>
      </div>
    </div>
  );
}
