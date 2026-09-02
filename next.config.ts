import type { NextConfig } from 'next';

// GitHub Pages project site: https://guilhermesalviano.github.io/koris
// If a custom domain is added later (public/CNAME), set `basePath: ''`.
const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/koris',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // This repo is nested inside the `koris` checkout; pin the workspace root so
  // Turbopack doesn't walk up to koris/pnpm-workspace.yaml.
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
