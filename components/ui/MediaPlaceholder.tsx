import { cn } from "@/lib/utils";

/**
 * Плейсхолдер медиа для wireframe-этапа.
 * Реальные изображения/видео подставляются на этапе дизайна.
 */
export function MediaPlaceholder({
  label = "Изображение",
  ratio = "16/9",
  className,
}: {
  label?: string;
  ratio?: "16/9" | "4/3" | "1/1" | "3/2" | "auto";
  className?: string;
}) {
  const ratioClass =
    ratio === "16/9"
      ? "aspect-video"
      : ratio === "4/3"
        ? "aspect-[4/3]"
        : ratio === "1/1"
          ? "aspect-square"
          : ratio === "3/2"
            ? "aspect-[3/2]"
            : "";
  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-xl border border-dashed border-border bg-surface-2 text-center",
        ratioClass,
        className,
      )}
    >
      <span className="px-4 text-sm text-muted">[ {label} ]</span>
    </div>
  );
}
