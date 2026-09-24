import { notFound } from "next/navigation";
import { ChannelPage } from "@/components/sections/ChannelPage";
import { getChannel } from "@/content/services";
import { faqLd, geoNeutralAreas, ldJson, serviceLd } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/metadata";
import { readLongread } from "@/lib/longread";

const channel = getChannel("context");
const path = "/services/context";

export const generateMetadata = pageMetadata({
  title: channel?.title ?? "",
  description: channel?.description ?? "",
  path,
});

export default async function ContextPage() {
  if (!channel) notFound();
  const longread = await readLongread(channel.longread);
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
      <ChannelPage channel={channel} longread={longread} />
    </>
  );
}
