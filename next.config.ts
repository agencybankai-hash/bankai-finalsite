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
  async headers() {
    return [
      {
        source: "/guides/:file(.*\\.pdf)",
        headers: [{ key: "X-Robots-Tag", value: "noindex" }],
      },
    ];
  },
};

export default nextConfig;
