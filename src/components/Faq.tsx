'use client';

import { useState } from 'react';
import type { Dictionary } from '@/i18n';

export function Faq({ dict }: { dict: Dictionary }) {
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
    <section id="faq" className="mt-24 scroll-mt-20">
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
      </div>
    </section>
  );
}
