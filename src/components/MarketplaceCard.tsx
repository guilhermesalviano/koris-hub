import Link from 'next/link';
import type { CatalogEntry } from '@content/marketplace/schema';
import type { Dictionary } from '@/i18n';
import { localePath, type Locale } from '@/i18n/locales';

export function MarketplaceCard({
  entry,
  locale,
  dict,
}: {
  entry: CatalogEntry;
  locale: Locale;
  dict: Dictionary;
}) {
  return (
    <Link
      href={localePath(locale, `/marketplace/${entry.slug}/`)}
      className="flex flex-col rounded-xl border border-border bg-bg-subtle p-6 transition-colors hover:border-accent"
    >
      <div className="mb-2 flex items-center gap-2">
        <h3 className="text-lg font-semibold text-txt">{entry.name}</h3>
        {entry.type && (
          <span className="rounded-md bg-bg px-2 py-0.5 text-xs text-muted">{entry.type}</span>
        )}
      </div>

      <p className="flex-1 text-sm text-muted">{entry.summary}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {entry.requiresConfirmation && (
          <span className="rounded-md bg-accent-muted px-2 py-0.5 text-xs font-semibold text-accent">
            {dict.marketplace.confirmationRequired}
          </span>
        )}
        {entry.defaultEnabled === false && (
          <span className="rounded-md bg-bg px-2 py-0.5 text-xs text-muted">{dict.marketplace.offByDefault}</span>
        )}
        {entry.tags.slice(0, 3).map((tag) => (
          <span key={tag} className="rounded-md bg-bg px-2 py-0.5 text-xs text-muted">
            {tag}
          </span>
        ))}
      </div>
    </Link>
  );
}
