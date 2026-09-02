import type { NextConfig } from 'next';

// Served from the custom domain https://hub.koaris.com (public/CNAME).
// Site is at the domain root, so no basePath.
const nextConfig: NextConfig = {
  output: 'export',
  basePath: '',
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
