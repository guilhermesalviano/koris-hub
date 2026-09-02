import { readdirSync, readFileSync, statSync } from 'fs';
import { join } from 'path';
import matter from 'gray-matter';

const DOCS_DIR = join(process.cwd(), 'content/docs');

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

export function getDocsTree(): DocNode[] {
  return walk(DOCS_DIR, []);
}

export function getDoc(slug: string[]): Doc | undefined {
  const candidates =
    slug.length === 0
      ? [join(DOCS_DIR, 'index.md')]
      : [join(DOCS_DIR, ...slug) + '.md', join(DOCS_DIR, ...slug, 'index.md')];

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

function flatten(nodes: DocNode[]): string[][] {
  return nodes.flatMap((n) => [n.slug, ...flatten(n.children)]);
}

export function getAllDocSlugs(): string[][] {
  return flatten(getDocsTree()).filter((slug) => slug.length > 0);
}
