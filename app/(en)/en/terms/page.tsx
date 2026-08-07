import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { contacts, siteMeta } from "@/content/site";
import { ui } from "@/content/ui";
import { pairAlternates } from "@/lib/i18n";

const t = ui("en");

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Terms for using the site and requesting our services.",
  alternates: pairAlternates("/terms", "/en/terms", "en"),
};

export default function EnTermsPage() {
  return (
    <Container>
      <article className="max-w-3xl py-16 sm:py-20">
        <h1 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          Terms of Use
        </h1>
        <p className="mt-3 text-sm text-muted">Version of 29 May 2026</p>
        <div className="mt-4 rounded-lg border border-border bg-surface p-4 text-sm text-ink-2">
          Draft - pending legal review. Before publication this template needs to
          be reviewed by a lawyer.
        </div>

        <div className="prose-legal mt-8">
          <h2>1. General</h2>
          <p>
            By using {siteMeta.url} you agree to these terms. The site belongs to{" "}
            {siteMeta.fullName}, {t.footer.city}.
          </p>

          <h2>2. Services</h2>
          <p>
            The site is for information only. Service descriptions, prices and
            timelines are not a public offer; the final terms are set out in a
            contract.
          </p>

          <h2>3. Requests and communication</h2>
          <p>
            By submitting a request you consent to the processing of your
            personal data under the privacy policy and to us contacting you
            through the details you provide.
          </p>

          <h2>4. Intellectual property</h2>
          <p>
            The materials on this site - texts, images, design elements - belong
            to {siteMeta.fullName}. Use without written permission is not
            allowed.
          </p>

          <h2>5. Limitation of liability</h2>
          <p>
            Information on the site is provided “as is”. We are not liable for
            decisions made on the basis of the materials on this site without
            prior consultation.
          </p>

          <h2>6. Changes</h2>
          <p>
            We may update these terms. The current version is published on this
            page.
          </p>

          <h2>7. Contacts</h2>
          <p>
            Questions about these terms: {contacts.email}, Telegram{" "}
            {contacts.telegram}.
          </p>
        </div>
      </article>
    </Container>
  );
}
