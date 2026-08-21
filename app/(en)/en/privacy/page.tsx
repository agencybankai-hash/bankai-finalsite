import { Container } from "@/components/ui/Container";
import { contacts, siteMeta } from "@/content/site";
import { ui } from "@/content/ui";
import { pageMetadata } from "@/lib/metadata";

const t = ui("en");

export const generateMetadata = pageMetadata({
  title: "Privacy Policy",
  description: "How we process and protect personal data.",
  path: "/en/privacy",
  locale: "en",
});

export default function EnPrivacyPage() {
  return (
    <Container>
      <article className="max-w-3xl py-16 sm:py-20">
        <h1 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          Privacy Policy
        </h1>
        <p className="mt-3 text-sm text-muted">Updated 21 August 2026</p>

        <div className="prose-legal mt-8">
          <h2>1. Who processes your data</h2>
          <p>
            This policy sets out what data {siteMeta.url} collects, why it is
            needed, where it is stored and for how long. The data controller is{" "}
            {siteMeta.fullName}, {t.footer.city}.
          </p>

          <h2>2. Data we collect</h2>
          <p>From the request form - only what you fill in yourself:</p>
          <ul>
            <li>name;</li>
            <li>a way to reach you: email, phone or messenger;</li>
            <li>
              the service you are interested in, your industry and a revenue
              range - if you provide them;
            </li>
            <li>your comment.</li>
          </ul>
          <p>
            Two technical fields are stored with the request: the browser string
            (user agent) and a source label, so we can tell form requests from
            other channels. Your IP address is used only at the moment of
            submission, to protect the form from spam, and is not written to the
            database.
          </p>

          <h2>3. How we use it</h2>
          <ul>
            <li>To answer your request and reach you through the contact you left.</li>
            <li>To prepare an audit and a proposal.</li>
            <li>To keep track of requests and see which channels bring clients.</li>
          </ul>
          <p>
            We do not use form data for mailings unless you ask for them, and we
            do not pass it to third parties for advertising.
          </p>

          <h2>4. Where data is stored</h2>
          <p>
            Requests are stored in a PostgreSQL database on Neon; the site runs
            on Vercel. Servers of both platforms are located outside Kazakhstan,
            so by submitting the form you agree to a cross-border transfer of
            your data. Access to the database is limited to the agency staff who
            need it to handle requests.
          </p>

          <h2>5. Cookies and web analytics</h2>
          <p>
            The site uses Google web analytics - Google Analytics 4 and Google
            Tag Manager. They collect anonymised visit statistics: pages,
            referral source, device and browser type, and set their own cookies.
            Form data is not passed to analytics: on a successful submission only
            a request event with the service name and source is sent, without
            your name or contact details.
          </p>
          <p>
            You can switch this off in your browser settings or with the Google
            Analytics Opt-out add-on. With cookies disabled some site features
            may behave differently.
          </p>

          <h2>6. Who we share it with</h2>
          <p>
            We do not sell your data. To the extent needed to run the services,
            it is accessible to our infrastructure providers: Vercel - site
            hosting, Neon - request database, Google - web analytics.
          </p>

          <h2>7. Retention</h2>
          <p>
            We keep a request and the correspondence around it for 3 years from
            your last contact, then delete it. If you withdraw consent earlier,
            we delete it on request.
          </p>

          <h2>8. Your rights and withdrawing consent</h2>
          <p>
            You may ask what data we hold about you, have it corrected or
            deleted, and withdraw your consent to processing. Write to{" "}
            {contacts.email} from the contact you left in the form - we handle
            such requests within 10 working days.
          </p>

          <h2>9. Changes to this policy</h2>
          <p>
            This policy may be updated. The current version is always on this
            page, with the update date at the top.
          </p>

          <h2>10. Contacts</h2>
          <p>
            For data processing questions: {contacts.email}, Telegram{" "}
            {contacts.telegram}.
          </p>
        </div>
      </article>
    </Container>
  );
}
