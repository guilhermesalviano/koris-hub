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
 * Cross-repo imports (`../contracts`, `../channel-config`, `../../registry`) are
 * marked EXTERNAL: those modules live in `koris`, and once the bundle is pulled
 * to `koris/plugins/channels/<slug>/index.js` they resolve at load time against
 * `koris/plugins/channels/contracts.ts` etc. The third-party runtime deps
 * (`@whiskeysockets/baileys`, `@guilhermesalviano/telegram-bot`,
 * `qrcode-terminal`) ARE inlined.
 *
 * Baileys' OPTIONAL peers (`jimp`, `link-preview-js`, `bufferutil`, native
 * `sharp`/`ws` speedups, …) are left EXTERNAL: baileys `require()`s them lazily
 * inside try/catch and degrades gracefully, and `koris` already ships the ones
 * it wants (e.g. `jimp`) so its copy is reused rather than duplicated into the
 * bundle. So the only unresolved requires in the output should be those, the
 * three cross-repo relatives, and `node:*` builtins.
 *
 * NOTE: the earlier hand-built artifact inlined `../contracts`. If koris's
 * plugin loader ever needs it inlined (e.g. `ADAPTERS` extension-point identity
 * must be the exact same object as core's), drop the relative entries from
 * `EXTERNAL` below and add a `koris` checkout step to the workflow so esbuild
 * can resolve them.
 */
import { build, type Metafile } from 'esbuild';
import { builtinModules } from 'node:module';
import { statSync } from 'node:fs';
import { join } from 'node:path';

const CHANNELS_DIR = join(process.cwd(), 'koris-plugins/channels');
const SLUGS = ['telegram', 'whatsapp'];

// Provided by koris at load time — never bundled here.
const EXTERNAL_RELATIVE = ['../contracts', '../channel-config', '../../registry'];

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

const ALLOWED_EXTERNAL = [...EXTERNAL_RELATIVE, ...OPTIONAL_PEERS];

const EXTERNAL = [
  ...EXTERNAL_RELATIVE,
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
    const stray = unresolvedRequires(result.metafile, relOut).filter(
      (p) => !ALLOWED_EXTERNAL.includes(p),
    );

    console.log(`\n${slug}: ${relOut}  (${mb} MB)`);
    console.log(`  external (expected): ${EXTERNAL_RELATIVE.join(', ')}, optional peers, node:*`);
    if (stray.length) {
      console.error(`  ✗ unexpected unresolved import(s): ${stray.join(', ')}`);
      failed = true;
    } else {
      console.log('  ✓ no unexpected unresolved imports');
    }
  }

  if (failed) process.exitCode = 1;
}

main().catch((err) => {
  console.error(err instanceof Error ? err.stack ?? err.message : String(err));
  process.exitCode = 1;
});
