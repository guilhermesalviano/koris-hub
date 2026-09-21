import type { Metadata } from 'next';
import { BotView } from '@/app/_views/BotView';
import { getDictionary } from '@/i18n';
import { pageMetadata } from '@/lib/metadata';

const dict = getDictionary('en');

export const metadata: Metadata = pageMetadata({
  locale: 'en',
  path: '/bot/',
  title: dict.meta.botTitle,
  description: dict.meta.botDescription,
});

export default function Page() {
  return <BotView locale={'en'} />;
}
