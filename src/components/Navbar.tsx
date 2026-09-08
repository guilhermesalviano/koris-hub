import Image from 'next/image';
import Link from 'next/link';
import { BASE_PATH, REPO_URL } from '@/lib/constants';
import type { Dictionary } from '@/i18n';
import { localePath, type Locale } from '@/i18n/locales';

export function Navbar({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const navLinks = [
    { href: '/marketplace/', label: dict.nav.marketplace },
    { href: '/docs/', label: dict.nav.docs },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
        <div className="flex items-center gap-4 sm:gap-6">
          <Link href={localePath(locale, "/")} className="flex items-center gap-2 shrink-0">
            <Image src={`${BASE_PATH}/logo.png`} alt="" width={28} height={28} className="rounded-md" />
            <span className="text-md font-semibold tracking-tight text-txt">koris</span>
          </Link>

          <div className="flex items-center gap-3 sm:gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={localePath(locale, link.href)}
                className="whitespace-nowrap text-sm font-medium text-muted transition-colors hover:text-txt sm:text-md"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <a
          href={REPO_URL}
          target="_blank"
          rel="noopener"
          className="shrink-0 rounded-lg border border-border bg-bg-subtle px-3 py-1.5 text-sm font-semibold text-txt transition-colors hover:border-accent sm:px-4 sm:py-2 sm:text-md"
        >
          {dict.nav.github}
        </a>
      </nav>
    </header>
  );
}
