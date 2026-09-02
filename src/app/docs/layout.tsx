import { DocsSidebar } from '@/components/DocsSidebar';
import { getDocsTree } from '@/lib/docs';

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  const tree = getDocsTree();

  return (
    <div className="mx-auto grid max-w-5xl gap-10 px-6 py-12 sm:grid-cols-[13rem_1fr] sm:py-16">
      <aside>
        <DocsSidebar tree={tree} />
      </aside>
      <div className="min-w-0">{children}</div>
    </div>
  );
}
