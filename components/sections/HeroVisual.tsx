import { cn } from "@/lib/utils";
import { FloatCard } from "@/components/ui/FloatCard";

/**
 * Правая колонка hero: тёмная панель-«снимок результата». Контраст
 * light/dark (донор Osmo) + смысл под value-prop («видите, сколько
 * заявок и почём»). Панель поднимается (.rise), бары растут снизу
 * каскадом (.grow-y) - всё на CSS, без GSAP и без скрытия до гидратации.
 * Иллюстративная инфографика Hi-Fi-этапа (цифры — из реальных claim'ов).
 */
const BARS = [30, 42, 36, 54, 62, 78, 92]; // % высоты, по нарастающей

export function HeroVisual() {
  return (
    <div className="fade-rise rise-3 relative">
      {/* Мягкий коралл-радиал позади панели (донор metatag) */}
      <div
        aria-hidden
        className="absolute -inset-8 -z-10 rounded-[2.5rem] bg-[radial-gradient(120%_120%_at_75%_15%,var(--color-accent-soft),transparent_62%)]"
      />

      {/* Центральная тёмная панель — «снимок результата» */}
      {/* pb с запасом: снизу справа панель перекрывает floating-карточка,
          которая ещё и качается по вертикали (±8px) */}
      <div className="rounded-2xl bg-ink p-7 pb-24 text-bg shadow-float">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-2 text-label uppercase text-bg/55">
            <span className="h-2 w-2 rounded-full bg-accent" aria-hidden />
            Динамика заявок
          </span>
          <span className="text-label uppercase text-bg/40">90 дней</span>
        </div>

        <div className="mt-7 flex h-40 items-end gap-2.5" aria-hidden>
          {BARS.map((h, i) => (
            <span
              key={i}
              style={{ height: `${h}%`, animationDelay: `${0.55 + i * 0.06}s` }}
              className={cn(
                "grow-y flex-1 rounded-t-sm",
                i >= BARS.length - 2 ? "bg-accent" : "bg-bg/15",
              )}
            />
          ))}
        </div>

        <div className="mt-7 grid grid-cols-2 gap-4 border-t border-bg/10 pt-5">
          <div>
            <div className="text-2xl font-semibold tracking-tight">−40%</div>
            <div className="mt-0.5 text-sm text-bg/55">стоимость заявки</div>
          </div>
          <div>
            <div className="text-2xl font-semibold tracking-tight">5,2x</div>
            <div className="mt-0.5 text-sm text-bg/55">ROAS в проектах</div>
          </div>
        </div>

        {/* Дисклеймер: график и карточка — схема, а не выгрузка одного клиента */}
        <p className="mt-4 max-w-[58%] text-[11px] leading-snug text-bg/50">
          Иллюстрация. Цифры - средние по нашим проектам.
        </p>
      </div>

      {/* Floating-карточка-метрика (пример, не данные конкретного клиента) */}
      <div className="absolute -bottom-12 -right-7 w-44">
        <FloatCard
          float
          style={{ animationDelay: "-3.5s" }}
          label="Заявок / мес · пример"
          value="86"
          delta="↑ 38%"
          icon="trending"
        />
      </div>
    </div>
  );
}
