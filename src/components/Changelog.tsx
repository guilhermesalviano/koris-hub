'use client';

import { useEffect, useState } from 'react';
import type { ChangelogEntry } from '@/lib/changelog';
import { REPO_URL } from '@/lib/constants';

export function Changelog() {
  const [entries, setEntries] = useState<ChangelogEntry[] | null>(null);

  useEffect(() => {
    let active = true;
    fetch('/api/changelog')
      .then((res) => (res.ok ? (res.json() as Promise<ChangelogEntry[]>) : []))
      .then((data) => {
        if (active) setEntries(data);
      })
      .catch(() => {
        if (active) setEntries([]);
      });
    return () => {
      active = false;
    };
  }, []);

  // Loaded, but nothing to show — drop the section entirely.
  if (entries !== null && entries.length === 0) return null;

  const loading = entries === null;

  return (
    <section id="changelog" className="mt-24 scroll-mt-20">
      <div className="mb-12 max-w-xl">
        <h2 className="text-3xl font-bold tracking-tight text-txt sm:text-4xl">Changelog</h2>
        <p className="mt-3 text-muted">Every release, straight from GitHub.</p>
      </div>

      <div className="-mx-6 flex snap-x snap-mandatory gap-6 overflow-x-auto px-6 pb-4">
        {loading
          ? Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-[104px] w-[260px] flex-shrink-0 animate-pulse rounded-xl border border-border bg-bg-subtle p-6"
              />
            ))
          : entries.map((entry) => (
              <div
                key={entry.version}
                className="flex w-[260px] flex-shrink-0 snap-start flex-col rounded-xl border border-border bg-bg-subtle p-6"
              >
                <div className="mb-3 flex items-baseline justify-between">
                  <span className="text-lg font-semibold text-txt">v{entry.version}</span>
                  {entry.date && <span className="text-xs text-muted">{entry.date}</span>}
                </div>
                <a
                  href={entry.url}
                  target="_blank"
                  rel="noopener"
                  className="mt-auto text-sm font-semibold text-muted transition-colors hover:text-accent"
                >
                  Release notes{' '}
                  <span aria-hidden className="text-accent">
                    &rarr;
                  </span>
                </a>
              </div>
            ))}

        <a
          href={`${REPO_URL}/releases`}
          target="_blank"
          rel="noopener"
          className="flex w-[200px] flex-shrink-0 snap-start flex-col items-start justify-center gap-2 rounded-xl border border-dashed border-border p-6 text-sm font-semibold text-txt transition-colors hover:border-accent"
        >
          View full changelog
          <span aria-hidden className="text-accent">
            &rarr;
          </span>
        </a>
      </div>
    </section>
  );
}
