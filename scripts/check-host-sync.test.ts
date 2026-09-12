import { describe, expect, it } from 'vitest';
import { existsSync } from 'node:fs';
import path from 'node:path';
import {
  KORIS_ROOT,
  VENDORED_HOST_MODULES,
  findHostModuleDrift,
  hasKorisCheckout,
} from './check-host-sync';

describe('vendored host modules', () => {
  it('lists every module the channel bundles resolve out of this repo', () => {
    expect(Object.keys(VENDORED_HOST_MODULES).sort()).toEqual([
      'koris-plugins/channels/channel-config.ts',
      'koris-plugins/channels/contracts.ts',
      'koris-plugins/config/define-config.ts',
      'koris-plugins/config/loader.ts',
      'koris-plugins/config/writer.ts',
      'koris-plugins/registry.ts',
    ]);
  });

  it('all exist in this repo, so esbuild can resolve them without a koris checkout', () => {
    for (const vendored of Object.keys(VENDORED_HOST_MODULES)) {
      expect(existsSync(path.join(process.cwd(), vendored)), vendored).toBe(true);
    }
  });

  // Skipped in CI, where there is no koris checkout to compare against.
  it.skipIf(!hasKorisCheckout())(`match ${KORIS_ROOT} byte for byte`, () => {
    expect(findHostModuleDrift()).toEqual([]);
  });
});
