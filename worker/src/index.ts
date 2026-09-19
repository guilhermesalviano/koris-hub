import { DOC_TOPICS, type DocLocale, type DocTopic } from './doc-topics.generated';

/**
 * Public proxy between the static hub site and the TypeSafe Jev API.
 *
 * The API key lives here as a Worker secret, never in the browser. The Worker
 * owns the question template and only routes over the docs topics baked into
 * `doc-topics.generated.ts`, so the endpoint cannot be used as a general
 * Jev proxy. Jev selects the best-matching documentation page and reports
 * coverage; the page's excerpt (also baked in) is what the widget renders.
 */

interface Env {
  TYPESAFE_API_KEY: string;
  TYPESAFE_API_BASE?: string;
}

const MODEL = 'jev-latest';
const DEFAULT_API_BASE = 'https://api.typesafe.ai';
const MAX_QUESTION_CHARS = 500;
const REQUEST_TIMEOUT_MS = 30_000;
const MAX_ATTEMPTS = 3;

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 10;

const ALLOWED_ORIGINS = new Set([
  'https://hub.koaris.com',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
]);

/** Sliding-window limiter, best-effort per isolate. */
const hits = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((at) => now - at < RATE_LIMIT_WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);

  if (hits.size > 5_000) {
    for (const [key, times] of hits) {
      if (times.every((at) => now - at >= RATE_LIMIT_WINDOW_MS)) hits.delete(key);
    }
  }

  return recent.length > RATE_LIMIT_MAX;
}

function corsHeaders(origin: string | null): Record<string, string> {
  const allowed = origin && ALLOWED_ORIGINS.has(origin) ? origin : '';
  return {
    'Access-Control-Allow-Origin': allowed,
    Vary: 'Origin',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
  };
}

function json(data: unknown, status: number, headers: Record<string, string>): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...headers, 'Content-Type': 'application/json; charset=utf-8' },
  });
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

interface ChoiceAnswer {
  type: 'choice';
  choice: string;
  probabilities?: Record<string, number>;
  confidence?: number;
}

interface NoulAnswer {
  type: 'noul';
  noul: number;
}

interface TypeSafeResponse {
  model: string;
  answers?: {
    topic?: ChoiceAnswer;
    covered?: NoulAnswer;
  };
  usage?: { input_tokens: number; output_tokens: number };
}

class UpstreamError extends Error {
  constructor(readonly status: number) {
    super(`TypeSafe responded ${status}`);
  }
}

function buildRequest(question: string, locale: DocLocale) {
  const topics = DOC_TOPICS[locale] ?? DOC_TOPICS.en;
  const criteria = Object.fromEntries(topics.map((topic) => [topic.slug, `${topic.title}: ${topic.summary}`]));

  return {
    model: MODEL,
    state: {
      user_question: question,
      documentation_index: topics.map((topic) => ({ section: topic.title, about: topic.summary })),
    },
    questions: {
      topic: {
        type: 'choice',
        instructions: 'Which documentation section best answers user_question? Pick the single most relevant section.',
        criteria,
      },
      covered: {
        type: 'noul',
        instructions: 'user_question is answerable using the documentation_index.',
        criteria: {
          true: 'The documentation covers this question',
          false: 'The documentation does not cover this question',
        },
      },
    },
  };
}

async function callTypeSafe(env: Env, payload: unknown): Promise<TypeSafeResponse> {
  const base = env.TYPESAFE_API_BASE || DEFAULT_API_BASE;
  let status = 0;

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt += 1) {
    if (attempt > 0) await sleep(300 * 2 ** attempt);

    const response = await fetch(`${base}/v1/systemone`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.TYPESAFE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });

    if (response.ok) return (await response.json()) as TypeSafeResponse;

    status = response.status;
    if (status !== 429 && status !== 529) break;
  }

  throw new UpstreamError(status);
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const origin = request.headers.get('Origin');
    const headers = corsHeaders(origin);

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers });
    }

    const url = new URL(request.url);

    if (request.method === 'GET' && url.pathname === '/health') {
      return json({ ok: true }, 200, headers);
    }

    if (request.method !== 'POST' || url.pathname !== '/ask') {
      return json({ error: 'not_found' }, 404, headers);
    }

    if (origin && !ALLOWED_ORIGINS.has(origin)) {
      return json({ error: 'forbidden' }, 403, headers);
    }

    if (!env.TYPESAFE_API_KEY) {
      return json({ error: 'unconfigured' }, 500, headers);
    }

    const ip = request.headers.get('CF-Connecting-IP') ?? 'unknown';
    if (isRateLimited(ip)) {
      return json({ error: 'rate_limited' }, 429, headers);
    }

    let body: { question?: unknown; locale?: unknown };
    try {
      body = (await request.json()) as typeof body;
    } catch {
      return json({ error: 'invalid_json' }, 400, headers);
    }

    const question = typeof body.question === 'string' ? body.question.trim() : '';
    if (!question) {
      return json({ error: 'empty_question' }, 400, headers);
    }
    if (question.length > MAX_QUESTION_CHARS) {
      return json({ error: 'question_too_long' }, 413, headers);
    }

    const locale: DocLocale = body.locale === 'pt-br' ? 'pt-br' : 'en';
    const topics = DOC_TOPICS[locale] ?? DOC_TOPICS.en;

    try {
      const result = await callTypeSafe(env, buildRequest(question, locale));
      const answer = result.answers?.topic;
      const chosen: DocTopic | null = answer?.choice
        ? (topics.find((topic) => topic.slug === answer.choice) ?? null)
        : null;

      return json(
        {
          model: result.model,
          topic: chosen,
          covered: result.answers?.covered?.noul ?? null,
          probabilities: answer?.probabilities ?? null,
          confidence: answer?.confidence ?? null,
          usage: result.usage ?? null,
        },
        200,
        headers,
      );
    } catch (error) {
      if (error instanceof UpstreamError) {
        if (error.status === 429) return json({ error: 'upstream_rate_limited' }, 429, headers);
        if (error.status === 529) return json({ error: 'overloaded' }, 503, headers);
        return json({ error: 'upstream_error' }, 502, headers);
      }
      if (error instanceof DOMException && error.name === 'TimeoutError') {
        return json({ error: 'timeout' }, 504, headers);
      }
      return json({ error: 'unexpected' }, 500, headers);
    }
  },
};
