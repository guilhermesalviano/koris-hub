'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { DocNode } from '@/lib/docs';

function href(slug: string[]): string {
  return slug.length === 0 ? '/docs' : `/docs/${slug.join('/')}`;
}

function NodeList({ nodes, pathname }: { nodes: DocNode[]; pathname: string }) {
  return (
    <ul className="space-y-1">
      {nodes.map((node) => {
        const link = href(node.slug);
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
                <NodeList nodes={node.children} pathname={pathname} />
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}

export function DocsSidebar({ tree }: { tree: DocNode[] }) {
  const pathname = usePathname();
  const rootActive = pathname === '/docs' || pathname === '/docs/';

  return (
    <nav className="sm:sticky sm:top-20 sm:self-start">
      <Link
        href="/docs"
        className={`mb-2 block rounded-md px-2 py-1 text-sm font-semibold transition-colors ${
          rootActive ? 'bg-bg-subtle text-txt' : 'text-muted hover:text-txt'
        }`}
      >
        Hello World
      </Link>
      <NodeList nodes={tree} pathname={pathname} />
    </nav>
  );
}
