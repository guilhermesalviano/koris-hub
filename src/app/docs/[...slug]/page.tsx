import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Markdown } from '@/components/Markdown';
import { JsonLd } from '@/components/JsonLd';
import { SITE_URL } from '@/lib/constants';
import { getAllDocSlugs, getDoc, summarize } from '@/lib/docs';

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllDocSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const doc = getDoc(slug);
  if (!doc) return {};

  const title = `${doc.meta.title} · Koris Docs`;
  const description = summarize(doc.content);
  const path = `/docs/${slug.join('/')}/`;

  return {
    title: doc.meta.title,
    description,
    alternates: { canonical: path },
    openGraph: { type: 'article', title, description, url: path },
    twitter: { card: 'summary', title, description },
  };
}

export default async function DocPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const doc = getDoc(slug);
  if (!doc) notFound();

  const path = `/docs/${slug.join('/')}/`;

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'TechArticle',
          headline: doc.meta.title,
          description: summarize(doc.content),
          url: `${SITE_URL}${path}`,
          inLanguage: 'en',
          isPartOf: { '@id': `${SITE_URL}/#website` },
          about: { '@id': `${SITE_URL}/#software` },
        }}
      />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Koris', item: `${SITE_URL}/` },
            { '@type': 'ListItem', position: 2, name: 'Docs', item: `${SITE_URL}/docs/` },
            { '@type': 'ListItem', position: 3, name: doc.meta.title, item: `${SITE_URL}${path}` },
          ],
        }}
      />
      <Markdown>{doc.content}</Markdown>
    </>
  );
}
