import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Markdown } from '@/components/Markdown';
import { getDoc } from '@/lib/docs';

export const metadata: Metadata = {
  title: 'Docs · Koris',
  description: 'Documentation for the Koris assistant framework.',
};

export default function DocsIndexPage() {
  const doc = getDoc([]);
  if (!doc) notFound();

  return <Markdown>{doc.content}</Markdown>;
}
