import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';
import {
  CatalogEntry,
  Family,
  FAMILY_LABELS,
  FAMILY_ORDER,
  REQUIRED_KEYS,
} from '@content/marketplace/schema';

const CATALOG_DIR = join(process.cwd(), 'content/marketplace');

function validate(entry: Partial<CatalogEntry>, file: string): CatalogEntry {
  for (const key of REQUIRED_KEYS) {
    if (entry[key] === undefined || entry[key] === null) {
      throw new Error(`marketplace/${file}: missing required field "${key}"`);
    }
  }
  if (!FAMILY_ORDER.includes(entry.family as Family)) {
    throw new Error(`marketplace/${file}: invalid family "${entry.family}"`);
  }
  const expectedSlug = file.replace(/\.json$/, '');
  if (entry.slug !== expectedSlug) {
    throw new Error(`marketplace/${file}: slug "${entry.slug}" must equal the filename "${expectedSlug}"`);
  }
  return entry as CatalogEntry;
}

let cache: CatalogEntry[] | null = null;

export function getAllEntries(): CatalogEntry[] {
  if (cache) return cache;

  const files = readdirSync(CATALOG_DIR).filter(
    (f) => f.endsWith('.json') && !f.startsWith('schema'),
  );

  const entries = files.map((file) => {
    const raw = JSON.parse(readFileSync(join(CATALOG_DIR, file), 'utf-8'));
    return validate(raw, file);
  });

  entries.sort((a, b) => {
    const fam = FAMILY_ORDER.indexOf(a.family) - FAMILY_ORDER.indexOf(b.family);
    return fam !== 0 ? fam : a.name.localeCompare(b.name);
  });

  cache = entries;
  return entries;
}

export function getEntry(slug: string): CatalogEntry | undefined {
  return getAllEntries().find((e) => e.slug === slug);
}

export interface FamilyGroup {
  family: Family;
  label: string;
  entries: CatalogEntry[];
}

export function getFamilyGroups(): FamilyGroup[] {
  const all = getAllEntries();
  return FAMILY_ORDER.map((family) => ({
    family,
    label: FAMILY_LABELS[family],
    entries: all.filter((e) => e.family === family),
  })).filter((g) => g.entries.length > 0);
}
