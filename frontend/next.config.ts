import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "a0.muscache.com"
      },
      {
        protocol: "https",
        hostname: "2chat-user-data-dev.s3.amazonaws.com"
      },
      {
        protocol: "https",
        hostname: "2chat-user-data.s3.amazonaws.com"
      }
    ]
  }
};

export default nextConfig;
