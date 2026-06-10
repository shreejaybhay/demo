import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: [
    "@pixi/app",
    "@pixi/core",
    "@pixi/display",
    "@pixi/filter-blur",
    "@pixi/filter-color-matrix",
    "@pixi/sprite",
  ],
};

export default nextConfig;
