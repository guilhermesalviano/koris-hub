import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Navbar } from '@/components/Navbar';
import { JsonLd } from '@/components/JsonLd';
import { REPO_URL, SITE_URL } from '@/lib/constants';
import './globals.css';

const geistSans = Geist({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

const DESCRIPTION =
  'Koris is an open-source, self-hosted AI agent framework in TypeScript. It runs on your own infrastructure, talks over Telegram and WhatsApp, remembers across sessions, and extends through tools and Markdown skills.';

export const metadata: Metadata = {
  // Resolves the relative URLs used by openGraph/twitter/alternates below.
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Koris — self-hosted AI assistant framework',
    // Pages set a bare title; this appends the brand for them.
    template: '%s · Koris',
  },
  description: DESCRIPTION,
  applicationName: 'Koris',
  keywords: [
    'AI agent framework',
    'self-hosted AI assistant',
    'open source AI agent',
    'TypeScript AI agent',
    'Telegram AI bot',
    'WhatsApp AI bot',
    'agent skills',
    'LLM tools',
  ],
  authors: [{ name: 'guilhermesalviano', url: REPO_URL }],
  creator: 'guilhermesalviano',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: 'Koris',
    title: 'Koris — self-hosted AI assistant framework',
    description: DESCRIPTION,
    url: '/',
    locale: 'en_US',
    images: [{ url: '/logo.png', width: 128, height: 128, alt: 'Koris' }],
  },
  twitter: {
    card: 'summary',
    title: 'Koris — self-hosted AI assistant framework',
    description: DESCRIPTION,
    images: ['/logo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="font-sans">
        <JsonLd
          data={{
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            '@id': `${SITE_URL}/#website`,
            name: 'Koris',
            url: `${SITE_URL}/`,
            description: DESCRIPTION,
            inLanguage: 'en',
          }}
        />
        <Navbar />
        {children}
      </body>
    </html>
  );
}
