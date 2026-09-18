import { DownloadButton } from '@/components/DownloadButton';
import { CopyButton } from '@/components/Download';
import Link from 'next/link';
import type { Dictionary, Locale } from '@/i18n';
import { localePath } from '@/i18n/locales';

export function Hero({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  return (
    <div className="relative w-full overflow-hidden pt-8 pb-14 sm:pt-14 sm:pb-20 flex flex-col items-center justify-center text-center">
      {/* Background ambient glow & grid pattern (ObsidianUI-inspired) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 landing-grid [mask-image:radial-gradient(ellipse_70%_60%_at_50%_15%,#000_60%,transparent_100%)] opacity-60"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 -z-10 w-[650px] h-[320px] bg-accent/15 blur-[120px] rounded-full"
      />

      {/* Large watermark brand element (ObsidianUI signature) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-8 left-1/2 -translate-x-1/2 -z-10 select-none text-[130px] sm:text-[210px] md:text-[280px] font-black tracking-tighter text-border/20 leading-none opacity-40 whitespace-nowrap"
      >
        KORIS
      </div>

      <div className="max-w-4xl flex flex-col justify-center items-center px-4">
        {/* Top announcement / status pill badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/80 bg-bg-subtle/80 px-3.5 py-1.5 text-xs font-medium text-txt/90 shadow-sm backdrop-blur-md transition-all hover:border-accent/50 hover:bg-bg-subtle">
          <span className="size-2 rounded-full bg-accent animate-pulse" />
          <span>{dict.hero.badge}</span>
        </div>

        {/* Gradient headline */}
        <h1 className="mb-6 text-4xl sm:text-6xl md:text-7xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-zinc-200 to-zinc-400 leading-[1.08] text-balance">
          {dict.hero.titleLead}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-[#ff7e60] to-accent font-extrabold">
            {dict.hero.titleAccent}
          </span>
          {dict.hero.titleTail}
        </h1>

        {/* Refined subtitle */}
        <p className="mb-8 max-w-2xl text-base sm:text-lg md:text-xl text-muted leading-relaxed text-balance">
          {dict.hero.subtitle}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <DownloadButton
            dict={dict}
            fallbackHref="#download"
            className="rounded-xl bg-accent px-8 py-3.5 text-sm font-semibold text-bg transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-accent/25 active:scale-[0.98]"
          />
          <Link
            href={localePath(locale, '/docs/')}
            className="rounded-xl border border-border/80 bg-bg-subtle/80 px-8 py-3.5 text-sm font-semibold text-txt transition-all hover:border-accent/60 hover:bg-bg-subtle backdrop-blur-sm active:scale-[0.98]"
          >
            {dict.hero.readDocs}
          </Link>
        </div>

        {/* Command bar / Quick install */}
        <div className="mt-8 flex max-w-full items-center gap-2.5 rounded-xl border border-border/80 bg-bg-subtle/80 px-4 py-2 text-xs font-mono text-muted backdrop-blur-md shadow-sm">
          <span className="text-accent font-bold select-none">$</span>
          <span className="text-txt/90 select-all overflow-hidden text-ellipsis whitespace-nowrap">
            {dict.hero.installCmd}
          </span>
          <CopyButton text={dict.hero.installCmd} className="ml-1 py-0.5 px-2" />
        </div>

        {/* Tech stack & trust specs row (ObsidianUI reference) */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3.5 sm:gap-5 text-xs font-medium text-muted border-t border-border/40 pt-6">
          <span className="flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-accent" />
            {dict.hero.techTypescript}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-zinc-500" />
            {dict.hero.techSqlite}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-zinc-500" />
            {dict.hero.techChannels}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-zinc-500" />
            {dict.hero.techLocal}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-zinc-500" />
            {dict.hero.techLicense}
          </span>
        </div>
      </div>
    </div>
  );
}
