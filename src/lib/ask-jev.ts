import type { Locale } from '@/i18n/locales';
import { ASK_API_URL } from './constants';

export interface AskTopic {
  slug: string;
  title: string;
  url: string;
  summary: string;
  excerpt: string;
}

export interface AskResult {
  topic: AskTopic | null;
  /** Jev's probability (0–1) that the docs cover the question. */
  covered: number | null;
  /** Confidence in the chosen topic, when the model returns one. */
  confidence: number | null;
  model: string;
}

/**
 * Ask the docs through the Cloudflare Worker. Jev routes the question to the
 * best-matching documentation page; the returned `topic.excerpt` is rendered as
 * the answer. Returns `null` on any failure so the widget can show its error
 * state without leaking upstream details.
 */
export async function askDocs(question: string, locale: Locale): Promise<AskResult | null> {
  try {
    const res = await fetch(ASK_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, locale }),
    });

    if (!res.ok) {
      console.warn('[ask-jev] request failed:', res.status);
      return null;
    }

    return (await res.json()) as AskResult;
  } catch (err) {
    console.warn('[ask-jev] request error:', err);
    return null;
  }
}
