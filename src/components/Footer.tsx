import { DownloadButton } from '@/components/DownloadButton';
import type { Dictionary } from '@/i18n';

export function Footer({ dict }: { dict: Dictionary }) {
  return (
    <div className="mt-24 border-t border-border pt-12 text-center">
      <DownloadButton dict={dict} className="inline-block rounded-lg bg-accent px-12 py-4 text-sm font-semibold text-bg transition-transform hover:-translate-y-0.5" />
      <span className="ml-3 inline-block rounded-md bg-bg-subtle px-4 py-2 text-xs text-muted">
        {dict.footer.license}
      </span>

      <footer className="mt-16 pb-12 text-sm text-muted">
        {dict.footer.builtBy}
      </footer>
    </div>
  );
}
