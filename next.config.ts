import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "search.pstatic.net",
      },
      {
        protocol: "https",
        hostname: "s.pstatic.net",
      },
      {
        protocol: "https",
        hostname: "movie-phinf.pstatic.net",
      },
    ],
    // 또는 옛 방식
    // domains: ["search.pstatic.net", "s.pstatic.net", "movie-phinf.pstatic.net"],
  },
};

export default nextConfig;
