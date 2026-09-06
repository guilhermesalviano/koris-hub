'use client';

import { usePathname } from 'next/navigation';
import {
  LOCALES,
  LOCALE_NAME,
  LOCALE_STORAGE_KEY,
  localePath,
  splitLocale,
  type Locale,
} from '@/i18n/locales';

/**
 * Links to the current page in each other locale.
 *
 * Uses a plain <a>, not next/link: the locales live under separate root layouts,
 * so the navigation is a full document load either way, and this keeps the
 * localStorage write below on the same click.
 */
export function LanguageSwitcher({ label }: { label: string }) {
  const pathname = usePathname() || '/';
  const { locale: current, path } = splitLocale(pathname);

  return (
    <div className="flex items-center gap-1" aria-label={label}>
      {LOCALES.map((locale) => {
        const active = locale === current;
        return (
          <a
            key={locale}
            href={localePath(locale, path)}
            hrefLang={locale}
            aria-current={active ? 'true' : undefined}
            // Remember the choice so the first-visit redirect never overrides
            // someone who picked a language by hand.
            onClick={() => {
              try {
                localStorage.setItem(LOCALE_STORAGE_KEY, locale);
              } catch {
                // Private mode / storage disabled — the switch still works.
              }
            }}
            className={`rounded-md px-2 py-1 text-xs font-semibold uppercase transition-colors ${
              active ? 'bg-bg-subtle text-txt' : 'text-muted hover:text-txt'
            }`}
          >
            {LOCALE_NAME[locale]}
          </a>
        );
      })}
    </div>
  );
}
