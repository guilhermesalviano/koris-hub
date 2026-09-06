import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/constants';
import { getAllDocSlugs } from '@/lib/docs';
import { getAllEntries } from '@/lib/marketplace';

// Written to out/sitemap.xml at build time.
export const dynamic = 'force-static';

// `trailingSlash: true` in next.config.ts, so every URL here carries one —
// a sitemap entry that redirects is a wasted crawl.
const url = (path: string) => `${SITE_URL}${path}`;

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const docs = getAllDocSlugs().map((slug) => ({
    url: url(`/docs/${slug.join('/')}/`),
    lastModified,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  const entries = getAllEntries().map((entry) => ({
    url: url(`/marketplace/${entry.slug}/`),
    lastModified,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [
    { url: url('/'), lastModified, changeFrequency: 'weekly', priority: 1 },
    { url: url('/docs/'), lastModified, changeFrequency: 'weekly', priority: 0.9 },
    { url: url('/marketplace/'), lastModified, changeFrequency: 'weekly', priority: 0.9 },
    ...docs,
    ...entries,
  ];
}
