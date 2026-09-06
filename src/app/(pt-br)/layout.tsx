import type { Metadata } from 'next';
import { RootLayoutView } from '@/app/_views/RootLayoutView';
import { rootMetadata } from '@/app/_views/rootMetadata';
import '../globals.css';

export const metadata: Metadata = rootMetadata('pt-br');

export default function PtBrLayout({ children }: { children: React.ReactNode }) {
  return <RootLayoutView locale="pt-br">{children}</RootLayoutView>;
}
