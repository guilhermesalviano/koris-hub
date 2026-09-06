import type { Metadata } from 'next';
import { RootLayoutView } from '@/app/_views/RootLayoutView';
import { rootMetadata } from '@/app/_views/rootMetadata';
import { LocaleRedirect } from '@/components/LocaleRedirect';
import '../globals.css';

export const metadata: Metadata = rootMetadata('en');

export default function EnLayout({ children }: { children: React.ReactNode }) {
  return (
    <RootLayoutView locale="en">
      <LocaleRedirect />
      {children}
    </RootLayoutView>
  );
}
