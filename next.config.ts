import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
