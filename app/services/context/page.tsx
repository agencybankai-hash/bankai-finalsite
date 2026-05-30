import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ChannelPage } from "@/components/sections/ChannelPage";
import { getChannel } from "@/content/services";

const channel = getChannel("context");

export const metadata: Metadata = {
  title: channel?.title,
  description: channel?.hero.subtitle,
};

export default function ContextPage() {
  if (!channel) notFound();
  return <ChannelPage channel={channel} />;
}
