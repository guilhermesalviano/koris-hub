'use client';

import { useState } from 'react';
import { RELEASES_URL } from '@/lib/constants';

type TabId = 'desktop' | 'source';

const TABS: { id: TabId; label: string }[] = [
  { id: 'desktop', label: 'Desktop app' },
  { id: 'source', label: 'From source' },
];

const DESKTOP_TARGETS = [
  {
    os: 'macOS',
    note: 'macOS 11+ · Apple Silicon',
    downloads: [
      { label: 'Download .dmg', file: 'koris-<version>-mac-arm64.dmg', primary: true },
    ],
  },
  {
    os: 'Windows',
    note: 'Windows 10 / 11 · x64',
    downloads: [
      { label: 'Download .exe', file: 'koris-<version>-win-x64.exe', primary: true },
    ],
  },
  {
    os: 'Linux',
    note: 'x64 · AppImage or Debian package',
    downloads: [
      { label: '.AppImage', file: 'koris-<version>-linux-x86_64.AppImage', primary: true },
      { label: '.deb', file: 'koris-<version>-linux-amd64.deb', primary: false },
    ],
  },
];

const SOURCE_SNIPPET = `# Grab the latest source zip from:
# ${RELEASES_URL}

unzip koris-<version>.zip
cd koris-<version>

pnpm install
pnpm build && pnpm app        # dashboard on http://localhost:3000`;

export function HowItWorks() {
  const [tab, setTab] = useState<TabId>('desktop');

  return (
    <section id="how-it-works" className="mt-24 scroll-mt-20">
      <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-accent">Get started</p>
      <div className="mb-8 max-w-xl">
        <h2 className="text-3xl font-bold tracking-tight text-txt sm:text-4xl">Get Koris running</h2>
        <p className="mt-3 text-muted">
          Install the desktop app, or run it from source. Either way, the first launch drops you into
          a browser setup wizard &mdash; no manual config editing.
        </p>
      </div>

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
          <p className="max-w-2xl text-sm leading-relaxed text-muted">
            A self-contained build &mdash; agent, dashboard, and channels in one installer. Download
            it for your platform and run it.
          </p>

          <ul className="mt-5 divide-y divide-border overflow-hidden rounded-xl border border-border bg-card">
            {DESKTOP_TARGETS.map((target) => (
              <li
                key={target.os}
                className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-semibold text-txt">{target.os}</p>
                  <p className="mt-0.5 font-mono text-xs text-muted">{target.note}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {target.downloads.map((dl) => (
                    <a
                      key={dl.file}
                      href={RELEASES_URL}
                      target="_blank"
                      rel="noopener"
                      title={dl.file}
                      className={`rounded-md px-4 py-2 text-xs font-semibold transition-colors ${
                        dl.primary
                          ? 'bg-accent text-bg hover:brightness-110'
                          : 'border border-border bg-bg text-txt hover:border-accent'
                      }`}
                    >
                      {dl.label}
                    </a>
                  ))}
                </div>
              </li>
            ))}
          </ul>

          <p className="mt-4 text-xs leading-relaxed text-muted">
            Downloads open the{' '}
            <a
              href={RELEASES_URL}
              target="_blank"
              rel="noopener"
              className="font-semibold text-muted underline decoration-border underline-offset-2 transition-colors hover:text-accent"
            >
              latest GitHub release
            </a>
            . Filenames carry the version &mdash; grab the asset that matches the label.
          </p>
        </div>
      ) : (
        <div className="mt-6">
          <p className="max-w-2xl text-sm leading-relaxed text-muted">
            For hacking on Koris itself. Needs Node 24+ and pnpm.
          </p>

          <pre className="mt-5 overflow-x-auto rounded-xl border border-border bg-card px-5 py-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
            <code>{SOURCE_SNIPPET}</code>
          </pre>

          <p className="mt-4 text-xs leading-relaxed text-muted">
            No <code className="font-mono text-accent">koris.json</code> yet? You land in the setup
            wizard automatically &mdash; finish it (AI provider, Telegram/WhatsApp, personal info) and
            your assistant is live.
          </p>

          <a
            href={RELEASES_URL}
            target="_blank"
            rel="noopener"
            className="mt-3 inline-block text-xs font-semibold text-muted transition-colors hover:text-accent"
          >
            View releases &rarr;
          </a>
        </div>
      )}
    </section>
  );
}
