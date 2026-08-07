import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";

/** 404 внутри EN-раздела: рендерится в EN root-layout, с шапкой и подвалом. */
export default function EnNotFound() {
  return (
    <Section>
      <div className="max-w-2xl">
        <p className="text-label uppercase text-muted">404</p>
        <h1 className="mt-3 text-h1 text-ink">This page does not exist</h1>
        <p className="mt-4 text-lead text-ink-2">
          The link is outdated or the address has a typo. Here is where to look
          instead.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button href="/en" size="lg">
            Home
          </Button>
          <Button href="/en/cases" variant="secondary" size="lg">
            Cases
          </Button>
          <Button href="/en/contacts" variant="secondary" size="lg">
            Contacts
          </Button>
        </div>
      </div>
    </Section>
  );
}
