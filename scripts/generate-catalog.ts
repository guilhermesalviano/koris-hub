/**
 * SKETCH — re-derive marketplace fields from a local koris checkout and MERGE
 * them into the existing content/marketplace/<slug>.json files.
 *
 *   pnpm tsx scripts/generate-catalog.ts --koris ../koris [--sha <git-sha>]
 *
 * The JSON files are the source of truth. This only refreshes machine-derivable
 * fields (params, readWhen, summary, sourceUrl, capturedFrom) and never touches
 * hand-written prose (description, tags, type, name). Source parsing with regex is
 * brittle — always review the diff.
 *
 * Not wired into CI. Intended as an occasional convenience when koris plugins change.
 */
import { readFileSync, writeFileSync, existsSync, readdirSync } from 'fs';
import { join } from 'path';
import matter from 'gray-matter';

const CATALOG_DIR = join(process.cwd(), 'content/marketplace');
const REPO_TREE = 'https://github.com/guilhermesalviano/koris/tree/main';

function arg(name: string): string | undefined {
  const i = process.argv.indexOf(name);
  return i === -1 ? undefined : process.argv[i + 1];
}

function deriveToolParams(korisDir: string, slug: string) {
  const file = join(korisDir, 'plugins/tools', slug, 'index.ts');
  if (!existsSync(file)) return undefined;
  const srcText = readFileSync(file, 'utf-8');

  // TOOL_NAME may be inline or re-exported from ./constants
  let toolName = srcText.match(/TOOL_NAME\s*=\s*'([^']+)'/)?.[1];
  if (!toolName && existsSync(join(korisDir, 'plugins/tools', slug, 'constants.ts'))) {
    toolName = readFileSync(join(korisDir, 'plugins/tools', slug, 'constants.ts'), 'utf-8').match(
      /TOOL_NAME\s*=\s*'([^']+)'/,
    )?.[1];
  }

  const requiresConfirmation = /REQUIRES CONFIRMATION/i.test(srcText) || undefined;

  // NOTE: a real implementation would parse the `parameters: { ... }` object
  // literal into CatalogParam[]. Left as an exercise — regex-parsing nested TS
  // object literals is exactly the brittleness this comment warns about.
  return { toolName, requiresConfirmation };
}

function deriveSkill(korisDir: string, slug: string) {
  const file = join(korisDir, 'skills', slug, 'SKILL.md');
  if (!existsSync(file)) return undefined;
  const { data } = matter(readFileSync(file, 'utf-8'));
  const readWhen = Array.isArray(data.read_when)
    ? data.read_when
    : typeof data.read_when === 'string'
      ? data.read_when.split(',').map((s: string) => s.trim())
      : undefined;
  return {
    summary: typeof data.description === 'string' ? data.description : undefined,
    readWhen,
  };
}

function main() {
  const korisDir = arg('--koris');
  if (!korisDir) throw new Error('--koris <path-to-koris-checkout> is required');
  const sha = arg('--sha');

  for (const file of readdirSync(CATALOG_DIR)) {
    if (!file.endsWith('.json') || file.startsWith('schema')) continue;
    const path = join(CATALOG_DIR, file);
    const entry = JSON.parse(readFileSync(path, 'utf-8'));
    const slug: string = entry.slug;

    const derived =
      entry.family === 'tool'
        ? deriveToolParams(korisDir, slug)
        : entry.family === 'skill'
          ? deriveSkill(korisDir, slug)
          : undefined;

    if (!derived) {
      console.log(`- ${slug}: no source found, skipped`);
      continue;
    }

    // merge: derived fields win for machine-derivable keys only
    const merged = { ...entry, ...derived, sourceUrl: `${REPO_TREE}/${entry.sourcePath}` };
    if (sha) merged.capturedFrom = sha;

    writeFileSync(path, JSON.stringify(merged, null, 2) + '\n');
    console.log(`~ ${slug}: refreshed`);
  }
}

main();
