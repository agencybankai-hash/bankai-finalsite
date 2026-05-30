import { Container } from "@/components/ui/Container";
import { Marquee } from "@/components/motion/Marquee";
import type { ClientLogo } from "@/content/types";

/**
 * Полоса клиентов под hero — бесконечный marquee (донор Osmo).
 * Wireframe-этап: wordmark-плейсхолдеры (сильные - первыми, см.
 * content/site.ts); реальный логотип подставляется полем `logo` -
 * тогда слот рендерит <img>. `nda: true` - показывать обезличенно.
 * Лента full-bleed; подпись - в контейнере.
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
            className="flex h-14 w-44 shrink-0 items-center justify-center px-2"
          >
            {c.logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={c.logo}
                alt={c.name}
                className="max-h-7 w-auto opacity-60 grayscale transition duration-300 hover:opacity-100 hover:grayscale-0"
              />
            ) : (
              <span className="truncate text-sm font-semibold uppercase tracking-wide text-muted transition-colors duration-300 hover:text-ink">
                {c.nda ? "Под NDA" : c.name}
              </span>
            )}
          </div>
        ))}
      </Marquee>
    </div>
  );
}
