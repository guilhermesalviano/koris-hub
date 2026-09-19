import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { isSafeUrl } from '@/lib/url';

export function Markdown({ children }: { children: string }) {
  return (
    <div className="prose prose-invert max-w-none prose-headings:tracking-tight prose-a:text-accent prose-a:no-underline hover:prose-a:underline prose-code:text-accent prose-code:before:content-none prose-code:after:content-none prose-pre:bg-bg prose-pre:border prose-pre:border-border prose-th:text-txt prose-hr:border-border">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a({ href, children, ...props }) {
            if (!isSafeUrl(href)) {
              return <span>{children}</span>;
            }
            const isExternal = href?.startsWith('http://') || href?.startsWith('https://');
            const isAnchor = href?.startsWith('#');

            if (isExternal) {
              return (
                <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
                  {children}
                </a>
              );
            }

            if (isAnchor) {
              return (
                <a href={href} {...props}>
                  {children}
                </a>
              );
            }

            return (
              <Link href={href ?? ''} {...props}>
                {children}
              </Link>
            );
          },
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
