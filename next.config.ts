// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // ✅ Supabase (cualquier project ref)
      { protocol: "https", hostname: "*.supabase.co", pathname: "/**" },

      // ✅ Unsplash (si lo usas)
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
    ],
  },
};

export default nextConfig;