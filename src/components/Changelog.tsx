'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import type { ChangelogEntry } from '@/lib/changelog';
import { REPO_URL } from '@/lib/constants';
import type { Dictionary } from '@/i18n';

export function Changelog({ dict }: { dict: Dictionary }) {
  const [entries, setEntries] = useState<ChangelogEntry[] | null>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

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

  const updateScrollButtons = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 8);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
  }, []);

  useEffect(() => {
    updateScrollButtons();
    window.addEventListener('resize', updateScrollButtons);
    return () => window.removeEventListener('resize', updateScrollButtons);
  }, [entries, updateScrollButtons]);

  const handleScroll = (direction: 'left' | 'right') => {
    const el = scrollerRef.current;
    if (!el) return;
    const scrollAmount = Math.min(el.clientWidth * 0.8, 340);
    el.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  // Loaded, but nothing to show — drop the section entirely.
  if (entries !== null && entries.length === 0) return null;

  const loading = entries === null;

  return (
    <section id="changelog" className="mt-24 scroll-mt-20">
      {/* Header with Title and Scroll Navigation Controls */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-bg-subtle/80 px-3 py-1 text-xs font-mono font-medium text-accent mb-3">
            {dict.changelog.tag}
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-txt sm:text-4xl">
            {dict.changelog.title}
          </h2>
          <p className="mt-2 text-muted text-sm sm:text-base">
            {dict.changelog.subtitle}
          </p>
        </div>

        {/* Scroll Controls (Desktop & Mobile accessible) */}
        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
          <button
            type="button"
            onClick={() => handleScroll('left')}
            disabled={!canScrollLeft}
            aria-label="Scroll left"
            className="flex size-9 items-center justify-center rounded-full border border-border/80 bg-bg-subtle text-muted transition-all hover:border-accent hover:text-txt disabled:opacity-30 disabled:pointer-events-none active:scale-95"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-4"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => handleScroll('right')}
            disabled={!canScrollRight}
            aria-label="Scroll right"
            className="flex size-9 items-center justify-center rounded-full border border-border/80 bg-bg-subtle text-muted transition-all hover:border-accent hover:text-txt disabled:opacity-30 disabled:pointer-events-none active:scale-95"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-4"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>

      {/* Horizontal Carousel Container */}
      <div className="relative">
        {/* Subtle edge indicators when content overflows */}
        {canScrollLeft && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-6 top-0 bottom-6 z-10 w-12 bg-gradient-to-r from-bg to-transparent"
          />
        )}
        {canScrollRight && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-6 top-0 bottom-6 z-10 w-12 bg-gradient-to-l from-bg to-transparent"
          />
        )}

        <div
          ref={scrollerRef}
          onScroll={updateScrollButtons}
          className="-mx-6 flex gap-5 overflow-x-auto px-6 pb-6 pt-2 scroll-smooth snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {loading
            ? Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="h-[180px] w-[280px] sm:w-[320px] flex-shrink-0 animate-pulse rounded-2xl border border-border/80 bg-card p-6 flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between">
                    <div className="h-5 w-20 rounded bg-bg-subtle" />
                    <div className="h-4 w-16 rounded bg-bg-subtle" />
                  </div>
                  <div className="h-10 w-full rounded-lg bg-bg-subtle/60" />
                  <div className="h-4 w-28 rounded bg-bg-subtle" />
                </div>
              ))
            : entries.map((entry, idx) => {
                const isLatest = idx === 0;
                return (
                  <a
                    key={entry.version}
                    href={entry.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative flex w-[280px] sm:w-[320px] flex-shrink-0 snap-start flex-col justify-between rounded-2xl border border-border/80 bg-card p-6 transition-all duration-300 hover:border-accent/50 hover:shadow-xl hover:shadow-accent/5 hover:-translate-y-1"
                  >
                    {/* Top Row: Version and Date/Latest Badge */}
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="flex size-7 items-center justify-center rounded-lg border border-accent/20 bg-accent/10 text-accent">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="size-3.5"
                            >
                              <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z" />
                              <path d="M7 7h.01" />
                            </svg>
                          </span>
                          <span className="font-mono text-base sm:text-lg font-bold text-txt">
                            v{entry.version}
                          </span>
                        </div>

                        {isLatest ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-400 font-mono">
                            <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            {dict.changelog.latest}
                          </span>
                        ) : (
                          entry.date && (
                            <span className="text-xs font-mono text-muted">
                              {entry.date}
                            </span>
                          )
                        )}
                      </div>

                      {/* Middle: Release Badge & Details */}
                      <div className="mt-4 rounded-xl border border-border/50 bg-bg-subtle/50 p-3 text-xs text-muted leading-relaxed">
                        <div className="flex items-center justify-between text-[11px] mb-1 font-mono">
                          <span className="text-txt/90 font-medium">{dict.changelog.stableBadge}</span>
                          {isLatest && entry.date && <span>{entry.date}</span>}
                        </div>
                        <span className="text-muted/90">
                          Production release with verified package artifacts and source code on GitHub.
                        </span>
                      </div>
                    </div>

                    {/* Bottom: Action Row with circular arrow button */}
                    <div className="mt-5 flex items-center justify-between border-t border-border/40 pt-4">
                      <span className="text-xs font-semibold text-muted group-hover:text-txt transition-colors">
                        {dict.changelog.releaseNotes}
                      </span>
                      <span className="flex size-8 items-center justify-center rounded-full bg-bg-subtle text-muted group-hover:bg-accent group-hover:text-bg transition-all duration-200">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="size-4"
                        >
                          <path d="M5 12h14" />
                          <path d="m12 5 7 7-7 7" />
                        </svg>
                      </span>
                    </div>
                  </a>
                );
              })}

          {/* "View All Releases" Card */}
          <a
            href={`${REPO_URL}/releases`}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex w-[240px] sm:w-[280px] flex-shrink-0 snap-start flex-col justify-between rounded-2xl border border-dashed border-border/80 bg-card/40 p-6 transition-all duration-300 hover:border-accent/50 hover:bg-card hover:shadow-xl hover:shadow-accent/5 hover:-translate-y-1"
          >
            <div>
              <div className="flex size-9 items-center justify-center rounded-xl border border-border/80 bg-bg-subtle text-muted transition-colors group-hover:border-accent/40 group-hover:text-accent">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="size-4"
                >
                  <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
                  <path d="M18 14h-8" />
                  <path d="M15 18h-5" />
                  <path d="M10 6h8v4h-8V6Z" />
                </svg>
              </div>

              <h3 className="mt-4 text-base font-bold text-txt group-hover:text-accent transition-colors">
                {dict.changelog.viewFull}
              </h3>
              <p className="mt-2 text-xs text-muted leading-relaxed">
                {dict.changelog.allReleasesDesc}
              </p>
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-border/40 pt-4">
              <span className="text-xs font-semibold text-muted group-hover:text-txt transition-colors">
                GitHub Releases
              </span>
              <span className="flex size-8 items-center justify-center rounded-full bg-bg-subtle text-muted group-hover:bg-accent group-hover:text-bg transition-all duration-200">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="size-4"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </span>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}
