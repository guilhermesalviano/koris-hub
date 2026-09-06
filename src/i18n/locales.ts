export const LOCALES = ['en', 'pt-br'] as const;

export type Locale = (typeof LOCALES)[number];

/** English is served unprefixed at the site root; every other locale is prefixed. */
export const DEFAULT_LOCALE: Locale = 'en';

/** `<html lang>` and hreflang value for each locale. */
export const HTML_LANG: Record<Locale, string> = {
  en: 'en',
  'pt-br': 'pt-BR',
};

/** Open Graph locale codes (underscored, unlike hreflang). */
export const OG_LOCALE: Record<Locale, string> = {
  en: 'en_US',
  'pt-br': 'pt_BR',
};

/** Name of each locale, written in that locale — for the language switcher. */
export const LOCALE_NAME: Record<Locale, string> = {
  en: 'English',
  'pt-br': 'Português',
};

/** localStorage key holding an explicit choice, which suppresses auto-detection. */
export const LOCALE_STORAGE_KEY = 'koris-locale';

/**
 * Prefix a site-relative path for a locale. The default locale is unprefixed,
 * so this is the single place that knows the asymmetry.
 *
 *   localePath('en', '/docs/tools/')     → '/docs/tools/'
 *   localePath('pt-br', '/docs/tools/')  → '/pt-br/docs/tools/'
 */
export function localePath(locale: Locale, path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  if (locale === DEFAULT_LOCALE) return normalized;
  return normalized === '/' ? `/${locale}/` : `/${locale}${normalized}`;
}

/**
 * Inverse of localePath: the locale a pathname belongs to, plus the path with
 * any locale prefix removed. Used by the language switcher to find the current
 * page's counterpart in the other locale.
 */
export function splitLocale(pathname: string): { locale: Locale; path: string } {
  for (const locale of LOCALES) {
    if (locale === DEFAULT_LOCALE) continue;
    if (pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)) {
      return { locale, path: pathname.slice(`/${locale}`.length) || '/' };
    }
  }
  return { locale: DEFAULT_LOCALE, path: pathname };
}
