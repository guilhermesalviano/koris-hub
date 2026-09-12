import { defineConfig } from 'vitest/config';

/**
 * The channel plugins under `koris-plugins/channels/` import three host modules
 * that belong to `koris` — `../contracts`, `../channel-config` and
 * `../../registry`. This repo keeps byte-identical copies at exactly the paths
 * those relative specifiers resolve to (`koris-plugins/channels/contracts.ts`,
 * `koris-plugins/registry.ts`, …), so both vitest and `scripts/build-channels.ts`
 * resolve them with no aliasing and the full suite runs in CI without a koris
 * checkout. `pnpm check:host-sync` guards those copies against drift.
 */
export default defineConfig({
  test: {
    environment: 'node',
    include: ['koris-plugins/channels/**/*.test.ts', 'scripts/**/*.test.ts'],
  },
  resolve: {
    // `pnpm build:channels` drops a bundled `index.js` next to each plugin's
    // `index.ts`; without this, `import './index'` in a suite would silently
    // test the stale bundle instead of the source.
    extensions: ['.ts', '.tsx', '.mts', '.mjs', '.js', '.jsx', '.json'],
  },
});
