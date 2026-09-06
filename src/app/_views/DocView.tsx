import { notFound } from 'next/navigation';
import { Markdown } from '@/components/Markdown';
import { JsonLd } from '@/components/JsonLd';
import { SITE_URL } from '@/lib/constants';
import { getDoc, summarize } from '@/lib/docs';
import { HTML_LANG, localePath, type Locale } from '@/i18n/locales';

export function DocView({ locale, slug }: { locale: Locale; slug: string[] }) {
  const doc = getDoc(slug, locale);
  if (!doc) notFound();

  const url = `${SITE_URL}${localePath(locale, `/docs/${slug.join('/')}/`)}`;

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'TechArticle',
          headline: doc.meta.title,
          description: summarize(doc.content),
          url,
          inLanguage: HTML_LANG[locale],
          isPartOf: { '@id': `${SITE_URL}/#website` },
          about: { '@id': `${SITE_URL}/#software` },
        }}
      />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Koris', item: `${SITE_URL}${localePath(locale, '/')}` },
            { '@type': 'ListItem', position: 2, name: 'Docs', item: `${SITE_URL}${localePath(locale, '/docs/')}` },
            { '@type': 'ListItem', position: 3, name: doc.meta.title, item: url },
          ],
        }}
      />
      <Markdown>{doc.content}</Markdown>
    </>
  );
}
