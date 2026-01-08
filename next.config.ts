import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  outputFileTracingIncludes: {
    '/*': ['./node_modules/.prisma/**/*', './node_modules/@prisma/client/**/*'],
  },
  serverExternalPackages: ['@prisma/client'],
};

export default nextConfig;
