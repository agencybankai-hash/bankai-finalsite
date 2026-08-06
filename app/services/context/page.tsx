import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ChannelPage } from "@/components/sections/ChannelPage";
import { getChannel } from "@/content/services";
import { ldJson, serviceLd } from "@/lib/jsonld";

const channel = getChannel("context");
const path = "/services/context";

export const metadata: Metadata = {
  title: channel?.title,
  description: channel?.hero.subtitle,
  alternates: { canonical: path },
};

export default function ContextPage() {
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
