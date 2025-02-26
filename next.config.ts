import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

const nextConfig: NextConfig = {
  reactStrictMode: !isDev, // Disable in development, enable in production and testing
  /* config options here */
};

export default nextConfig;
