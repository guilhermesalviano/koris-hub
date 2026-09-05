'use client';

import { useEffect, useMemo, useState } from 'react';
import { RELEASES_URL } from '@/lib/constants';
import type { DownloadAsset, LatestDownloads, Platform, PlatformDownloads } from '@/lib/downloads';
import { detectPlatform } from '@/lib/platform';

type TabId = 'desktop' | 'source';

const TABS: { id: TabId; label: string }[] = [
  { id: 'desktop', label: 'Desktop app' },
  { id: 'source', label: 'From source' },
];

function formatSize(bytes: number): string {
  if (!bytes) return '';
  const mb = bytes / 1024 / 1024;
  return mb >= 1024 ? `${(mb / 1024).toFixed(1)} GB` : `${Math.round(mb)} MB`;
}

function archLabel(platform: Platform, arch: string | null): string | null {
  if (!arch) return null;
  const a = arch.toLowerCase();
  if (platform === 'mac') {
    if (a === 'arm64' || a === 'aarch64') return 'Apple Silicon';
    if (a === 'x64' || a === 'x86_64' || a === 'amd64' || a === 'intel') return 'Intel';
  }
  if (a === 'arm64' || a === 'aarch64') return 'ARM64';
  if (a === 'x64' || a === 'x86_64' || a === 'amd64') return '64-bit';
  if (a === 'universal') return 'Universal';
  return arch;
}

function extLabel(ext: string): string {
  return ext === 'AppImage' ? 'AppImage' : `.${ext}`;
}

function assetButtonLabel(platform: Platform, asset: DownloadAsset): string {
  const arch = archLabel(platform, asset.arch);
  return arch ? `${extLabel(asset.ext)} · ${arch}` : extLabel(asset.ext);
}

function platformNote(p: PlatformDownloads): string {
  const parts = new Set<string>();
  for (const a of p.assets) {
    const arch = archLabel(p.platform, a.arch);
    if (arch) parts.add(arch);
  }
  for (const a of p.assets) parts.add(extLabel(a.ext));
  return [...parts].join(' · ');
}

export function CopyButton({ text, className = '' }: { text: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard?.writeText(text).then(
          () => {
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          },
          () => {},
        );
      }}
      className={`rounded-md border border-border bg-bg px-2.5 py-1 text-xs font-semibold text-muted transition-colors hover:border-accent hover:text-accent ${className}`}
    >
      {copied ? 'Copied' : 'Copy'}
    </button>
  );
}

