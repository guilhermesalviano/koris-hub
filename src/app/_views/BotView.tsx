import { Hero } from '@/components/Hero';
import { Download } from '@/components/Download';
import { Extend } from '@/components/Extend';
import { Changelog } from '@/components/Changelog';
import { Footer } from '@/components/Footer';
import { ChatDemo } from '@/components/chat-demo/ChatDemo';
import { FeaturedCapabilities } from '@/components/FeaturedCapabilities';
import { Testimonials } from '@/components/Testimonials';
import { Faq } from '@/components/Faq';
import { JsonLd } from '@/components/JsonLd';
import { REPO_URL, SITE_URL } from '@/lib/constants';
import { getDictionary, type Locale } from '@/i18n';
import { localePath } from '@/i18n/locales';

export function BotView({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const botPath = localePath(locale, '/bot/');

  return (
    <main className="mx-auto max-w-5xl">
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          '@id': `${SITE_URL}${botPath}#software`,
          name: 'Koris Bot',
          applicationCategory: 'DeveloperApplication',
          applicationSubCategory: 'AI agent framework',
          operatingSystem: 'Linux, macOS, Windows',
          programmingLanguage: 'TypeScript',
          license: 'https://opensource.org/licenses/ISC',
          isAccessibleForFree: true,
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
          codeRepository: REPO_URL,
          url: `${SITE_URL}${botPath}`,
          description: dict.meta.botDescription,
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

      {/* Hero section with ObsidianUI references */}
      <Hero dict={dict} locale={locale} />

      {/* Interactive Chat Demo */}
      <ChatDemo dict={dict} locale={locale} />

      {/* Featured capabilities 2x2 cards (ObsidianUI "Featured Components" reference) */}
      <FeaturedCapabilities dict={dict} locale={locale} />

      {/* Code extension tabs (Skills & Tools) */}
      <Extend dict={dict} locale={locale} />

      {/* Community / Builder quotes (ObsidianUI "Made for people who love building" reference) */}
      <Testimonials dict={dict} />

      {/* Download & Installation */}
      <Download dict={dict} />

      {/* FAQ Accordion (ObsidianUI "Frequently Asked Questions" reference) */}
      <Faq dict={dict} />

      {/* GitHub Releases Changelog */}
      <Changelog dict={dict} />

      {/* Multi-column Footer with status badge and bottom wordmark */}
      <Footer dict={dict} locale={locale} />
    </main>
  );
}
