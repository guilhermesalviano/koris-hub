import type { Metadata } from 'next';
import { DocView } from '@/app/_views/DocView';
import { getAllDocSlugs, getDoc, summarize } from '@/lib/docs';
import { pageMetadata } from '@/lib/metadata';

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
  const doc = getDoc(slug, 'en');
  if (!doc) return {};

  return pageMetadata({
    locale: 'en',
    path: `/docs/${slug.join('/')}/`,
    title: doc.meta.title,
    description: summarize(doc.content),
    type: 'article',
  });
}

export default async function Page({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  return <DocView locale={'en'} slug={slug} />;
}
