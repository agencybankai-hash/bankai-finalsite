import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Фиксируем корень: в домашней директории есть лишний package-lock.json,
  // из-за которого Next определял workspace root неверно.
  turbopack: {
    root: __dirname,
  },
  // Бывший хаб /services слит с главной.
  async redirects() {
    return [{ source: "/services", destination: "/", permanent: false }];
  },
};

export default nextConfig;
