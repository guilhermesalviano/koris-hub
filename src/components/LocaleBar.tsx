import { LanguageSwitcher } from '@/components/LanguageSwitcher';

/**
 * Site-wide locale strip, rendered by the root layout so the switcher is
 * reachable from every page. The homepage's richer Footer (download CTA, ISC
 * badge) sits above this and is deliberately left alone — it renders only there.
 */
export function LocaleBar({ label }: { label: string }) {
  return (
    <div className="border-t border-border">
      <div className="mx-auto flex max-w-5xl justify-center px-6 py-6">
        <LanguageSwitcher label={label} />
      </div>
    </div>
  );
}
