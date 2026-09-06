import type { Metadata } from 'next';
import { MarketplaceView } from '@/app/_views/MarketplaceView';
import { getDictionary } from '@/i18n';
import { pageMetadata } from '@/lib/metadata';

const dict = getDictionary('en');

export const metadata: Metadata = pageMetadata({
  locale: 'en',
  path: '/marketplace/',
  title: dict.meta.marketplaceTitle,
  description: dict.meta.marketplaceDescription,
});

export default function Page() {
  return <MarketplaceView locale={'en'} />;
}
