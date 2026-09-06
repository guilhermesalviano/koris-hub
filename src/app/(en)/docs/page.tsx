import type { Metadata } from 'next';
import { DocsIndexView } from '@/app/_views/DocsIndexView';
import { getDictionary } from '@/i18n';
import { pageMetadata } from '@/lib/metadata';

const dict = getDictionary('en');

export const metadata: Metadata = pageMetadata({
  locale: 'en',
  path: '/docs/',
  title: dict.meta.docsTitle,
  description: dict.meta.docsDescription,
});

export default function Page() {
  return <DocsIndexView locale={'en'} />;
}
