'use client';

import { useState } from 'react';
import type { Dictionary } from '@/i18n';
import type { Locale } from '@/i18n/locales';
import { Markdown } from '@/components/Markdown';
import { askDocs, type AskResult } from '@/lib/ask-jev';

function AskDocsItem({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(false);
  const [result, setResult] = useState<AskResult | null>(null);

  const canSubmit = question.trim().length > 0 && !pending;

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    const text = question.trim();
    if (!text || pending) return;

    setPending(true);
    setError(false);
    setResult(null);

    const answer = await askDocs(text, locale);
    setPending(false);
    if (!answer) {
      setError(true);
      return;
    }
    setResult(answer);
  }

  const covered = result?.covered ?? null;
  const confidence = result?.confidence ?? null;
  const docsHref = locale === 'en' ? '/docs/' : `/${locale}/docs/`;

  return (
    <div className="transition-colors hover:bg-bg-subtle/30">
      <h3>
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          className="flex w-full items-center justify-between gap-4 p-5 text-left text-base font-medium text-txt transition-colors sm:p-6 sm:text-lg"
        >
          <span className="flex items-center gap-2">
            {dict.faq.askQ}
            <span className="rounded-full border border-accent/40 bg-accent/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-accent">
              Jev
            </span>
          </span>
          <span
            className={`flex size-7 shrink-0 items-center justify-center rounded-full border border-border/80 bg-bg-subtle transition-transform duration-200 ${
              open ? 'rotate-45 border-accent text-accent' : 'text-muted'
            }`}
          >
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
              className="size-4"
            >
              <path d="M5 12h14" />
              <path d="M12 5v14" />
            </svg>
          </span>
        </button>
      </h3>

      {open && (
        <div className="px-5 pb-6 sm:px-6">
          <p className="mb-4 text-sm leading-relaxed text-muted">{dict.faq.askHint}</p>

          <form onSubmit={submit} className="flex flex-col gap-2 sm:flex-row">
            <input
              type="text"
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              placeholder={dict.faq.askPlaceholder}
              aria-label={dict.faq.askPlaceholder}
              maxLength={500}
              className="min-w-0 flex-1 rounded-xl border border-border/80 bg-bg-subtle px-4 py-2.5 text-sm text-txt outline-none transition-colors placeholder:text-muted focus:border-accent"
            />
            <button
              type="submit"
              disabled={!canSubmit}
              className="shrink-0 rounded-xl border border-accent bg-accent px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:enabled:opacity-90 disabled:cursor-default disabled:opacity-40"
            >
              {pending ? dict.faq.askLoading : dict.faq.askSubmit}
            </button>
          </form>

          {error && <p className="mt-4 text-sm text-amber-400">{dict.faq.askError}</p>}

          {result && (
            <div className="mt-8 animate-in fade-in duration-300">
              {covered !== null && covered < 0.5 && (
                <p className="mb-4 text-sm text-amber-400">{dict.faq.askNotCovered}</p>
              )}

              {result.topic ? (
                <div className="rounded-xl border border-border/80 bg-bg-subtle/60 p-5">
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                    <h4 className="text-base font-semibold text-txt">{result.topic.title}</h4>
                    {confidence !== null && (
                      <span className="flex items-center gap-2 font-mono text-[11px] text-muted">
                        <span className="h-1 w-20 overflow-hidden rounded-full bg-border">
                          <span
                            className="block h-full rounded-full bg-accent transition-all duration-500"
                            style={{ width: `${Math.round(confidence * 100)}%` }}
                          />
                        </span>
                        {Math.round(confidence * 100)}% {dict.faq.askConfidence}
                      </span>
                    )}
                  </div>

                  <Markdown>{result.topic.excerpt}</Markdown>

                  <a
                    href={result.topic.url}
                    className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline"
                  >
                    {dict.faq.askReadDoc} →
                  </a>
                </div>
              ) : (
                <a
                  href={docsHref}
                  className="inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline"
                >
                  {dict.faq.askReadDoc} →
                </a>
              )}

              <p className="mt-4 font-mono text-[10px] uppercase tracking-wider text-muted/70">
                {dict.faq.askPoweredBy}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function Faq({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const items = [
    { q: dict.faq.q1, a: dict.faq.a1 },
    { q: dict.faq.q2, a: dict.faq.a2 },
    { q: dict.faq.q3, a: dict.faq.a3 },
    { q: dict.faq.q4, a: dict.faq.a4 },
    { q: dict.faq.q5, a: dict.faq.a5 },
  ];

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="mt-24 scroll-mt-20 px-4 sm:px-6">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-bg-subtle/80 px-3 py-1 text-xs font-mono font-medium text-accent mb-3">
          {dict.faq.tag}
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-txt">
          {dict.faq.title}
        </h2>
        <p className="mt-3 text-muted text-base sm:text-lg leading-relaxed">
          {dict.faq.subtitle}
        </p>
      </div>

      <div className="mx-auto max-w-3xl divide-y divide-border/60 rounded-2xl border border-border/80 bg-card overflow-hidden">
        {items.map((item, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div key={idx} className="transition-colors hover:bg-bg-subtle/30">
              <h3>
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 p-5 sm:p-6 text-left text-base sm:text-lg font-medium text-txt transition-colors"
                >
                  <span>{item.q}</span>
                  <span
                    className={`flex size-7 shrink-0 items-center justify-center rounded-full border border-border/80 bg-bg-subtle transition-transform duration-200 ${
                      isOpen ? 'rotate-45 border-accent text-accent' : 'text-muted'
                    }`}
                  >
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
                      className="size-4"
                    >
                      <path d="M5 12h14" />
                      <path d="M12 5v14" />
                    </svg>
                  </span>
                </button>
              </h3>
              {isOpen && (
                <div className="px-5 pb-6 sm:px-6 text-sm sm:text-base leading-relaxed text-muted animate-in fade-in duration-200">
                  {item.a}
                </div>
              )}
            </div>
          );
        })}

        <AskDocsItem dict={dict} locale={locale} />
      </div>
    </section>
  );
}
