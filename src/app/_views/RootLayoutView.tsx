import { Geist, Geist_Mono } from 'next/font/google';
import { Navbar } from '@/components/Navbar';
import { JsonLd } from '@/components/JsonLd';
import { SITE_URL } from '@/lib/constants';
import { getDictionary } from '@/i18n';
import { HTML_LANG, type Locale } from '@/i18n/locales';

const geistSans = Geist({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-mono', display: 'swap' });

/**
 * The shared document shell. Each locale has its own root layout (a route group
 * per locale) so that `<html lang>` is correct in the static HTML rather than
 * patched in by script after load — the two call this with their own locale.
 */
export function RootLayoutView({
  locale,
  children,
}: {
  locale: Locale;
  children: React.ReactNode;
}) {
  const dict = getDictionary(locale);

  return (
    <html lang={HTML_LANG[locale]} className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="font-sans">
        <JsonLd
          data={{
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            '@id': `${SITE_URL}/#website`,
            name: 'Koris',
            url: `${SITE_URL}/`,
            description: dict.meta.siteDescription,
            inLanguage: HTML_LANG[locale],
          }}
        />
        <Navbar locale={locale} dict={dict} />
        {children}
      </body>
    </html>
  );
}
