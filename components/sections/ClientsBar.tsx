import { Container } from "@/components/ui/Container";
import { Marquee } from "@/components/motion/Marquee";
import type { ClientLogo } from "@/content/types";

/**
 * Полоса клиентов под hero — бесконечный marquee (донор Osmo).
 * Wireframe-этап: wordmark-плейсхолдеры (сильные - первыми, см.
 * content/site.ts); реальный логотип подставляется полем `logo` -
 * тогда слот рендерит <img>. `nda: true` - показывать обезличенно.
 * Лента full-bleed; подпись - в контейнере. Лента однородна: всё в ч/б
 * (лого - grayscale, текст - ink), цвет проявляется по ховеру.
 */
export function ClientsBar({
  items,
  caption,
}: {
  items: ClientLogo[];
  caption?: string;
}) {
  return (
    <div className="border-b border-border bg-bg py-10">
      {caption && (
        <Container>
          <div className="mb-6 text-center text-label uppercase text-muted">
            {caption}
          </div>
        </Container>
      )}
      <Marquee pxPerSecond={50}>
        {items.map((c) => (
          <div
            key={c.name}
            className="mx-2.5 flex h-16 w-44 shrink-0 items-center justify-center rounded-xl border border-border bg-bg px-4 shadow-card"
          >
            {c.logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={c.logo}
                alt={c.name}
                className="max-h-7 w-auto max-w-full rounded-md object-contain grayscale transition duration-300 hover:grayscale-0"
              />
            ) : (
              <span className="truncate text-sm font-semibold uppercase tracking-wide text-ink">
                {c.nda ? "Под NDA" : c.name}
              </span>
            )}
          </div>
        ))}
      </Marquee>
    </div>
  );
}
