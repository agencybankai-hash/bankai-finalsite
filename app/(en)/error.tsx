"use client";

import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";

export default function EnError({ reset }: { error: Error; reset: () => void }) {
  return (
    <Section>
      <div className="max-w-2xl">
        <p className="text-label uppercase text-muted">Error</p>
        <h1 className="mt-3 text-h1 text-ink">Something broke</h1>
        <p className="mt-4 text-lead text-ink-2">
          The page failed to load. Try again - if that does not help, write to us
          and we will sort it out.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={reset}
            data-cursor
            className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-ink px-6 text-base font-medium whitespace-nowrap text-bg transition duration-300 ease-osmo hover:bg-ink-2"
          >
            Try again
          </button>
          <Button href="/en" variant="secondary" size="lg">
            Home
          </Button>
        </div>
      </div>
    </Section>
  );
}
