import type { NextConfig } from "next";

const DEFAULT_API_URL = "https://fixingtools.pythonanywhere.com/api/v1";

// Rasmlar backend'ning /media/ papkasidan keladi — host API manzilidan olinadi
const api = new URL(process.env.NEXT_PUBLIC_API_URL || DEFAULT_API_URL);
const isLocalBackend = ["localhost", "127.0.0.1"].includes(api.hostname);

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "fixingtools.pythonanywhere.com",
        pathname: "/media/**",
      },
      // .env.local da boshqa backend (masalan, lokal Django) ko'rsatilgan bo'lsa
      {
        protocol: api.protocol.replace(":", "") as "http" | "https",
        hostname: api.hostname,
        port: api.port,
        pathname: "/media/**",
      },
    ],
    // Lokal backend rasmlari uchun (faqat API manzili localhost bo'lganda)
    dangerouslyAllowLocalIP: isLocalBackend,
  },
};

export default nextConfig;
