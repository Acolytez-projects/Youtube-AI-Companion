import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['i.ytimg.com'], // YouTube thumbnail CDN
    // remotePatterns: [{hostname: 'i.ytimg.com'}] // both words
  },
};

export default nextConfig;
