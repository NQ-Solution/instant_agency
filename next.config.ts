import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone', // 메모리 최적화 - 배포 크기 감소
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
