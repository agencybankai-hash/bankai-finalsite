import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ChannelPage } from "@/components/sections/ChannelPage";
import { getChannel } from "@/content/services";
import { getLanding, landings } from "@/content/landings";
import { breadcrumbLd, faqLd, ldJson, serviceLd } from "@/lib/jsonld";

type Params = { params: Promise<{ channel: string; slug: string }> };

export function generateStaticParams() {
  return landings.map((l) => ({ channel: l.channel, slug: l.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { channel, slug } = await params;
  const landing = getLanding(channel, slug);
  if (!landing) return {};
  return {
    title: landing.title,
    description: landing.description,
    alternates: { canonical: landing.path },
  };
}

export default async function ServiceLandingPage({ params }: Params) {
  const { channel, slug } = await params;
  const landing = getLanding(channel, slug);
  const parent = landing && getChannel(landing.channel);
  if (!landing || !parent) notFound();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={ldJson(
          serviceLd(landing.title, landing.description, landing.path),
        )}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={ldJson(faqLd(landing.faq))}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={ldJson(
          breadcrumbLd([
            { name: "Главная", path: "/" },
            { name: parent.title, path: `/services/${parent.slug}` },
            { name: landing.hero.title, path: landing.path },
          ]),
        )}
      />
      <ChannelPage channel={parent} landing={landing} />
    </>
  );
}
