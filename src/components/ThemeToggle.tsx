'use client';

import { useEffect, useState } from 'react';
import { SunIcon, MoonIcon } from '@/components/icons';

export function ThemeToggle() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const isLight =
      document.documentElement.classList.contains('light') ||
      document.documentElement.getAttribute('data-theme') === 'light';
    setTheme(isLight ? 'light' : 'dark');
  }, []);

  const applyTheme = (next: 'dark' | 'light') => {
    setTheme(next);
    const root = document.documentElement;
    if (next === 'light') {
      root.classList.add('light');
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
    } else {
      root.classList.add('dark');
      root.classList.remove('light');
      root.setAttribute('data-theme', 'dark');
    }
    try {
      localStorage.setItem('koris-theme', next);
    } catch {
      // ignore storage errors
    }
  };

  return (
    <div
      role="group"
      aria-label="Theme toggle"
      className="inline-flex h-8 items-center rounded-full border border-border bg-bg-subtle p-0.5 transition-colors hover:border-accent/40"
    >
      <button
        type="button"
        onClick={() => applyTheme('light')}
        title="Light mode"
        aria-label="Light mode"
        aria-pressed={mounted ? theme === 'light' : false}
        className={`flex h-6 w-6 items-center justify-center rounded-full transition-all duration-150 ${
          mounted && theme === 'light'
            ? 'bg-accent text-bg shadow-sm'
            : 'text-muted hover:text-txt'
        }`}
      >
        <SunIcon className="size-3.5" />
      </button>
      <button
        type="button"
        onClick={() => applyTheme('dark')}
        title="Dark mode"
        aria-label="Dark mode"
        aria-pressed={mounted ? theme === 'dark' : true}
        className={`flex h-6 w-6 items-center justify-center rounded-full transition-all duration-150 ${
          mounted && theme === 'dark'
            ? 'bg-accent text-bg shadow-sm'
            : 'text-muted hover:text-txt'
        }`}
      >
        <MoonIcon className="size-3.5" />
      </button>
    </div>
  );
}
