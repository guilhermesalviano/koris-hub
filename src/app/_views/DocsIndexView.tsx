import { notFound } from 'next/navigation';
import { Markdown } from '@/components/Markdown';
import { getDoc } from '@/lib/docs';
import type { Locale } from '@/i18n';

export function DocsIndexView({ locale }: { locale: Locale }) {
  const doc = getDoc([], locale);
  if (!doc) notFound();

  return <Markdown>{doc.content}</Markdown>;
}
