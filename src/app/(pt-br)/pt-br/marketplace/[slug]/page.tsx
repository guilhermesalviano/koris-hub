import type { Metadata } from 'next';
import { MarketplaceEntryView } from '@/app/_views/MarketplaceEntryView';
import { getAllEntries, getEntry } from '@/lib/marketplace';
import { pageMetadata } from '@/lib/metadata';

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllEntries().map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const entry = getEntry(slug, 'pt-br');
  if (!entry) return {};

  return {
    ...pageMetadata({
      locale: 'pt-br',
      path: `/marketplace/${entry.slug}/`,
      title: entry.name,
      description: entry.summary,
      type: 'article',
    }),
    keywords: entry.tags,
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <MarketplaceEntryView locale={'pt-br'} slug={slug} />;
}
