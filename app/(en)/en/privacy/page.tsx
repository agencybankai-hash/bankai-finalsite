import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { contacts, siteMeta } from "@/content/site";
import { ui } from "@/content/ui";
import { pairAlternates } from "@/lib/i18n";

const t = ui("en");

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How we process and protect personal data.",
  alternates: pairAlternates("/privacy", "/en/privacy", "en"),
};

export default function EnPrivacyPage() {
  return (
    <Container>
      <article className="max-w-3xl py-16 sm:py-20">
        <h1 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          Privacy Policy
        </h1>
        <p className="mt-3 text-sm text-muted">Version of 29 May 2026</p>
        <div className="mt-4 rounded-lg border border-border bg-surface p-4 text-sm text-ink-2">
          Draft - pending legal review. Before publication this template needs to
          be reviewed by a lawyer and checked against Kazakhstan personal data
          law.
        </div>

        <div className="prose-legal mt-8">
          <h2>1. General</h2>
          <p>
            This policy sets out how personal data of visitors to {siteMeta.url}{" "}
            is processed. The data controller is {siteMeta.fullName},{" "}
            {t.footer.city}.
          </p>

          <h2>2. Data we collect</h2>
          <ul>
            <li>Contact details you submit in the request form: name, preferred way to reach you, industry, comment.</li>
            <li>Technical data: IP address, device and browser type, referral source.</li>
            <li>Web analytics data (cookies, session identifiers).</li>
          </ul>

          <h2>3. Purposes of processing</h2>
          <ul>
            <li>Handling requests and contacting you.</li>
            <li>Preparing a proposal and an audit.</li>
            <li>Improving the site and measuring marketing performance.</li>
          </ul>

          <h2>4. Cookies and analytics</h2>
          <p>
            The site uses cookies and web analytics tools. You can disable
            cookies in your browser settings; some features may then stop working
            correctly.
          </p>

          <h2>5. Sharing with third parties</h2>
          <p>
            We do not sell your data. Data may be passed to the analytics
            services and tools we use to handle requests, to the extent needed to
            deliver our services.
          </p>

          <h2>6. Your rights</h2>
          <p>
            You may request access to your data, its correction or deletion, and
            withdraw your consent to processing. To do so, write to{" "}
            {contacts.email}.
          </p>

          <h2>7. Changes to this policy</h2>
          <p>
            We may update this policy. The current version is always published on
            this page.
          </p>

          <h2>8. Contacts</h2>
          <p>
            For data processing questions: {contacts.email}, Telegram{" "}
            {contacts.telegram}.
          </p>
        </div>
      </article>
    </Container>
  );
}
