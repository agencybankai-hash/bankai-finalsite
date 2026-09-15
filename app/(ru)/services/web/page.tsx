import { notFound } from "next/navigation";
import { ChannelPage } from "@/components/sections/ChannelPage";
import { getChannel } from "@/content/services";
import { faqLd, geoNeutralAreas, ldJson, serviceLd } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/metadata";

const channel = getChannel("web");
const path = "/services/web";

export const generateMetadata = pageMetadata({
  title: channel?.title ?? "",
  description: channel?.description ?? "",
  path,
});

export default function WebPage() {
  if (!channel) notFound();
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={ldJson(
          serviceLd(channel.title, channel.hero.subtitle, path, {
            serviceType: channel.navLabel,
            areaServed: geoNeutralAreas,
            priceFrom: channel.pricing.value,
          }),
        )}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={ldJson(faqLd(channel.faq))}
      />
      <ChannelPage channel={channel} />
    </>
  );
}
