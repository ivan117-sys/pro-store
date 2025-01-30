import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  webpack: (config) => {
    config.cache = false; // Disable Webpack caching to prevent memory issues
    return config;
  },
};

export default nextConfig;
