/**
 * Refresh the vendored changelog snapshot at content/changelog.md.
 *
 *   pnpm sync:changelog                       # fetch from raw.githubusercontent.com
 *   pnpm sync:changelog --koris ../koris      # copy from a local koris checkout
 *
 * The snapshot is committed so the site build stays hermetic (no network in CI).
 * Run this whenever the koris CHANGELOG.md changes.
 */
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const RAW_URL =
  'https://raw.githubusercontent.com/guilhermesalviano/koris/main/CHANGELOG.md';
const DEST = join(process.cwd(), 'content/changelog.md');

async function main() {
  const korisFlagIndex = process.argv.indexOf('--koris');
  let markdown: string;

  if (korisFlagIndex !== -1) {
    const korisDir = process.argv[korisFlagIndex + 1];
    if (!korisDir) throw new Error('--koris requires a path to a koris checkout');
    markdown = readFileSync(join(korisDir, 'CHANGELOG.md'), 'utf-8');
  } else {
    const res = await fetch(RAW_URL);
    if (!res.ok) throw new Error(`GET ${RAW_URL} -> ${res.status}`);
    markdown = await res.text();
  }

  writeFileSync(DEST, markdown);
  console.log(`Wrote ${markdown.length} bytes to ${DEST}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
