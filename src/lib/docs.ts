import { readdirSync, readFileSync, statSync } from 'fs';
import { join } from 'path';
import matter from 'gray-matter';
import { DEFAULT_LOCALE, type Locale } from '@/i18n/locales';

const DOCS_DIR = join(process.cwd(), 'content/docs');

/**
 * Translations mirror the English tree under content/<locale>/docs/. The route
 * set is always driven by the English tree (see getAllDocSlugs), so a page
 * without a translation renders English rather than 404ing — and hreflang stays
 * symmetric between locales.
 */
function docsDir(locale: Locale): string {
  return locale === DEFAULT_LOCALE ? DOCS_DIR : join(process.cwd(), 'content', locale, 'docs');
}

export interface DocMeta {
  title: string;
  order: number;
  slug: string[];
}

export interface DocNode extends DocMeta {
  children: DocNode[];
}

export interface Doc {
  meta: DocMeta;
  content: string;
}

function readMeta(file: string, slug: string[]): DocMeta {
  const { data } = matter(readFileSync(file, 'utf-8'));
  return {
    title: typeof data.title === 'string' ? data.title : slug[slug.length - 1] ?? 'Docs',
    order: typeof data.order === 'number' ? data.order : 999,
    slug,
  };
}

function walk(dir: string, parentSlug: string[]): DocNode[] {
  const nodes: DocNode[] = [];

  for (const name of readdirSync(dir)) {
    const full = join(dir, name);

    if (statSync(full).isDirectory()) {
      const slug = [...parentSlug, name];
      const indexFile = join(full, 'index.md');
      let meta: DocMeta;
      try {
        meta = readMeta(indexFile, slug);
      } catch {
        meta = { title: name, order: 999, slug };
      }
      nodes.push({ ...meta, children: walk(full, slug) });
      continue;
    }

    if (!name.endsWith('.md') || name === 'index.md') continue;
    const slug = [...parentSlug, name.replace(/\.md$/, '')];
    nodes.push({ ...readMeta(full, slug), children: [] });
  }

  return nodes.sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));
}

/**
 * Sidebar tree. Titles come from the requested locale when translated, but the
 * shape (which pages exist, in what order) always follows the English tree.
 */
export function getDocsTree(locale: Locale = DEFAULT_LOCALE): DocNode[] {
  const tree = walk(DOCS_DIR, []);
  if (locale === DEFAULT_LOCALE) return tree;

  const localize = (nodes: DocNode[]): DocNode[] =>
    nodes.map((node) => ({
      ...node,
      title: getDoc(node.slug, locale)?.meta.title ?? node.title,
      children: localize(node.children),
    }));

  return localize(tree);
}

export function getDoc(slug: string[], locale: Locale = DEFAULT_LOCALE): Doc | undefined {
  const dirs = locale === DEFAULT_LOCALE ? [DOCS_DIR] : [docsDir(locale), DOCS_DIR];
  const candidates = dirs.flatMap((dir) =>
    slug.length === 0
      ? [join(dir, 'index.md')]
      : [join(dir, ...slug) + '.md', join(dir, ...slug, 'index.md')],
  );

  for (const file of candidates) {
    try {
      const { data, content } = matter(readFileSync(file, 'utf-8'));
      return {
        meta: {
          title: typeof data.title === 'string' ? data.title : slug[slug.length - 1] ?? 'Docs',
          order: typeof data.order === 'number' ? data.order : 999,
          slug,
        },
        content,
      };
    } catch {
      // try next candidate
    }
  }
  return undefined;
}

/**
 * First real paragraph of a doc body, flattened to a meta-description-sized
 * plain string. Docs carry no `description` front-matter, so without this every
 * page ships with only the site-wide fallback — which reads identically on all
 * of them and tells a crawler (or an AI answer engine) nothing about the page.
 */
export function summarize(content: string, maxLength = 160): string {
  const paragraph = content
    .replace(/```[\s\S]*?```/g, '') // fenced code
    .replace(/^#{1,6} .*$/gm, '') // headings
    .replace(/^\s*[|>-].*$/gm, '') // tables, quotes, list items
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .find((block) => block.length > 0);

  if (!paragraph) return '';

  const text = paragraph
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1') // links → their text
    .replace(/[*_`]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (text.length <= maxLength) return text;
  // Cut on a word boundary so the description doesn't end mid-word.
  return `${text.slice(0, text.lastIndexOf(' ', maxLength) || maxLength).trimEnd()}…`;
}

function flatten(nodes: DocNode[]): string[][] {
  return nodes.flatMap((n) => [n.slug, ...flatten(n.children)]);
}

export function getAllDocSlugs(): string[][] {
  return flatten(getDocsTree()).filter((slug) => slug.length > 0);
}
