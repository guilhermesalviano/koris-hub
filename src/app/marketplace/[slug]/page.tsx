import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Markdown } from '@/components/Markdown';
import { ParamTable } from '@/components/ParamTable';
import { HUB_REPO_URL } from '@/lib/constants';
import { getAllEntries, getEntry } from '@/lib/marketplace';
import { FAMILY_LABELS } from '@content/marketplace/schema';

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllEntries().map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const entry = getEntry(slug);
  if (!entry) return {};
  return {
    title: `${entry.name} · Koris Marketplace`,
    description: entry.summary,
  };
}

export default async function MarketplaceEntryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = getEntry(slug);
  if (!entry) notFound();

  const editUrl = `${HUB_REPO_URL}/blob/main/content/marketplace/${entry.slug}.json`;

  return (
    <main className="mx-auto max-w-3xl px-6 py-12 sm:py-16">
      <Link href="/marketplace" className="text-sm text-muted transition-colors hover:text-txt">
        &larr; Marketplace
      </Link>

      <header className="mt-6 mb-10">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="rounded-md bg-bg-subtle px-2 py-0.5 text-xs text-muted">
            {FAMILY_LABELS[entry.family]}
          </span>
          {entry.type && (
            <span className="rounded-md bg-bg-subtle px-2 py-0.5 text-xs text-muted">
              {entry.type}
            </span>
          )}
          {entry.requiresConfirmation && (
            <span className="rounded-md bg-accent-muted px-2 py-0.5 text-xs font-semibold text-accent">
              confirmation required
            </span>
          )}
          {entry.defaultEnabled === false && (
            <span className="rounded-md bg-bg-subtle px-2 py-0.5 text-xs text-muted">
              off by default
            </span>
          )}
        </div>

        <h1 className="text-4xl font-bold tracking-tight text-txt">{entry.name}</h1>
        <p className="mt-3 text-lg text-muted">{entry.summary}</p>

        {entry.toolName && (
          <p className="mt-4 font-mono text-sm text-muted">
            tool name: <span className="text-accent">{entry.toolName}</span>
          </p>
        )}
      </header>

      <Markdown>{entry.description}</Markdown>

      {entry.params && (
        <section className="mt-10">
          <h2 className="mb-4 text-2xl font-bold tracking-tight text-txt">Parameters</h2>
          <ParamTable params={entry.params} />
        </section>
      )}

      {entry.readWhen && entry.readWhen.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-4 text-2xl font-bold tracking-tight text-txt">Read when</h2>
          <ul className="list-disc space-y-1 pl-5 text-sm text-muted">
            {entry.readWhen.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </section>
      )}

      <div className="mt-12 flex flex-wrap gap-4 border-t border-border pt-6 text-sm">
        <a
          href={entry.sourceUrl}
          target="_blank"
          rel="noopener"
          className="font-semibold text-txt transition-colors hover:text-accent"
        >
          View source &rarr;
        </a>
        <a
          href={editUrl}
          target="_blank"
          rel="noopener"
          className="font-semibold text-muted transition-colors hover:text-accent"
        >
          Improve this entry &rarr;
        </a>
      </div>
    </main>
  );
}
