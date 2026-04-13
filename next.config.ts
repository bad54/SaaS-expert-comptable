import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow images from Supabase Storage
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
    ],
  },
  // Standalone output for Railway deployment
  output: "standalone",
  // Stripe webhook needs raw body
  serverExternalPackages: ["stripe"],
};

export default nextConfig;
