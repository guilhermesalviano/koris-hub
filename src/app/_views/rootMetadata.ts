import type { Metadata } from 'next';
import { REPO_URL, SITE_URL } from '@/lib/constants';
import { getDictionary } from '@/i18n';
import { LOCALES, OG_LOCALE, localePath, type Locale } from '@/i18n/locales';
import { languageAlternates } from '@/lib/metadata';

/** Site-wide defaults for one locale's root layout. */
export function rootMetadata(locale: Locale): Metadata {
  const dict = getDictionary(locale);
  const home = localePath(locale, '/');

  return {
    metadataBase: new URL(SITE_URL),
    title: { default: dict.meta.siteTitle, template: '%s · Koris' },
    description: dict.meta.siteDescription,
    applicationName: 'Koris',
    authors: [{ name: 'guilhermesalviano', url: REPO_URL }],
    creator: 'guilhermesalviano',
    alternates: { canonical: home, languages: languageAlternates('/') },
    openGraph: {
      type: 'website',
      siteName: 'Koris',
      title: dict.meta.siteTitle,
      description: dict.meta.siteDescription,
      url: home,
      locale: OG_LOCALE[locale],
      alternateLocale: LOCALES.filter((l) => l !== locale).map((l) => OG_LOCALE[l]),
      images: [{ url: '/logo.png', width: 128, height: 128, alt: 'Koris' }],
    },
    twitter: {
      card: 'summary',
      title: dict.meta.siteTitle,
      description: dict.meta.siteDescription,
      images: ['/logo.png'],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
    },
  };
}
