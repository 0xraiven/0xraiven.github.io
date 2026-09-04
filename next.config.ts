import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "github.com",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/keystat",
        destination: "/keystatic",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
