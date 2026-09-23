import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/constants';
import { getAllDocSlugs } from '@/lib/docs';
import { LOCALES, localePath } from '@/i18n/locales';
import { languageAlternates } from '@/lib/metadata';

// Written to out/sitemap.xml at build time.
export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  // Locale-independent paths; the route set is identical in every locale, which
  // is what lets each entry carry a complete hreflang alternate map.
  const paths: { path: string; changeFrequency: 'weekly' | 'monthly'; priority: number }[] = [
    { path: '/', changeFrequency: 'weekly', priority: 1 },
    { path: '/bot/', changeFrequency: 'weekly', priority: 0.9 },
    { path: '/docs/', changeFrequency: 'weekly', priority: 0.9 },
    ...getAllDocSlugs().map((slug) => ({
      path: `/docs/${slug.join('/')}/`,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ];

  return LOCALES.flatMap((locale) =>
    paths.map(({ path, changeFrequency, priority }) => ({
      url: `${SITE_URL}${localePath(locale, path)}`,
      lastModified,
      changeFrequency,
      priority,
      alternates: { languages: languageAlternates(path) },
    })),
  );
}
