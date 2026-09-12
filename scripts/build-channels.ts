/**
 * Bundle each channel plugin's vendored TS source into a standalone CJS
 * `index.js` next to it:
 *
 *   pnpm build:channels
 *
 * The `.ts` source under `koris-plugins/channels/<slug>/` is the canonical,
 * hand-maintained copy (same idea as `koris-plugins/tools/<slug>/`). The
 * `index.js` bundles are NOT committed — `.gitignore` excludes them — they are
 * rebuilt here and published as `channels-latest` GitHub release assets by
 * `.github/workflows/build-channels.yml`. `koris` pulls the `.ts`/`.yml`/
 * `package.json` from the repo folder and the `index.js` from that release.
 *
 * The bundle must be SELF-CONTAINED with respect to the host modules
 * (`../contracts`, `../channel-config`, `../../registry`). They used to be
 * marked external on the theory that they'd "resolve at load time against
 * koris/plugins/channels/contracts.ts" — they can't: koris ships those as
 * `.ts`, and Node's CJS resolver never tries a `.ts` extension, so every
 * published bundle threw `Cannot find module '../contracts'` the moment
 * koris's plugin loader required it, and the channel silently vanished.
 *
 * They are therefore bundled in, resolved against the copies vendored at
 * `koris-plugins/channels/contracts.ts`, `koris-plugins/channels/
 * channel-config.ts`, `koris-plugins/registry.ts` and `koris-plugins/config/*`
 * — mirroring koris's own `plugins/` layout so the channel sources' relative
 * imports resolve with no bundler config at all. `scripts/check-host-sync.ts`
 * fails if those copies drift from a local koris checkout.
 *
 * Inlining is safe for the `ADAPTERS` extension point: `PluginRegistry` stores
 * registrations under `point.id` (the string `'channels.adapters'`), not by
 * object identity, so the bundle's own `ExtensionPoint` instance still collects
 * through koris core's.
 *
 * Baileys' OPTIONAL peers (`jimp`, `link-preview-js`, `bufferutil`, native
 * `sharp`/`ws` speedups, …) are left EXTERNAL: baileys `require()`s them lazily
 * inside try/catch and degrades gracefully, and `koris` already ships the ones
 * it wants (e.g. `jimp`) so its copy is reused rather than duplicated into the
 * bundle. So the only unresolved requires in the output should be those and
 * `node:*` builtins — in particular NO relative specifier may survive, and the
 * check below fails the build if one does.
 */
import { build, type Metafile } from 'esbuild';
import { builtinModules } from 'node:module';
import { statSync } from 'node:fs';
import { join } from 'node:path';

const CHANNELS_DIR = join(process.cwd(), 'koris-plugins/channels');
const SLUGS = ['telegram', 'whatsapp'];

// Baileys' optional peers: lazily required inside try/catch, degrade gracefully
// when absent, and koris supplies the ones it wants. Left external so the bundle
// stays lean and doesn't fight koris's own copies / native binaries.
const OPTIONAL_PEERS = [
  'jimp',
  'link-preview-js',
  'audio-decode',
  'sharp',
  '@img/sharp-libvips-dev/cplusplus',
  '@img/sharp-libvips-dev/include',
  'bufferutil',
  'utf-8-validate',
  'supports-color',
];

const ALLOWED_EXTERNAL = OPTIONAL_PEERS;

const EXTERNAL = [
  ...OPTIONAL_PEERS,
  ...builtinModules,
  ...builtinModules.map((m) => `node:${m}`),
];

function unresolvedRequires(meta: Metafile, outfile: string): string[] {
  const out = meta.outputs[outfile];
  if (!out) return [];
  return (out.imports ?? [])
    .filter((i) => i.external)
    .map((i) => i.path)
    .filter((p) => !p.startsWith('node:') && !builtinModules.includes(p))
    .sort();
}

async function main(): Promise<void> {
  let failed = false;

  for (const slug of SLUGS) {
    const entry = join(CHANNELS_DIR, slug, 'index.ts');
    const outfile = join(CHANNELS_DIR, slug, 'index.js');
    const relOut = `koris-plugins/channels/${slug}/index.js`;

    const result = await build({
      entryPoints: [entry],
      outfile,
      bundle: true,
      format: 'cjs',
      platform: 'node',
      target: 'node24',
      external: EXTERNAL,
      logLevel: 'warning',
      metafile: true,
      legalComments: 'none',
    });

    const bytes = statSync(outfile).size;
    const mb = (bytes / 1024 / 1024).toFixed(2);
    const unresolved = unresolvedRequires(result.metafile, relOut);
    // A surviving relative specifier is the exact failure this build guards
    // against: koris would throw `Cannot find module '../contracts'` on load.
    const relatives = unresolved.filter((p) => p.startsWith('.'));
    const stray = unresolved.filter((p) => !p.startsWith('.') && !ALLOWED_EXTERNAL.includes(p));

    console.log(`\n${slug}: ${relOut}  (${mb} MB)`);
    console.log('  external (expected): optional peers, node:*');
    if (relatives.length) {
      console.error(
        `  ✗ relative import(s) left unbundled: ${relatives.join(', ')} — koris cannot resolve these at load time (it ships them as .ts). Check the vendored host modules under koris-plugins/.`,
      );
      failed = true;
    }
    if (stray.length) {
      console.error(`  ✗ unexpected unresolved import(s): ${stray.join(', ')}`);
      failed = true;
    }
    if (!relatives.length && !stray.length) {
      console.log('  ✓ no unexpected unresolved imports');
    }
  }

  if (failed) process.exitCode = 1;
}

main().catch((err) => {
  console.error(err instanceof Error ? err.stack ?? err.message : String(err));
  process.exitCode = 1;
});
