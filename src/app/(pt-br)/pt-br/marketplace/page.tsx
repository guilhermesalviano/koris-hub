import type { Metadata } from 'next';
import { MarketplaceView } from '@/app/_views/MarketplaceView';
import { getDictionary } from '@/i18n';
import { pageMetadata } from '@/lib/metadata';

const dict = getDictionary('pt-br');

export const metadata: Metadata = pageMetadata({
  locale: 'pt-br',
  path: '/marketplace/',
  title: dict.meta.marketplaceTitle,
  description: dict.meta.marketplaceDescription,
});

export default function Page() {
  return <MarketplaceView locale={'pt-br'} />;
}
