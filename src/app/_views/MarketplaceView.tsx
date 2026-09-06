import { MarketplaceCard } from '@/components/MarketplaceCard';
import { JsonLd } from '@/components/JsonLd';
import { REPO_URL, SITE_URL } from '@/lib/constants';
import { getAllEntries, getFamilyGroups } from '@/lib/marketplace';
import { getDictionary, type Locale } from '@/i18n';
import { HTML_LANG, localePath } from '@/i18n/locales';

export function MarketplaceView({ locale }: { locale: Locale }) {
  const groups = getFamilyGroups(locale);
  const dict = getDictionary(locale);
  const entries = getAllEntries();

  return (
    <main className="mx-auto max-w-5xl px-6 py-12 sm:py-16">
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: 'Koris marketplace',
          description: dict.meta.marketplaceDescription,
          url: `${SITE_URL}${localePath(locale, '/marketplace/')}`,
          inLanguage: HTML_LANG[locale],
          numberOfItems: entries.length,
          itemListElement: entries.map((entry, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: entry.name,
            description: entry.summary,
            url: `${SITE_URL}${localePath(locale, `/marketplace/${entry.slug}/`)}`,
          })),
        }}
      />

      <div className="mb-12 max-w-xl">
        <h1 className="text-4xl font-bold tracking-tight text-txt sm:text-5xl">
          {dict.meta.marketplaceTitle}
        </h1>
        <p className="mt-3 text-muted">
          {dict.meta.marketplaceIntroLead}{' '}
          <a href={REPO_URL} target="_blank" rel="noopener" className="text-accent hover:underline">
            koris
          </a>{' '}
          {dict.meta.marketplaceIntroTail}
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
                <MarketplaceCard key={entry.slug} entry={entry} locale={locale} dict={dict} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
