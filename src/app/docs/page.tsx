import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Markdown } from '@/components/Markdown';
import { getDoc } from '@/lib/docs';

const DESCRIPTION =
  'Documentation for Koris — install and configure the self-hosted AI agent, connect Telegram or WhatsApp channels, and extend it with tools and skills.';

export const metadata: Metadata = {
  title: 'Docs',
  description: DESCRIPTION,
  alternates: { canonical: '/docs/' },
  openGraph: {
    type: 'website',
    title: 'Docs · Koris',
    description: DESCRIPTION,
    url: '/docs/',
  },
};

export default function DocsIndexPage() {
  const doc = getDoc([]);
  if (!doc) notFound();

  return <Markdown>{doc.content}</Markdown>;
}
