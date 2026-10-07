import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "fixingtools.pythonanywhere.com",
      },
    ],
  },
};

export default nextConfig;
