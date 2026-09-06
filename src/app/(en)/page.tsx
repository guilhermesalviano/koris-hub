import type { Metadata } from 'next';
import { HomeView } from '@/app/_views/HomeView';
import { getDictionary } from '@/i18n';
import { pageMetadata } from '@/lib/metadata';

const dict = getDictionary('en');

export const metadata: Metadata = pageMetadata({
  locale: 'en',
  path: '/',
  title: dict.meta.siteTitle,
  description: dict.meta.siteDescription,
});

export default function Page() {
  return <HomeView locale={'en'} />;
}
