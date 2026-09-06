import { readdirSync, readFileSync, statSync } from 'fs';
import { basename, join, relative } from 'path';
import { DEFAULT_LOCALE, type Locale } from '@/i18n/locales';
import {
  CatalogEntry,
  Family,
  FAMILY_DIRS,
  FAMILY_LABELS,
  FAMILY_ORDER,
  REQUIRED_KEYS,
} from '@content/marketplace/schema';

const CATALOG_DIR = join(process.cwd(), 'content/marketplace');

/** recursively collect every *.json file under dir (entries live in family subfolders) */
function collectEntryFiles(dir: string): string[] {
  const out: string[] = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) {
      out.push(...collectEntryFiles(full));
    } else if (name.endsWith('.json')) {
      out.push(full);
    }
  }
  return out;
}

function validate(entry: Partial<CatalogEntry>, filePath: string): CatalogEntry {
  const relPath = relative(CATALOG_DIR, filePath);
  for (const key of REQUIRED_KEYS) {
    if (entry[key] === undefined || entry[key] === null) {
      throw new Error(`marketplace/${relPath}: missing required field "${key}"`);
    }
  }
  if (!FAMILY_ORDER.includes(entry.family as Family)) {
    throw new Error(`marketplace/${relPath}: invalid family "${entry.family}"`);
  }
  const expectedSlug = basename(filePath, '.json');
  if (entry.slug !== expectedSlug) {
    throw new Error(`marketplace/${relPath}: slug "${entry.slug}" must equal the filename "${expectedSlug}"`);
  }
  const expectedDir = FAMILY_DIRS[entry.family as Family];
  if (relative(CATALOG_DIR, join(filePath, '..')) !== expectedDir) {
    throw new Error(
      `marketplace/${relPath}: family "${entry.family}" entries must live under "${expectedDir}/"`,
    );
  }
  return entry as CatalogEntry;
}

let cache: CatalogEntry[] | null = null;

export function getAllEntries(): CatalogEntry[] {
  if (cache) return cache;

  const entries = collectEntryFiles(CATALOG_DIR).map((file) => {
    const raw = JSON.parse(readFileSync(file, 'utf-8'));
    return validate(raw, file);
  });

  entries.sort((a, b) => {
    const fam = FAMILY_ORDER.indexOf(a.family) - FAMILY_ORDER.indexOf(b.family);
    return fam !== 0 ? fam : a.name.localeCompare(b.name);
  });

  cache = entries;
  return entries;
}

/**
 * Apply a locale's translation over the English prose. Params, tags, and every
 * structural field stay as authored — only name/summary/description localize.
 */
function localizeEntry(entry: CatalogEntry, locale: Locale): CatalogEntry {
  if (locale === DEFAULT_LOCALE) return entry;
  const t = entry.i18n?.[locale];
  if (!t) return entry;
  return {
    ...entry,
    name: t.name ?? entry.name,
    summary: t.summary ?? entry.summary,
    description: t.description ?? entry.description,
  };
}

export function getEntry(slug: string, locale: Locale = DEFAULT_LOCALE): CatalogEntry | undefined {
  const entry = getAllEntries().find((e) => e.slug === slug);
  return entry && localizeEntry(entry, locale);
}

export interface FamilyGroup {
  family: Family;
  label: string;
  entries: CatalogEntry[];
}

export function getFamilyGroups(locale: Locale = DEFAULT_LOCALE): FamilyGroup[] {
  const all = getAllEntries().map((e) => localizeEntry(e, locale));
  return FAMILY_ORDER.map((family) => ({
    family,
    label: FAMILY_LABELS[family],
    entries: all.filter((e) => e.family === family),
  })).filter((g) => g.entries.length > 0);
}
