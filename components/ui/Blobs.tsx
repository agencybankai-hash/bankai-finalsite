import { cn } from "@/lib/utils";

/**
 * Декоративный слой органических blob-форм для full-bleed блоков
 * (донор metatag — индиго-секции с мягкими пятнами). Низкая прозрачность,
 * aria-hidden. tone подбирает цвет под тёмный/светлый блок.
 */
const BLOB_1 =
  "M40,-50C52,-40,60,-26,62,-11C64,4,60,20,51,33C42,46,28,56,12,60C-4,64,-22,62,-37,53C-52,44,-64,28,-67,11C-70,-6,-64,-24,-53,-38C-42,-52,-26,-62,-9,-64C8,-66,26,-60,40,-50Z";
const BLOB_2 =
  "M38,-48C49,-39,57,-26,61,-11C65,4,65,21,57,33C49,45,33,52,17,57C1,62,-16,65,-31,59C-46,53,-59,38,-64,21C-69,4,-66,-15,-57,-30C-48,-45,-33,-56,-17,-61C-1,-66,15,-65,38,-48Z";

export function Blobs({
  tone = "dark",
  className,
}: {
  /** dark — для tone-ink блоков (светлые пятна); light — для светлых блоков */
  tone?: "dark" | "light";
  className?: string;
}) {
  const fill = tone === "dark" ? "rgba(255,255,255,0.05)" : "rgba(28,26,24,0.04)";
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      <svg
        className="absolute -left-28 -top-28 h-[30rem] w-[30rem]"
        viewBox="0 0 200 200"
      >
        <path fill={fill} d={BLOB_1} transform="translate(100 100)" />
      </svg>
      <svg
        className="absolute -bottom-36 -right-28 h-[36rem] w-[36rem]"
        viewBox="0 0 200 200"
      >
        <path fill={fill} d={BLOB_2} transform="translate(100 100)" />
      </svg>
    </div>
  );
}
