import { DownloadButton } from '@/components/DownloadButton';
import Link from 'next/link';
import type { Dictionary, Locale } from '@/i18n';
import { localePath } from '@/i18n/locales';

export function Hero({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  return (
    <div className="relative w-full overflow-hidden px-4 sm:px-6 pt-8 pb-12 sm:pt-14 sm:pb-20 flex flex-col items-center justify-center text-center">
      {/* Background ambient glow & grid pattern */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 landing-grid [mask-image:radial-gradient(ellipse_70%_60%_at_50%_15%,#000_60%,transparent_100%)] opacity-60"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 -z-10 w-[300px] sm:w-[650px] h-[200px] sm:h-[320px] bg-accent/15 blur-[80px] sm:blur-[120px] rounded-full"
      />

      {/* Large watermark brand element: scales gracefully on mobile */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-6 sm:top-8 left-1/2 -translate-x-1/2 -z-10 select-none text-[80px] sm:text-[180px] md:text-[240px] lg:text-[280px] font-black tracking-tighter text-border/20 leading-none opacity-30 sm:opacity-40 whitespace-nowrap"
      >
        KORIS
      </div>

      <div className="w-full max-w-4xl flex flex-col justify-center items-center px-2 sm:px-4">
        {/* Top announcement / status pill badge */}
        <div className="mb-4 sm:mb-6 inline-flex max-w-full items-center gap-2 rounded-full border border-border/80 bg-bg-subtle/80 px-3 py-1 sm:px-3.5 sm:py-1.5 text-[11px] sm:text-xs font-medium text-txt/90 shadow-sm backdrop-blur-md transition-all hover:border-accent/50 hover:bg-bg-subtle text-left sm:text-center">
          <span className="size-2 shrink-0 rounded-full bg-accent animate-pulse" />
          <span className="truncate">{dict.hero.badge}</span>
        </div>

        {/* Gradient headline: adjusted for small mobile screens without breaking words */}
        <h1 className="mb-4 sm:mb-6 text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-txt via-txt/90 to-muted leading-[1.12] sm:leading-[1.08] text-balance">
          {dict.hero.titleLead}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-[#ff7e60] to-accent font-extrabold">
            {dict.hero.titleAccent}
          </span>
          {dict.hero.titleTail}
        </h1>

        {/* Subtitle: comfortable reading size on mobile */}
        <p className="mb-6 sm:mb-8 max-w-2xl text-sm sm:text-lg md:text-xl text-muted leading-relaxed text-balance px-1">
          {dict.hero.subtitle}
        </p>

        {/* CTA Buttons: full-width stacked on narrow mobile, horizontal row on sm+ */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto max-w-xs sm:max-w-none">
          <DownloadButton
            dict={dict}
            fallbackHref="#download"
            className="w-full sm:w-auto rounded-xl bg-accent px-6 sm:px-8 py-3.5 text-sm font-semibold text-bg transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-accent/25 active:scale-[0.98] text-center justify-center"
          />
          <Link
            href={localePath(locale, '/docs/')}
            className="w-full sm:w-auto rounded-xl border border-border/80 bg-bg-subtle/80 px-6 sm:px-8 py-3.5 text-sm font-semibold text-txt transition-all hover:border-accent/60 hover:bg-bg-subtle backdrop-blur-sm active:scale-[0.98] text-center justify-center"
          >
            {dict.hero.readDocs}
          </Link>
        </div>

        {/* Tech stack & trust specs row: clean chips on mobile */}
        <div className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-[11px] sm:text-xs font-medium text-muted border-t border-border/40 pt-5 sm:pt-6 w-full">
          <span className="inline-flex items-center gap-1.5 rounded-md sm:rounded-none bg-bg-subtle/40 sm:bg-transparent px-2 sm:px-0 py-1 sm:py-0 border border-border/40 sm:border-0">
            <span className="size-1.5 rounded-full bg-accent" />
            {dict.hero.techTypescript}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-md sm:rounded-none bg-bg-subtle/40 sm:bg-transparent px-2 sm:px-0 py-1 sm:py-0 border border-border/40 sm:border-0">
            <span className="size-1.5 rounded-full bg-zinc-500" />
            {dict.hero.techSqlite}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-md sm:rounded-none bg-bg-subtle/40 sm:bg-transparent px-2 sm:px-0 py-1 sm:py-0 border border-border/40 sm:border-0">
            <span className="size-1.5 rounded-full bg-zinc-500" />
            {dict.hero.techChannels}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-md sm:rounded-none bg-bg-subtle/40 sm:bg-transparent px-2 sm:px-0 py-1 sm:py-0 border border-border/40 sm:border-0">
            <span className="size-1.5 rounded-full bg-zinc-500" />
            {dict.hero.techLocal}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-md sm:rounded-none bg-bg-subtle/40 sm:bg-transparent px-2 sm:px-0 py-1 sm:py-0 border border-border/40 sm:border-0">
            <span className="size-1.5 rounded-full bg-zinc-500" />
            {dict.hero.techLicense}
          </span>
        </div>
      </div>
    </div>
  );
}
