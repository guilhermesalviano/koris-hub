import type { Dictionary } from '@/i18n';

export function Testimonials({ dict }: { dict: Dictionary }) {
  const items = [
    {
      quote: dict.testimonials.q1Text,
      author: dict.testimonials.q1Author,
      role: dict.testimonials.q1Role,
      avatar: dict.testimonials.q1Avatar,
    },
    {
      quote: dict.testimonials.q2Text,
      author: dict.testimonials.q2Author,
      role: dict.testimonials.q2Role,
      avatar: dict.testimonials.q2Avatar,
    },
    {
      quote: dict.testimonials.q3Text,
      author: dict.testimonials.q3Author,
      role: dict.testimonials.q3Role,
      avatar: dict.testimonials.q3Avatar,
    },
    {
      quote: dict.testimonials.q4Text,
      author: dict.testimonials.q4Author,
      role: dict.testimonials.q4Role,
      avatar: dict.testimonials.q4Avatar,
    },
  ];

  return (
    <section className="mt-24 scroll-mt-20">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-bg-subtle/80 px-3 py-1 text-xs font-mono font-medium text-accent mb-3">
          {dict.testimonials.tag}
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-txt">
          {dict.testimonials.title}
        </h2>
        <p className="mt-3 text-muted text-base sm:text-lg leading-relaxed">
          {dict.testimonials.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {items.map((item, idx) => (
          <div
            key={idx}
            className="flex flex-col justify-between rounded-2xl border border-border/80 bg-card p-6 sm:p-7 transition-all duration-300 hover:border-accent/40 hover:shadow-xl hover:shadow-accent/5 hover:-translate-y-0.5"
          >
            <blockquote className="text-sm sm:text-base text-txt/90 leading-relaxed font-normal">
              &ldquo;{item.quote}&rdquo;
            </blockquote>

            <figcaption className="mt-6 flex items-center gap-3 border-t border-border/40 pt-4">
              <span className="size-9 rounded-full bg-bg-subtle border border-border/80 flex items-center justify-center font-mono text-xs font-semibold text-accent shrink-0">
                {item.avatar}
              </span>
              <div className="min-w-0 text-sm">
                <p className="font-semibold text-txt truncate">{item.author}</p>
                <p className="text-xs text-muted truncate">{item.role}</p>
              </div>
            </figcaption>
          </div>
        ))}
      </div>
    </section>
  );
}
