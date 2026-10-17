import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Mahsulot / yangilik rasmlari backend'dan keladi
    remotePatterns: [
      {
        protocol: "https",
        hostname: "fixingtools.pythonanywhere.com",
        pathname: "/media/**",
      },
    ],
  },
};

export default nextConfig;
