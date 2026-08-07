import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FloatingCta } from "@/components/sections/FloatingCta";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { Preloader } from "@/components/motion/Preloader";
import { Cursor } from "@/components/motion/Cursor";
import { siteMeta } from "@/content/site";
import { siteMetaEn } from "@/content/en/ui";
import { ldJson, organizationLdEn } from "@/lib/jsonld";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
  display: "swap",
});

const homeTitle = siteMetaEn.title;
const description = siteMetaEn.description;

export const metadata: Metadata = {
  metadataBase: new URL(siteMeta.url),
  title: {
    default: homeTitle,
    template: "%s · Bankai",
  },
  description,
  alternates: { canonical: "/en" },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: siteMeta.name,
    url: "/en",
    title: homeTitle,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: homeTitle,
    description,
  },
};

export default function EnRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={ldJson(organizationLdEn)}
        />
        <MotionProvider>
          <Header locale="en" />
          <main className="flex-1">{children}</main>
          <Footer locale="en" />
          <FloatingCta locale="en" />
        </MotionProvider>
        <Preloader />
        <Cursor />
      </body>
    </html>
  );
}
