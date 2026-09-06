import { DocsLayoutView } from '@/app/_views/DocsLayoutView';

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return <DocsLayoutView locale={'pt-br'}>{children}</DocsLayoutView>;
}
