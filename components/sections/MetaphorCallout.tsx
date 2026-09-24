import { Container } from "@/components/ui/Container";

/** «По-простому»: метафора канала молочным хозяйством (только у хабов). */
export function MetaphorCallout({
  channel,
  text,
}: {
  /** Слаг канала: какую иллюстрацию метафоры показать. */
  channel: string;
  text: string;
}) {
  void channel;
  return (
    <div className="border-b border-border bg-surface">
      <Container>
        <div className="max-w-3xl py-8">
          <div className="rounded-lg border-l-2 border-ink bg-surface-2 px-4 py-3.5">
            <div className="text-xs uppercase tracking-wide text-muted">По-простому</div>
            <p className="mt-1 text-base leading-relaxed text-ink">{text}</p>
          </div>
        </div>
      </Container>
    </div>
  );
}
