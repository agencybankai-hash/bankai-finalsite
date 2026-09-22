import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Фиксируем корень: в домашней директории есть лишний package-lock.json,
  // из-за которого Next определял workspace root неверно.
  turbopack: {
    root: __dirname,
  },
  // Бывший хаб /services слит с главной; старая структура сайта (/ru-префикс,
  // /policy-privacy, слаг ak-cabinet) - на новые адреса, чтобы не терять
  // проиндексированные URL из Search Console.
  async redirects() {
    return [
      { source: "/services", destination: "/", permanent: true },
      { source: "/ru", destination: "/", permanent: true },
      { source: "/ru/cases/ak-cabinet", destination: "/cases/ak-cabinet-craft", permanent: true },
      { source: "/en/cases/ak-cabinet", destination: "/en/cases/ak-cabinet-craft", permanent: true },
      { source: "/ru/:path*", destination: "/:path*", permanent: true },
      // Адреса старого сайта (Wayback Machine), отдававшие 404: EN-страницы
      // «about», EN-кейса ROCS и страницы thanks-page на новом сайте нет.
      { source: "/en/about", destination: "/en", statusCode: 301 },
      { source: "/en/cases/rocs", destination: "/en/cases", statusCode: 301 },
      { source: "/thanks-page", destination: "/", statusCode: 301 },
      {
        source: "/cases/ak-cabinet",
        destination: "/cases/ak-cabinet-craft",
        statusCode: 301,
      },
      // Лендинг «создание сайтов» слит с родительской услугой (один интент).
      // Появится отдельная городовая sozdanie-saitov-almaty - редирект убрать.
      {
        source: "/services/web/sozdanie-saitov-almaty",
        destination: "/services/web",
        permanent: true,
      },
      // Лидогенерация и настройка Google Ads переехали на гео-нейтральные адреса.
      // statusCode 301, а не permanent: true (Next отдаёт 308): приёмка ждёт 301.
      {
        source: "/services/seo/lidogeneraciya-almaty",
        destination: "/services/leadgen",
        statusCode: 301,
      },
      {
        source: "/services/context/nastroika-google-ads-almaty",
        destination: "/services/context/nastroika-google-ads",
        statusCode: 301,
      },
      { source: "/policy-privacy", destination: "/privacy", permanent: true },
      { source: "/en/policy-privacy", destination: "/en/privacy", permanent: true },
    ];
  },
  // PDF-чек-листы - лид-магниты, а не посадочные: из индекса убираем.
  // Любой хост, кроме боевого (*.vercel.app, preview-алиасы) - целиком noindex,
  // чтобы дубли сайта не попадали в индекс.
  async headers() {
    return [
      // Базовые заголовки безопасности для всех ответов. Полный CSP отдельно:
      // ему нужны nonce для inline-скриптов Next.
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
          },
        ],
      },
      {
        source: "/guides/:file(.*\\.pdf)",
        headers: [{ key: "X-Robots-Tag", value: "noindex" }],
      },
      {
        source: "/:path*",
        missing: [{ type: "host", value: "(www\\.)?bankai\\.agency" }],
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
};

export default nextConfig;
