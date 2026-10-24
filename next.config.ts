import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
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
