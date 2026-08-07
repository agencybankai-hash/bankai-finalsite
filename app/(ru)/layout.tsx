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
import { ldJson, organizationLd } from "@/lib/jsonld";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
  display: "swap",
});

const homeTitle = "Маркетинговое агентство в Алматы - лидогенерация | Bankai";

export const metadata: Metadata = {
  metadataBase: new URL(siteMeta.url),
  title: {
    default: homeTitle,
    template: "%s · Bankai",
  },
  description: siteMeta.description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    siteName: siteMeta.name,
    url: "/",
    title: homeTitle,
    description: siteMeta.description,
  },
  twitter: {
    card: "summary_large_image",
    title: homeTitle,
    description: siteMeta.description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`${inter.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={ldJson(organizationLd)}
        />
        <MotionProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <FloatingCta />
        </MotionProvider>
        <Preloader />
        <Cursor />
      </body>
    </html>
  );
}
