'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { DocNode } from '@/lib/docs';
import type { Dictionary } from '@/i18n';
import { localePath, type Locale } from '@/i18n/locales';

function href(locale: Locale, slug: string[]): string {
  return localePath(locale, slug.length === 0 ? '/docs/' : `/docs/${slug.join('/')}/`);
}

function NodeList({
  nodes,
  pathname,
  locale,
}: {
  nodes: DocNode[];
  pathname: string;
  locale: Locale;
}) {
  return (
    <ul className="space-y-1">
      {nodes.map((node) => {
        const link = href(locale, node.slug);
        const active = pathname === link || pathname === `${link}/`;
        return (
          <li key={link}>
            <Link
              href={link}
              className={`block rounded-md px-2 py-1 text-sm transition-colors ${
                active ? 'bg-bg-subtle text-txt' : 'text-muted hover:text-txt'
              }`}
            >
              {node.title}
            </Link>
            {node.children.length > 0 && (
              <div className="ml-3 mt-1 border-l border-border pl-2">
                <NodeList nodes={node.children} pathname={pathname} locale={locale} />
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}

export function DocsSidebar({
  tree,
  locale,
  dict,
}: {
  tree: DocNode[];
  locale: Locale;
  dict: Dictionary;
}) {
  const pathname = usePathname();
  const docsRoot = localePath(locale, '/docs/');
  const rootActive = pathname === docsRoot || `${pathname}/` === docsRoot;

  return (
    <nav className="sm:sticky sm:top-20 sm:self-start">
      <Link
        href={docsRoot}
        className={`mb-2 block rounded-md px-2 py-1 text-sm font-semibold transition-colors ${
          rootActive ? 'bg-bg-subtle text-txt' : 'text-muted hover:text-txt'
        }`}
      >
        {dict.docs.overview}
      </Link>
      <NodeList nodes={tree} pathname={pathname} locale={locale} />
    </nav>
  );
}
