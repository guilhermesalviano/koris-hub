import Link from 'next/link';
import type { Locale } from '@/i18n/locales';
import { localePath } from '@/i18n/locales';
import { getDictionary } from '@/i18n';

export function IndexView({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);

  return (
    <main className="relative mx-auto flex min-h-[calc(100vh-12rem)] max-w-5xl flex-col items-center justify-center px-4 py-20 text-center">
      {/* Background ambient glow & grid pattern */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 landing-grid [mask-image:radial-gradient(ellipse_70%_60%_at_50%_40%,#000_60%,transparent_100%)] opacity-60"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 w-[300px] sm:w-[500px] h-[200px] sm:h-[300px] bg-accent/10 blur-[90px] sm:blur-[120px] rounded-full"
      />

      <div className="flex flex-col items-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/80 bg-bg-subtle/80 px-3.5 py-1.5 font-mono text-xs text-muted backdrop-blur-sm">
          <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
          <span>{dict.incoming.badge}</span>
        </div>

        <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-txt sm:text-6xl md:text-7xl leading-[1.1] text-balance">
          {dict.incoming.titleLead}
          <em className="italic text-accent">{dict.incoming.titleAccent}</em>
          {dict.incoming.titleTail}
        </h1>

        <p className="mt-4 max-w-sm text-sm sm:text-base text-muted">
          {dict.incoming.subtitle}
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href={localePath(locale, '/bot/')}
            className="rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-bg transition-all hover:opacity-90 hover:shadow-lg hover:shadow-accent/20"
          >
            Koris Bot &rarr;
          </Link>
          <Link
            href={localePath(locale, '/docs/')}
            className="rounded-lg border border-border/80 bg-bg-subtle/80 px-5 py-2.5 text-sm font-semibold text-txt transition-colors hover:border-accent"
          >
            {dict.nav.docs}
          </Link>
        </div>
      </div>
    </main>
  );
}
