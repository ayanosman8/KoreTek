import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configuration options can be added here as needed
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
