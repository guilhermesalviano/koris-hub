import { DocsSidebar } from '@/components/DocsSidebar';
import { getDocsTree } from '@/lib/docs';
import { getDictionary, type Locale } from '@/i18n';

export function DocsLayoutView({
  locale,
  children,
}: {
  locale: Locale;
  children: React.ReactNode;
}) {
  const tree = getDocsTree(locale);
  const dict = getDictionary(locale);

  return (
    <div className="mx-auto grid max-w-5xl gap-10 px-6 py-12 sm:grid-cols-[13rem_1fr] sm:py-16">
      <aside>
        <DocsSidebar tree={tree} locale={locale} dict={dict} />
      </aside>
      <div className="min-w-0">{children}</div>
    </div>
  );
}
