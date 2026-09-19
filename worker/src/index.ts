import { DOC_TOPICS, type DocLocale, type DocTopic } from './doc-topics.generated';

/**
 * Public proxy between the static hub site and the TypeSafe Jev API.
 *
 * The API key lives here as a Worker secret, never in the browser. The Worker
 * owns the question template and only routes over the docs topics baked into
 * `doc-topics.generated.ts`, so the endpoint cannot be used as a general
 * Jev proxy. Jev answers the user's request yes/no and selects the
 * best-matching documentation page; the page's excerpt (also baked in) is the
 * argument the widget renders beneath the answer.
 */

interface Env {
  TYPESAFE_API_KEY: string;
  TYPESAFE_API_BASE?: string;
  ASSETS?: {
    fetch(request: Request | string): Promise<Response>;
  };
}

const MODEL = 'jev-latest';
const DEFAULT_API_BASE = 'https://api.typesafe.ai';
const MAX_QUESTION_CHARS = 500;
const REQUEST_TIMEOUT_MS = 30_000;
const MAX_ATTEMPTS = 3;

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 10;

const MAX_BODY_BYTES = 64 * 1024; // 64 KB

const SECURITY_HEADERS: Record<string, string> = {
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https://avatars.githubusercontent.com https://raw.githubusercontent.com",
    "font-src 'self' data:",
    "connect-src 'self' https://api.typesafe.ai",
    "frame-ancestors 'none'",
  ].join('; '),
};

function applySecurityHeaders(res: Response): Response {
  const newHeaders = new Headers(res.headers);
  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    if (!newHeaders.has(key)) {
      newHeaders.set(key, value);
    }
  }
  return new Response(res.body, {
    status: res.status,
    statusText: res.statusText,
    headers: newHeaders,
  });
}

function isLocalHostname(hostname: string): boolean {
  const clean = hostname.replace(/^\[|\]$/g, '');
  return (
    clean === 'localhost' ||
    clean === '127.0.0.1' ||
    clean === '::1' ||
    clean.endsWith('.localhost') ||
    /^192\.168\.\d{1,3}\.\d{1,3}$/.test(clean) ||
    /^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(clean) ||
    /^172\.(1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3}$/.test(clean)
  );
}

function isOriginAllowed(origin: string | null, requestUrl: URL): boolean {
  if (!origin) return true;

  try {
    const originUrl = new URL(origin);

    // 1. Production custom domain
    if (originUrl.origin === 'https://imkoris.com') return true;

    // 2. Same-host matching (e.g. preview branches or *.workers.dev)
    if (originUrl.hostname === requestUrl.hostname) return true;

    // 3. Local development (both destination and origin are local/LAN)
    if (isLocalHostname(requestUrl.hostname) && isLocalHostname(originUrl.hostname)) {
      return true;
    }
  } catch {
    return false;
  }

  return false;
}

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

function corsHeaders(origin: string | null, requestUrl: URL): Record<string, string> {
  const allowed = origin && isOriginAllowed(origin, requestUrl) ? origin : '';
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
    answer?: NoulAnswer;
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
        instructions:
          'Which documentation section is the strongest argument for the answer to user_question? Pick the single most relevant section.',
        criteria,
      },
      answer: {
        type: 'noul',
        instructions:
          'Answer user_question with yes or no, using only the documentation_index. If user_question is a yes/no question, decide it directly; if it is open-ended, answer "yes" when the documentation explains it and "no" when it does not.',
        criteria: {
          true: 'The documentation supports a yes answer',
          false: 'The documentation supports a no answer, or does not cover the question',
        },
      },
    },
  };
}

export function buildResponseMessage(
  topic: DocTopic | null,
  answer: number | null,
  confidence: number | null,
  locale: DocLocale,
): string {
  const isPtBr = locale === 'pt-br';

  if (!topic || answer === null) {
    return isPtBr
      ? 'A documentação ainda não parece cobrir essa pergunta.'
      : 'The documentation does not seem to cover this question yet.';
  }

  const isYes = answer >= 0.5;
  const isConfident = confidence === null || confidence >= 0.5;

  if (isYes) {
    return isPtBr
      ? `Sim. De acordo com "${topic.title}", isso é suportado: ${topic.summary}`
      : `Yes. According to "${topic.title}", this is supported: ${topic.summary}`;
  }

  if (isConfident) {
    return isPtBr
      ? `Não. De acordo com "${topic.title}", isso não é suportado: ${topic.summary}`
      : `No. According to "${topic.title}", this is not supported: ${topic.summary}`;
  }

  return isPtBr
    ? `A documentação não parece cobrir isso diretamente. Você pode conferir "${topic.title}" para detalhes relacionados.`
    : `The documentation does not seem to cover this directly. You can review "${topic.title}" for related details.`;
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

async function handleFetch(request: Request, env: Env): Promise<Response> {
  const origin = request.headers.get('Origin');
  const url = new URL(request.url);
  const headers = corsHeaders(origin, url);
  const pathname = url.pathname.replace(/\/+$/, '') || '/';

  if (request.method === 'GET' && (pathname === '/health' || pathname === '/api/health')) {
    return json({ ok: true }, 200, headers);
  }

  const isAskEndpoint = pathname === '/ask' || pathname === '/api/ask';

  if (request.method === 'OPTIONS' && isAskEndpoint) {
    return new Response(null, { status: 204, headers });
  }

  if (!isAskEndpoint) {
    if (env.ASSETS) {
      return env.ASSETS.fetch(request);
    }
    return json({ error: 'not_found' }, 404, headers);
  }

  if (request.method !== 'POST') {
    return json({ error: 'method_not_allowed' }, 405, headers);
  }

  if (origin && !isOriginAllowed(origin, url)) {
    return json({ error: 'forbidden' }, 403, headers);
  }

  if (!env.TYPESAFE_API_KEY) {
    return json({ error: 'unconfigured' }, 500, headers);
  }

  const ip = request.headers.get('CF-Connecting-IP') ?? 'unknown';
  if (isRateLimited(ip)) {
    return json({ error: 'rate_limited' }, 429, headers);
  }

  const contentLength = request.headers.get('content-length');
  if (contentLength && parseInt(contentLength, 10) > MAX_BODY_BYTES) {
    return json({ error: 'payload_too_large' }, 413, headers);
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
    const chosenAnswer = result.answers?.answer?.noul ?? null;
    const confidence = answer?.confidence ?? null;
    const message = buildResponseMessage(chosen, chosenAnswer, confidence, locale);

    return json(
      {
        model: result.model,
        topic: chosen,
        answer: chosenAnswer,
        message,
        probabilities: answer?.probabilities ?? null,
        confidence,
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
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const response = await handleFetch(request, env);
    return applySecurityHeaders(response);
  },
};

