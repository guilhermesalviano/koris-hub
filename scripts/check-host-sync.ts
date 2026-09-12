/**
 * Verify the host modules vendored under `koris-plugins/` still match `koris`:
 *
 *   pnpm check:host-sync
 *
 * The channel plugins here import `../contracts`, `../channel-config` and
 * `../../registry`, which belong to `koris`. `scripts/build-channels.ts`
 * bundles them in (they cannot be left external — koris ships them as `.ts`,
 * which Node's CJS resolver will not load), so this repo keeps byte-identical
 * copies at the paths those relative imports resolve to. Drift would ship a
 * channel bundle built against a stale contract.
 *
 * The copies are the source of truth for the *build*; `koris` is the source of
 * truth for their *content*. When a koris checkout is present this fails on any
 * mismatch and prints the diff command to run. Without one (CI) it skips, since
 * there is nothing to compare against.
 */
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

/** vendored path in this repo -> path in the koris checkout */
export const VENDORED_HOST_MODULES: Record<string, string> = {
  'koris-plugins/channels/contracts.ts': 'plugins/channels/contracts.ts',
  'koris-plugins/channels/channel-config.ts': 'plugins/channels/channel-config.ts',
  'koris-plugins/registry.ts': 'plugins/registry.ts',
  'koris-plugins/config/define-config.ts': 'plugins/config/define-config.ts',
  'koris-plugins/config/loader.ts': 'plugins/config/loader.ts',
  'koris-plugins/config/writer.ts': 'plugins/config/writer.ts',
};

export const KORIS_ROOT = process.env.KORIS_ROOT ?? path.resolve(process.env.HOME ?? '', 'projects/koris');

export function hasKorisCheckout(root: string = KORIS_ROOT): boolean {
  return existsSync(path.join(root, 'plugins/channels/contracts.ts'));
}

export interface HostModuleDrift {
  vendored: string;
  upstream: string;
  reason: 'missing-vendored' | 'missing-upstream' | 'content-differs';
}

export function findHostModuleDrift(korisRoot: string = KORIS_ROOT, repoRoot: string = process.cwd()): HostModuleDrift[] {
  const drift: HostModuleDrift[] = [];

  for (const [vendored, upstream] of Object.entries(VENDORED_HOST_MODULES)) {
    const vendoredPath = path.join(repoRoot, vendored);
    const upstreamPath = path.join(korisRoot, upstream);

    if (!existsSync(vendoredPath)) {
      drift.push({ vendored, upstream, reason: 'missing-vendored' });
      continue;
    }
    if (!existsSync(upstreamPath)) {
      drift.push({ vendored, upstream, reason: 'missing-upstream' });
      continue;
    }
    if (readFileSync(vendoredPath, 'utf-8') !== readFileSync(upstreamPath, 'utf-8')) {
      drift.push({ vendored, upstream, reason: 'content-differs' });
    }
  }

  return drift;
}

/** Entry point for `pnpm check:host-sync` (see `scripts/check-host-sync-cli.ts`). */
export function reportHostModuleDrift(): number {
  if (!hasKorisCheckout()) {
    console.log(`[check:host-sync] no koris checkout at ${KORIS_ROOT} — skipping (set KORIS_ROOT to check).`);
    return 0;
  }

  const drift = findHostModuleDrift();
  if (!drift.length) {
    console.log(`[check:host-sync] ✓ ${Object.keys(VENDORED_HOST_MODULES).length} vendored host modules match ${KORIS_ROOT}`);
    return 0;
  }

  for (const { vendored, upstream, reason } of drift) {
    console.error(`[check:host-sync] ✗ ${vendored} (${reason})`);
    console.error(`    diff -u ${path.join(KORIS_ROOT, upstream)} ${vendored}`);
  }
  console.error('\nRe-copy from koris, then rerun `pnpm build:channels` so the bundles pick up the change.');
  return 1;
}
