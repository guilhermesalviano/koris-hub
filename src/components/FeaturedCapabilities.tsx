import Link from 'next/link';
import type { Dictionary, Locale } from '@/i18n';
import { localePath } from '@/i18n/locales';

export function FeaturedCapabilities({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const cards = [
    {
      title: dict.featured.cardChannelsTitle,
      description: dict.featured.cardChannelsDesc,
      badge: dict.featured.cardChannelsBadge,
      href: localePath(locale, '/docs/channels/'),
      preview: (
        <div className="flex flex-col gap-2.5">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="inline-flex items-center gap-1.5 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[11px] font-mono font-medium text-emerald-400">
              <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Telegram
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[11px] font-mono font-medium text-emerald-400">
              <span className="size-1.5 rounded-full bg-emerald-400" />
              WhatsApp
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-md border border-border bg-bg-subtle px-2 py-0.5 text-[11px] font-mono font-medium text-muted">
              Web UI
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-md border border-border bg-bg-subtle px-2 py-0.5 text-[11px] font-mono font-medium text-muted">
              CLI
            </span>
          </div>
          <div className="rounded-lg border border-border/60 bg-bg px-3 py-2 text-xs font-mono text-txt/90 shadow-sm flex items-center justify-between">
            <span className="text-muted">telegram://bot &rarr; dispatch()</span>
            <span className="text-[10px] text-accent font-semibold">sync active</span>
          </div>
        </div>
      ),
    },
    {
      title: dict.featured.cardMemoryTitle,
      description: dict.featured.cardMemoryDesc,
      badge: dict.featured.cardMemoryBadge,
      href: localePath(locale, '/docs/'),
      preview: (
        <div className="flex flex-col gap-2 font-mono text-xs">
          <div className="flex items-center justify-between text-[11px] text-muted border-b border-border/40 pb-1.5">
            <span className="text-accent font-semibold">sqlite3 // koris.db</span>
            <span className="text-emerald-400">0.3ms latency</span>
          </div>
          <div className="text-txt/80 rounded bg-bg px-2.5 py-1.5 border border-border/60 text-[11px]">
            <span className="text-muted">SELECT</span> context <span className="text-muted">FROM</span> memories{' '}
            <span className="text-muted">WHERE</span> user_id = ?
          </div>
        </div>
      ),
    },
    {
      title: dict.featured.cardSkillsTitle,
      description: dict.featured.cardSkillsDesc,
      badge: dict.featured.cardSkillsBadge,
      href: localePath(locale, '/docs/skills/'),
      preview: (
        <div className="flex flex-col gap-1 rounded bg-bg p-2.5 border border-border/60 font-mono text-[11px]">
          <div className="text-accent">---</div>
          <div><span className="text-muted">name:</span> weather-forecast</div>
          <div><span className="text-muted">read_when:</span> user asks about forecast</div>
          <div className="text-accent">---</div>
        </div>
      ),
    },
    {
      title: dict.featured.cardSecurityTitle,
      description: dict.featured.cardSecurityDesc,
      badge: dict.featured.cardSecurityBadge,
      href: localePath(locale, '/docs/'),
      preview: (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-medium text-txt/90">Egress Sandbox</span>
            <span className="rounded bg-accent/15 px-1.5 py-0.5 text-[10px] font-mono text-accent">Strict</span>
          </div>
          <div className="rounded bg-bg px-2.5 py-1.5 border border-border/60 font-mono text-[11px] text-muted flex items-center gap-1.5">
            <span className="text-emerald-400">✓</span> allow: [&quot;api.github.com&quot;, &quot;wttr.in&quot;]
          </div>
        </div>
      ),
    },
  ];

  return (
    <section className="mt-24 scroll-mt-20 px-4 sm:px-6">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-bg-subtle/80 px-3 py-1 text-xs font-mono font-medium text-accent mb-3">
          {dict.featured.tag}
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-txt">
          {dict.featured.title}
        </h2>
        <p className="mt-3 text-muted text-base sm:text-lg leading-relaxed">
          {dict.featured.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cards.map((card, idx) => (
          <Link
            key={idx}
            href={card.href}
            className="group relative flex flex-col justify-between rounded-2xl border border-border/80 bg-card p-6 transition-all duration-300 hover:border-accent/50 hover:shadow-xl hover:shadow-accent/5 hover:-translate-y-0.5"
          >
            <div>
              {/* Preview container matching ObsidianUI card preview */}
              <div className="relative mb-5 min-h-[120px] rounded-xl border border-border/50 bg-bg-subtle/50 p-4 flex flex-col justify-center">
                <span className="absolute top-2.5 right-2.5 rounded-md border border-border/80 bg-bg/80 px-2 py-0.5 text-[10px] font-mono text-muted">
                  {card.badge}
                </span>
                {card.preview}
              </div>

              <h3 className="text-xl font-bold text-txt group-hover:text-accent transition-colors">
                {card.title}
              </h3>
              <p className="mt-2 text-sm text-muted leading-relaxed">
                {card.description}
              </p>
            </div>

            {/* Bottom action row with circular arrow button (ObsidianUI reference) */}
            <div className="mt-6 flex items-center justify-between border-t border-border/40 pt-4">
              <span className="text-xs font-medium text-muted group-hover:text-txt transition-colors">
                {dict.featured.exploreDoc}
              </span>
              <span className="p-2 rounded-full bg-bg-subtle text-muted group-hover:bg-accent group-hover:text-bg transition-colors duration-200">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-4 h-4"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
