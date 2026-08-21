import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import { ChannelPage } from "@/components/sections/ChannelPage";
import { serviceCrumbs } from "@/components/sections/Breadcrumbs";
import { getChannel } from "@/content/services";
import { getLanding, landings } from "@/content/landings";
import { breadcrumbLd, faqLd, ldJson, serviceLd } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/metadata";

type Params = { params: Promise<{ channel: string; slug: string }> };

export function generateStaticParams() {
  return landings.map((l) => ({ channel: l.channel, slug: l.slug }));
}

export async function generateMetadata(
  { params }: Params,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { channel, slug } = await params;
  const landing = getLanding(channel, slug);
  if (!landing) return {};
  return pageMetadata({
    title: landing.title,
    description: landing.description,
    path: landing.path,
  })(params, parent);
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
          serviceLd(landing.title, landing.description, landing.path, {
            serviceType: parent.navLabel,
            areaServed: landing.geo ?? ["Алматы", "Казахстан"],
            priceFrom: landing.answer.priceFrom,
          }),
        )}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={ldJson(faqLd(landing.faq))}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={ldJson(
          breadcrumbLd(
            serviceCrumbs(parent, landing).map((c) => ({
              name: c.label,
              path: c.href,
            })),
          ),
        )}
      />
      <ChannelPage channel={parent} landing={landing} />
    </>
  );
}
