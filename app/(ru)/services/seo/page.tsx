import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ChannelPage } from "@/components/sections/ChannelPage";
import { getChannel } from "@/content/services";
import { ldJson, serviceLd } from "@/lib/jsonld";

const channel = getChannel("seo");
const path = "/services/seo";

export const metadata: Metadata = {
  title: channel?.title,
  description: channel?.hero.subtitle,
  alternates: { canonical: path },
};

export default function SeoPage() {
  if (!channel) notFound();
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={ldJson(
          serviceLd(channel.title, channel.hero.subtitle, path),
        )}
      />
      <ChannelPage channel={channel} />
    </>
  );
}