export function Download() {
  const [tab, setTab] = useState<TabId>('desktop');
  const [data, setData] = useState<LatestDownloads | null | undefined>(undefined);
  const [detected, setDetected] = useState<Platform | null>(null);

  useEffect(() => {
    setDetected(detectPlatform());
    let active = true;
    fetch('/api/downloads')
      .then((res) => (res.ok ? (res.json() as Promise<LatestDownloads | null>) : null))
      .then((d) => {
        if (active) setData(d);
      })
      .catch(() => {
        if (active) setData(null);
      });
    return () => {
      active = false;
    };
  }, []);

  const loading = data === undefined;

  const platforms = useMemo(() => {
    if (!data) return [];
    return [...data.platforms].sort((a, b) => {
      if (a.platform === detected) return -1;
      if (b.platform === detected) return 1;
      return 0;
    });
  }, [data, detected]);

  const sourceSnippet = useMemo(() => {
    const run = 'pnpm install\npnpm build && pnpm app        # dashboard on http://localhost:3000';
    if (!data) {
      return `# Grab the latest source from:\n# ${RELEASES_URL}\n\n${run}`;
    }
    return `# Latest release — v${data.version}\n${data.source.curl}\n\n${run}`;
  }, [data]);

  return (
    <section id="how-it-works" className="mt-24 scroll-mt-20">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-12">
        <div className="lg:w-72 lg:flex-shrink-0">
          <h2 className="text-3xl font-bold tracking-tight text-txt sm:text-4xl">Get Koris running</h2>
          <p className="mt-3 text-muted">
            Install the desktop app, or build it from source. Either way, the first launch drops you
            into a browser setup wizard &mdash; no manual config editing.
          </p>
        </div>

        <div className="min-w-0 flex-1 flex-col">
          <div className="inline-flex rounded-lg border border-border bg-bg-subtle p-1">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                aria-pressed={tab === t.id}
                className={`rounded-md px-4 py-1.5 text-sm font-semibold transition-colors ${
                  tab === t.id ? 'bg-accent text-bg' : 'text-muted hover:text-txt'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {tab === 'desktop' ? (
            <div className="mt-6">
              <p className="text-sm leading-relaxed text-muted">
                A self-contained build &mdash; agent, dashboard, and channels in one installer.{' '}
                {data && (
                  <>
                    Latest release{' '}
                    <a
                      href={data.url}
                      target="_blank"
                      rel="noopener"
                      className="font-semibold text-txt transition-colors hover:text-accent"
                    >
                      v{data.version}
                    </a>
                    {data.date && ` · ${data.date}`}.
                  </>
                )}
              </p>

              {loading ? (
                <ul className="mt-5 divide-y divide-border overflow-hidden rounded-xl border border-border bg-card">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <li key={i} className="h-[76px] animate-pulse p-5" />
                  ))}
                </ul>
              ) : !data || platforms.length === 0 ? (
                <a
                  href={RELEASES_URL}
                  target="_blank"
                  rel="noopener"
                  className="mt-5 inline-flex rounded-md bg-accent px-4 py-2 text-xs font-semibold text-bg transition-colors hover:brightness-110"
                >
                  Download from GitHub
                </a>
              ) : (
                <ul className="mt-5 divide-y divide-border overflow-hidden rounded-xl border border-border bg-card">
                  {platforms.map((p) => (
                    <li
                      key={p.platform}
                      className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <p className="flex items-center gap-2 font-semibold text-txt">
                          {p.label}
                          {p.platform === detected && (
                            <span className="rounded-full border border-accent px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-accent">
                              Your OS
                            </span>
                          )}
                        </p>
                        <p className="mt-0.5 font-mono text-xs text-muted">{platformNote(p)}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {p.assets.map((asset, i) => (
                          <a
                            key={asset.url}
                            href={asset.url}
                            title={asset.size ? `${asset.name} · ${formatSize(asset.size)}` : asset.name}
                            className={`rounded-md px-4 py-2 text-xs font-semibold transition-colors ${
                              i === 0
                                ? 'bg-accent text-bg hover:brightness-110'
                                : 'border border-border bg-bg text-txt hover:border-accent'
                            }`}
                          >
                            {assetButtonLabel(p.platform, asset)}
                          </a>
                        ))}
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              <p className="mt-4 text-xs leading-relaxed text-muted">
                Links point straight at the{' '}
                <a
                  href={RELEASES_URL}
                  target="_blank"
                  rel="noopener"
                  className="font-semibold text-muted underline decoration-border underline-offset-2 transition-colors hover:text-accent"
                >
                  latest GitHub release
                </a>{' '}
                assets &mdash; the version is resolved automatically.
              </p>
            </div>
          ) : (
            <div className="mt-6">
              <p className="text-sm leading-relaxed text-muted">
                Pull the latest tagged release with <code className="font-mono text-accent">curl</code> and
                build it. Needs Node 24+ and pnpm.
              </p>

              <div className="mt-5 overflow-hidden rounded-xl border border-border bg-card">
                <div className="flex items-center justify-between border-b border-border px-4 py-2">
                  <span className="font-mono text-[11px] uppercase tracking-wide text-muted">
                    {data ? `source · ${data.source.tag}` : 'source'}
                  </span>
                  <CopyButton text={sourceSnippet} />
                </div>
                <pre className="overflow-x-auto px-5 py-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
                  <code>{sourceSnippet}</code>
                </pre>
              </div>

              {data && (
                <p className="mt-4 text-xs leading-relaxed text-muted">
                  Prefer an archive? Grab the{' '}
                  <a
                    href={data.source.tarballUrl}
                    className="font-semibold text-muted underline decoration-border underline-offset-2 transition-colors hover:text-accent"
                  >
                    .tar.gz
                  </a>{' '}
                  or{' '}
                  <a
                    href={data.source.zipUrl}
                    className="font-semibold text-muted underline decoration-border underline-offset-2 transition-colors hover:text-accent"
                  >
                    .zip
                  </a>{' '}
                  for <code className="font-mono text-accent">{data.source.tag}</code>.
                </p>
              )}

              <p className="mt-3 text-xs leading-relaxed text-muted">
                No <code className="font-mono text-accent">koris.json</code> yet? You land in the setup
                wizard automatically &mdash; finish it (AI provider, Telegram/WhatsApp, personal info) and
                your assistant is live.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
