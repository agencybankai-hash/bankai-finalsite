import { notFound } from "next/navigation";
import { ChannelPage } from "@/components/sections/ChannelPage";
import { getChannel } from "@/content/services";
import { faqLd, ldJson, serviceLd } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/metadata";

const channel = getChannel("context");
const path = "/services/context";

export const generateMetadata = pageMetadata({
  title: channel?.title ?? "",
  description: channel?.hero.subtitle ?? "",
  path,
});

export default function ContextPage() {
  if (!channel) notFound();
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={ldJson(
          serviceLd(channel.title, channel.hero.subtitle, path, {
            serviceType: channel.navLabel,
            areaServed: ["Алматы", "Казахстан"],
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
