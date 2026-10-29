import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  allowedDevOrigins: [
    "192.168.8.94",
    "192.168.8.94:7777",
    "localhost",
    "localhost:7777",
    "127.0.0.1",
    "127.0.0.1:7777",
  ],
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 0,
    deviceSizes: [360, 480, 640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  async headers() {
    return [
      {
        source: "/brand/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "no-cache, no-store, must-revalidate",
          },
        ],
      },
      {
        source: "/api/products",
        headers: [
          {
            key: "Cache-Control",
            value: "public, s-maxage=60, stale-while-revalidate=300",
          },
        ],
      },
      {
        source: "/api/settings",
        headers: [
          {
            key: "Cache-Control",
            value: "public, s-maxage=60, stale-while-revalidate=300",
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/product/sulaf-rough-away",
        destination: "/product/absolutes-smoothing-body-cream",
        permanent: true,
      },
      {
        source: "/products/sulaf-rough-away",
        destination: "/product/absolutes-smoothing-body-cream",
        permanent: true,
      },
      {
        source: "/product/rough-away",
        destination: "/product/absolutes-smoothing-body-cream",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
