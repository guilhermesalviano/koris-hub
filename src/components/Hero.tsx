import { DownloadButton } from '@/components/DownloadButton';
import Link from 'next/link';
import type { Dictionary } from '@/i18n';

export function Hero({ dict }: { dict: Dictionary }) {
  return (
    <div className="w-full flex justify-center py-8">
      <div className="max-w-4xl flex flex-col justify-center items-center">
        <h1 className="mb-4 text-5xl text-center font-bold tracking-tight text-txt sm:text-6xl">
          {dict.hero.titleLead}
          <b className="text-accent">{dict.hero.titleAccent}</b>
          {dict.hero.titleTail}
        </h1>
        <p className="mb-10 max-w-xl text-lg text-center text-muted">
          {dict.hero.subtitle}
        </p>

        <div className="flex flex-wrap gap-4">
          <DownloadButton
            dict={dict}
            fallbackHref="#how-it-works"
            className="rounded-lg bg-accent px-8 py-4 text-sm font-semibold text-bg transition-transform hover:-translate-y-0.5"
          />
          <Link
            href="/docs"
            className="rounded-lg border border-border bg-bg-subtle px-8 py-4 text-sm font-semibold text-txt transition-colors hover:border-accent"
          >
            {dict.hero.readDocs}
          </Link>
        </div>
      </div>
    </div>
  );
}
