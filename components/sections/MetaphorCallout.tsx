import { Container } from "@/components/ui/Container";
import { SystemIllustration, type SystemVisual } from "@/components/sections/SystemIllustration";

/* Канал → сцена молочной метафоры (те же, что в SystemSection главной). */
const VISUAL_OF: Partial<Record<string, SystemVisual>> = {
  seo: "cow",
  context: "market",
  web: "separator",
};

/**
 * «По-простому»: метафора канала молочным хозяйством (только у хабов).
 * Карточка на полосе surface: слева line-art метафоры, справа текст.
 * Сцена не уже 308px: 10 единиц текста SVG не мельче 11px
 * (на телефоне - во всю ширину карточки, с lg - колонка 22rem).
 */
export function MetaphorCallout({
  channel,
  text,
}: {
  /** Слаг канала: какую иллюстрацию метафоры показать. */
  channel: string;
  text: string;
}) {
  const visual = VISUAL_OF[channel];
  return (
    <div className="border-b border-border bg-surface">
      <Container>
        <div className="py-8">
          <div className="grid overflow-hidden rounded-xl border border-border bg-bg lg:grid-cols-[22rem_minmax(0,1fr)]">
            {visual && (
              <div className="flex items-center justify-center border-b border-border py-5 lg:border-b-0 lg:border-r lg:px-4 lg:py-6">
                <div className="w-full max-w-sm lg:max-w-none">
                  <SystemIllustration variant={visual} animated />
                </div>
              </div>
            )}
            <div className="flex flex-col justify-center p-5 sm:px-7 lg:px-9 lg:py-7">
              <div className="text-label uppercase text-muted">По-простому</div>
              <p className="mt-3 max-w-2xl text-base leading-relaxed text-ink">{text}</p>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
