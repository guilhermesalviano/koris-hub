import { existsSync } from 'node:fs';
import path from 'node:path';
import { defineConfig } from 'vitest/config';

/**
 * The channel plugins vendored under `koris-plugins/channels/` import three
 * modules that belong to `koris` and are supplied by it at load time —
 * `scripts/build-channels.ts` marks `../contracts`, `../channel-config` and
 * `../../registry` EXTERNAL for exactly that reason. To run the suites that
 * touch them we point those three specifiers at a local koris checkout, using
 * the same `$HOME/projects/...` convention koris's own `bundle-channels.ts`
 * uses to find this repo. Override with `KORIS_ROOT=/path/to/koris pnpm test`.
 *
 * Without a koris checkout (CI), only the suites that need none of it run.
 */
const KORIS_ROOT = process.env.KORIS_ROOT ?? path.resolve(process.env.HOME ?? '', 'projects/koris');
const HAS_KORIS = existsSync(path.join(KORIS_ROOT, 'plugins/channels/contracts.ts'));

const SELF_CONTAINED = [
  'koris-plugins/channels/*/contact-names.test.ts',
  'koris-plugins/channels/*/extract-message.test.ts',
  'koris-plugins/channels/*/jid.test.ts',
  'koris-plugins/channels/*/mention.test.ts',
];

export default defineConfig({
  test: {
    environment: 'node',
    include: HAS_KORIS ? ['koris-plugins/channels/**/*.test.ts'] : SELF_CONTAINED,
  },
  resolve: {
    // `pnpm build:channels` drops a bundled `index.js` next to each plugin's
    // `index.ts`; without this, `import './index'` in a suite would silently
    // test the stale bundle instead of the source.
    extensions: ['.ts', '.tsx', '.mts', '.mjs', '.js', '.jsx', '.json'],
    alias: HAS_KORIS
      ? [
          { find: /^\.\.\/contracts$/, replacement: path.join(KORIS_ROOT, 'plugins/channels/contracts.ts') },
          { find: /^\.\.\/channel-config$/, replacement: path.join(KORIS_ROOT, 'plugins/channels/channel-config.ts') },
          { find: /^\.\.\/\.\.\/registry$/, replacement: path.join(KORIS_ROOT, 'plugins/registry.ts') },
        ]
      : [],
  },
});
