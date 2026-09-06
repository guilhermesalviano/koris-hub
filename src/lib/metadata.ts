import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/constants';
import {
  DEFAULT_LOCALE,
  HTML_LANG,
  LOCALES,
  OG_LOCALE,
  localePath,
  type Locale,
} from '@/i18n/locales';

/**
 * hreflang map for one logical page: every locale's URL for it, plus
 * `x-default` pointing at the English version. Both trees expose the same route
 * set (see getAllDocSlugs), so this is always complete on both sides.
 */
export function languageAlternates(path: string): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const locale of LOCALES) {
    languages[HTML_LANG[locale]] = `${SITE_URL}${localePath(locale, path)}`;
  }
  languages['x-default'] = `${SITE_URL}${localePath(DEFAULT_LOCALE, path)}`;
  return languages;
}

/**
 * Canonical + hreflang + Open Graph for a page, given its locale-independent
 * path (e.g. '/docs/tools/'). The canonical is always self-referencing — the
 * pt-BR page points at itself, never at the English original.
 */
export function pageMetadata({
  locale,
  path,
  title,
  description,
  type = 'website',
}: {
  locale: Locale;
  path: string;
  title: string;
  description: string;
  type?: 'website' | 'article';
}): Metadata {
  const url = localePath(locale, path);

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: languageAlternates(path),
    },
    openGraph: {
      type,
      title,
      description,
      url,
      locale: OG_LOCALE[locale],
      alternateLocale: LOCALES.filter((l) => l !== locale).map((l) => OG_LOCALE[l]),
    },
    twitter: { card: 'summary', title, description },
  };
}
