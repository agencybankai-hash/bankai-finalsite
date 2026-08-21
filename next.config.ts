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
      // Лендинг «создание сайтов» слит с родительской услугой (один интент).
      {
        source: "/services/web/sozdanie-saitov-almaty",
        destination: "/services/web",
        permanent: true,
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
