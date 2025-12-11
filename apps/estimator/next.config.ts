import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@repo/ui", "@repo/ai", "@repo/database"],
};

export default nextConfig;
