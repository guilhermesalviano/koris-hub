import { Hero } from '@/components/Hero';
import { Download } from '@/components/Download';
import { Extend } from '@/components/Extend';
import { Changelog } from '@/components/Changelog';
import { Footer } from '@/components/Footer';
import { ChatDemo } from '@/components/chat-demo/ChatDemo';
import { JsonLd } from '@/components/JsonLd';
import { REPO_URL, SITE_URL } from '@/lib/constants';
import { getDictionary, type Locale } from '@/i18n';
import { HTML_LANG } from '@/i18n/locales';

export function HomeView({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);

  return (
    <main className="mx-auto max-w-5xl px-6 py-12 sm:py-16">
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          '@id': `${SITE_URL}/#software`,
          name: 'Koris',
          applicationCategory: 'DeveloperApplication',
          applicationSubCategory: 'AI agent framework',
          operatingSystem: 'Linux, macOS, Windows',
          programmingLanguage: 'TypeScript',
          license: 'https://opensource.org/licenses/ISC',
          isAccessibleForFree: true,
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
          codeRepository: REPO_URL,
          url: `${SITE_URL}/`,
          description: dict.meta.siteDescription,
          featureList: [
            'Pluggable channels: Telegram, WhatsApp, terminal UI, web dashboard',
            'Persistent memory and sessions in local SQLite',
            'Extensible tools: web search, page reading, HTTP requests, GitHub issues, scheduled beats',
            'Markdown skills that teach the agent new procedures without code',
            'Per-channel trust model with a domain allowlist for outbound requests',
            'Provider-agnostic: runs against your choice of LLM provider',
          ],
        }}
      />

      <Hero dict={dict} />

      <ChatDemo dict={dict} locale={locale} />

      <Extend dict={dict} locale={locale} />

      <Download dict={dict} />

      <Changelog dict={dict} />

      <Footer dict={dict} />
    </main>
  );
}
