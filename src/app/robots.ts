import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/constants';

// Written to out/robots.txt at build time.
export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Everything here is public documentation we want indexed — including by
      // the AI answer engines, which is the point of llms.txt below. No
      // per-crawler carve-outs: a blanket allow says the same thing to all of
      // them, and stays correct as new crawlers appear.
      { userAgent: '*', allow: '/' },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
