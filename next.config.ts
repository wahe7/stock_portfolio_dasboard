import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  env: {
    API_ENDPOINTS: process.env.API_ENDPOINTS,
  },
};

export default nextConfig;
