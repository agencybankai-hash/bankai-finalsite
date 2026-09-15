import type { Metadata } from "next";
import type { ReactNode } from "react";

const TITLE = "КП Bankai - Альянс39: запуск под ключ в Алматы";
const DESCRIPTION =
  "Коммерческое предложение Bankai.Agency: новый бренд, сайт с посадочными и квизом, реклама Google / Яндекс / Meta, контент, SEO и карты.";

export const metadata: Metadata = {
  metadataBase: new URL("https://bankai.agency"),
  title: "КП Bankai - Альянс39",
  description: DESCRIPTION,
  robots: { index: false, follow: false },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "https://bankai.agency/kp/alliance39",
    siteName: "Bankai.Agency",
    type: "article",
    locale: "ru_RU",
    images: [{ url: "/og/kp-alliance39.png", width: 1200, height: 630, alt: TITLE }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/og/kp-alliance39.png"],
  },
};

export default function KpLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru">
      <body style={{ margin: 0, background: "#F7F6F2", color: "#1B1B19", fontFamily: "system-ui, -apple-system, sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
