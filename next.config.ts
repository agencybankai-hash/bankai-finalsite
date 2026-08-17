import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Фиксируем корень: в домашней директории есть лишний package-lock.json,
  // из-за которого Next определял workspace root неверно.
  turbopack: {
    root: __dirname,
  },
  // Бывший хаб /services слит с главной.
  async redirects() {
    return [{ source: "/services", destination: "/", permanent: true }];
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
