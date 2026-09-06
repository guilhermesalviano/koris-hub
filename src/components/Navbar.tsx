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
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <div className="flex gap-6">
          <Link href={localePath(locale, "/")} className="flex items-center gap-2">
            <Image src={`${BASE_PATH}/logo.png`} alt="" width={28} height={28} className="rounded-md" />
            <span className="text-md font-semibold tracking-tight text-txt">koris</span>
          </Link>

          <div className="hidden items-center gap-4 sm:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={localePath(locale, link.href)}
                className="text-md text-muted transition-colors hover:text-txt"
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
          className="rounded-lg border border-border bg-bg-subtle px-4 py-2 text-md font-semibold text-txt transition-colors hover:border-accent"
        >
          {dict.nav.github}
        </a>
      </nav>
    </header>
  );
}
