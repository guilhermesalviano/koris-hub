import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Markdown } from '@/components/Markdown';
import { ParamTable } from '@/components/ParamTable';
import { JsonLd } from '@/components/JsonLd';
import { HUB_REPO_URL, SITE_URL } from '@/lib/constants';
import { getEntry } from '@/lib/marketplace';
import { FAMILY_DIRS, FAMILY_LABELS } from '@content/marketplace/schema';
import { getDictionary, type Locale } from '@/i18n';
import { HTML_LANG, localePath } from '@/i18n/locales';

export function MarketplaceEntryView({ locale, slug }: { locale: Locale; slug: string }) {
  const entry = getEntry(slug, locale);
  if (!entry) notFound();
  const dict = getDictionary(locale);

  const editUrl = `${HUB_REPO_URL}/blob/main/content/marketplace/${FAMILY_DIRS[entry.family]}/${entry.slug}.json`;

  const path = localePath(locale, `/marketplace/${entry.slug}/`);

  return (
    <main className="mx-auto max-w-3xl px-6 py-12 sm:py-16">
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'SoftwareSourceCode',
          name: entry.name,
          alternateName: entry.toolName,
          description: entry.summary,
          url: `${SITE_URL}${path}`,
          codeRepository: entry.sourceUrl,
          programmingLanguage: entry.family === 'skill' ? 'Markdown' : 'TypeScript',
          keywords: entry.tags.join(', '),
          isPartOf: { '@id': `${SITE_URL}/#software` },
          inLanguage: HTML_LANG[locale],
        }}
      />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Koris', item: `${SITE_URL}${localePath(locale, '/')}` },
            { '@type': 'ListItem', position: 2, name: 'Marketplace', item: `${SITE_URL}${localePath(locale, '/marketplace/')}` },
            { '@type': 'ListItem', position: 3, name: entry.name, item: `${SITE_URL}${path}` },
          ],
        }}
      />

      <Link href={localePath(locale, "/marketplace/")} className="text-sm text-muted transition-colors hover:text-txt">
        &larr; {dict.marketplace.backToMarketplace}
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
              {dict.marketplace.confirmationRequired}
            </span>
          )}
          {entry.defaultEnabled === false && (
            <span className="rounded-md bg-bg-subtle px-2 py-0.5 text-xs text-muted">
              {dict.marketplace.offByDefault}
            </span>
          )}
        </div>

        <h1 className="text-4xl font-bold tracking-tight text-txt">{entry.name}</h1>
        <p className="mt-3 text-lg text-muted">{entry.summary}</p>

        {entry.toolName && (
          <p className="mt-4 font-mono text-sm text-muted">
            {dict.marketplace.toolName} <span className="text-accent">{entry.toolName}</span>
          </p>
        )}
      </header>

      <Markdown>{entry.description}</Markdown>

      {entry.params && (
        <section className="mt-10">
          <h2 className="mb-4 text-2xl font-bold tracking-tight text-txt">{dict.marketplace.parameters}</h2>
          <ParamTable params={entry.params} dict={dict} />
        </section>
      )}

      {entry.readWhen && entry.readWhen.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-4 text-2xl font-bold tracking-tight text-txt">{dict.marketplace.readWhen}</h2>
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
          {dict.marketplace.viewSource} &rarr;
        </a>
        <a
          href={editUrl}
          target="_blank"
          rel="noopener"
          className="font-semibold text-muted transition-colors hover:text-accent"
        >
          {dict.marketplace.improveEntry} &rarr;
        </a>
      </div>
    </main>
  );
}
