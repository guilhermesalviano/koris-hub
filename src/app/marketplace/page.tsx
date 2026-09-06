import type { Metadata } from 'next';
import { MarketplaceCard } from '@/components/MarketplaceCard';
import { JsonLd } from '@/components/JsonLd';
import { SITE_URL } from '@/lib/constants';
import { getAllEntries, getFamilyGroups } from '@/lib/marketplace';

const DESCRIPTION =
  'Every tool, channel, and skill that ships with Koris — what each one does, the parameters it takes, and a link to its source.';

export const metadata: Metadata = {
  title: 'Marketplace',
  description: DESCRIPTION,
  alternates: { canonical: '/marketplace/' },
  openGraph: {
    type: 'website',
    title: 'Marketplace · Koris',
    description: DESCRIPTION,
    url: '/marketplace/',
  },
};

export default function MarketplacePage() {
  const groups = getFamilyGroups();

  return (
    <main className="mx-auto max-w-5xl px-6 py-12 sm:py-16">
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: 'Koris marketplace',
          description: DESCRIPTION,
          url: `${SITE_URL}/marketplace/`,
          numberOfItems: getAllEntries().length,
          itemListElement: getAllEntries().map((entry, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: entry.name,
            description: entry.summary,
            url: `${SITE_URL}/marketplace/${entry.slug}/`,
          })),
        }}
      />

      <div className="mb-12 max-w-xl">
        <h1 className="text-4xl font-bold tracking-tight text-txt sm:text-5xl">Marketplace</h1>
        <p className="mt-3 text-muted">
          The tools, channels, and skills bundled with Koris today. Each one lives in the{' '}
          <a
            href="https://github.com/guilhermesalviano/koris"
            target="_blank"
            rel="noopener"
            className="text-accent hover:underline"
          >
            koris
          </a>{' '}
          repo — this is a browsable index, not an installer.
        </p>
      </div>

      <div className="space-y-16">
        {groups.map((group) => (
          <section key={group.family}>
            <div className="mb-6 flex items-baseline gap-3">
              <h2 className="text-2xl font-bold tracking-tight text-txt">{group.label}</h2>
              <span className="text-sm text-muted">{group.entries.length}</span>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {group.entries.map((entry) => (
                <MarketplaceCard key={entry.slug} entry={entry} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
