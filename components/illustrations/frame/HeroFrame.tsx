import { cn } from "@/lib/utils";
import { InView } from "@/components/motion/InView";
import type { VisualCopy } from "@/content/types";
import { FloatChip } from "./FloatChip";
import { anim } from "../vars";

/**
 * Рамка hero-визуала: тёмная панель (.tone-ink - токены внутри инвертируются,
 * line-art сцены работает и на светлом, и на тёмном), шапка «метка | контекст»,
 * сцена 8:5, два KPI, подпись-источник и плавающая карточка с цифрой кейса.
 * Высота задана шириной (сцена держит aspect-ratio) - колонка текста не прыгает.
 * На мобиле карточка - строкой под панелью; mobile="hide" - визуал только с lg.
 */
export function HeroFrame({
  kind,
  city,
  copy,
  mobile = "show",
  children,
}: {
  /** Вид визуала - в data-visual (проверки, галерея). */
  kind: string;
  city?: string;
  copy: VisualCopy;
  mobile?: "show" | "hide";
  /** Сцена 480×300 (1em = 1/48 ширины). */
  children: React.ReactNode;
}) {
  const { float } = copy;
  const disclaimer = float
    ? `${copy.disclaimer} Цифра в карточке - из кейса «${float.case}».`
    : copy.disclaimer;
  // role="img" глушит детей для скринридера - цифру кейса дублируем в подпись
  const label = float
    ? `${copy.label}. Кейс ${float.case}: ${float.value} ${float.note}.`
    : copy.label;

  return (
    <InView
      intro="load"
      role="img"
      aria-label={label}
      data-visual={kind}
      data-city={city}
      data-nosnippet=""
      className={cn(
        "fade-rise rise-3 relative mx-auto w-full max-w-[34rem] select-none lg:max-w-none",
        mobile === "hide" && "hidden lg:block",
      )}
    >
      {/* Мягкий коралл-радиал позади панели (донор metatag) */}
      <div
        aria-hidden
        className="absolute -inset-8 -z-10 rounded-[2.5rem] bg-[radial-gradient(120%_120%_at_75%_15%,var(--color-accent-soft),transparent_62%)]"
      />

      <div className={cn("tone-ink rounded-2xl p-5 shadow-float sm:p-7", float && "lg:pb-9")}>
        <div className="flex h-5 items-center justify-between gap-4 text-label uppercase">
          {/* На узкой панели сокращается контекст, а не метка */}
          <span className="inline-flex shrink-0 items-center gap-2 text-ink-2">
            <span aria-hidden className="h-1.5 w-1.5 shrink-0 rounded-full bg-ink-2" />
            {copy.title}
          </span>
          {copy.meta && <span className="min-w-0 truncate text-muted">{copy.meta}</span>}
        </div>

        <div className="ill-stage relative mt-5 aspect-[8/5]">
          <div className="ill-scene">{children}</div>
        </div>

        {copy.kpis && (
          // Ниже 360px - столбиком: «еженедельно» шире половины панели
          <div className="mt-5 grid grid-cols-1 gap-4 border-t border-border pt-4 min-[360px]:grid-cols-2">
            {copy.kpis.map((k, i) => (
              <div key={k.label} className="a-rise" style={anim({ delay: 2.5, i })}>
                <div className="text-xl font-semibold tracking-tight text-ink tabular-nums sm:text-2xl">
                  {k.value}
                </div>
                <div className="mt-0.5 text-xs text-muted sm:text-sm">{k.label}</div>
              </div>
            ))}
          </div>
        )}

        <p
          className={cn(
            "mt-4 text-[11px] leading-snug text-muted",
            float && "lg:max-w-[58%]",
          )}
        >
          {disclaimer}
        </p>
      </div>

      {float && (
        <>
          <FloatChip float={float} className="absolute -bottom-12 -right-7 hidden w-48 lg:block" />
          <p className="mt-3 text-sm text-ink-2 lg:hidden">
            <span className="text-muted">Кейс · {float.case}:</span> {float.value} {float.note}
          </p>
        </>
      )}
    </InView>
  );
}
