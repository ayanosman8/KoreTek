import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    instrumentationHook: true,
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
