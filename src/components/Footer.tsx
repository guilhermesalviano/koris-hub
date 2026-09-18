import Image from 'next/image';
import Link from 'next/link';
import { DownloadButton } from '@/components/DownloadButton';
import { BASE_PATH, REPO_URL, RELEASES_URL } from '@/lib/constants';
import type { Dictionary, Locale } from '@/i18n';
import { localePath } from '@/i18n/locales';

export function Footer({ dict, locale = 'en' }: { dict: Dictionary; locale?: Locale }) {
  return (
    <footer className="mt-28 border-t border-border/80 px-4 sm:px-6 pt-16 pb-12 overflow-hidden">
      {/* Top CTA banner */}
      <div className="rounded-2xl border border-border/80 bg-card p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 mb-16">
        <div>
          <h3 className="text-2xl font-bold tracking-tight text-txt">
            {dict.download.title}
          </h3>
          <p className="mt-1 text-sm text-muted max-w-lg">
            {dict.footer.tagline}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <DownloadButton
            dict={dict}
            className="rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-bg transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-accent/25"
          />
          <a
            href={REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl border border-border/80 bg-bg-subtle px-5 py-3 text-sm font-semibold text-txt transition-colors hover:border-accent"
          >
            {dict.nav.github}
          </a>
        </div>
      </div>

      {/* Multi-column navigation (ObsidianUI-inspired) */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-5 gap-8 sm:gap-10">
        {/* Brand Column */}
        <div className="col-span-2">
          <Link href={localePath(locale, '/')} className="flex items-center gap-2.5">
            <Image
              src={`${BASE_PATH}/logo.png`}
              alt="Koris logo"
              width={28}
              height={28}
              className="rounded-lg"
            />
            <span className="text-lg font-bold tracking-tight text-txt">koris</span>
          </Link>
          <p className="mt-3 text-sm text-muted leading-relaxed max-w-sm">
            {dict.footer.tagline}
          </p>

          {/* System status pill */}
          <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-border/60 bg-bg-subtle px-3 py-1 text-xs font-medium text-muted">
            <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{dict.footer.status}</span>
          </div>

          <p className="mt-4 text-xs text-muted">
            {dict.footer.license} &middot; {dict.footer.builtBy}
          </p>
        </div>

        {/* Product Column */}
        <div>
          <h4 className="text-sm font-semibold text-txt mb-4">{dict.footer.product}</h4>
          <ul className="space-y-2.5 text-sm text-muted">
            <li>
              <Link href={localePath(locale, '/marketplace/')} className="hover:text-txt transition-colors">
                {dict.footer.marketplace}
              </Link>
            </li>
            <li>
              <Link href={localePath(locale, '/docs/')} className="hover:text-txt transition-colors">
                {dict.footer.docs}
              </Link>
            </li>
            <li>
              <a href="#download" className="hover:text-txt transition-colors">
                {dict.footer.downloads}
              </a>
            </li>
            <li>
              <a href="#changelog" className="hover:text-txt transition-colors">
                {dict.footer.changelog}
              </a>
            </li>
          </ul>
        </div>

        {/* Community Column */}
        <div>
          <h4 className="text-sm font-semibold text-txt mb-4">{dict.footer.community}</h4>
          <ul className="space-y-2.5 text-sm text-muted">
            <li>
              <a
                href={REPO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-txt transition-colors"
              >
                {dict.footer.github}
              </a>
            </li>
            <li>
              <a
                href={`${REPO_URL}/issues`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-txt transition-colors"
              >
                {dict.footer.issues}
              </a>
            </li>
            <li>
              <a
                href={RELEASES_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-txt transition-colors"
              >
                {dict.footer.releases}
              </a>
            </li>
          </ul>
        </div>

        {/* Resources Column */}
        <div>
          <h4 className="text-sm font-semibold text-txt mb-4">{dict.footer.resources}</h4>
          <ul className="space-y-2.5 text-sm text-muted">
            <li>
              <Link href={localePath(locale, '/docs/skills/')} className="hover:text-txt transition-colors">
                {dict.footer.skills}
              </Link>
            </li>
            <li>
              <Link href={localePath(locale, '/docs/tools/')} className="hover:text-txt transition-colors">
                {dict.footer.tools}
              </Link>
            </li>
            <li>
              <a
                href="https://opensource.org/licenses/ISC"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-txt transition-colors"
              >
                {dict.footer.license}
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Massive subtle wordmark at bottom (Direct ObsidianUI reference) */}
      <div
        aria-hidden="true"
        className="pointer-events-none select-none text-center text-[100px] sm:text-[180px] md:text-[230px] font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-border/25 to-transparent leading-none mt-14 -mb-8"
      >
        koris
      </div>
    </footer>
  );
}
