---
title: AI Providers
order: 6
---

# AI Providers

Koris talks to language models through a small set of provider implementations. You pick
which provider serves each role in `koris.json`; the framework resolves the model, context
window, and credentials from there.

## Available providers

- **Ollama** — native client against a local `/api/chat` endpoint. Sends the context window
  as `options.num_ctx`.
- **Mock** — an echo provider used for tests. It is forced automatically under Vitest and is
  the fallback when a provider name is not recognised.
- **OpenAI-compatible** — one generic Chat Completions client parameterised by a preset. The
  presets are `openai`, `openrouter`, `deepseek`, `groq`, `xai`, `mistral`, `together`,
  `gemini`, and `nvidia`. Each preset carries a default base URL and, for most, a recommended
  model and links to the vendor's key and model pages. This client sends the context window
  as the request `max_tokens`.

## The `ai` block in `koris.json`

Every configured provider lives once in `ai.providers[]`. An entry is
`{ provider, base_url, api_token, num_ctx?, model }` — one model per provider, and the
`provider` name is the unique key for the entry.

```json
{
  "ai": {
    "providers": [
      {
        "provider": "ollama",
        "base_url": "http://localhost:11434",
        "api_token": "PROVIDER_API_TOKEN",
        "num_ctx": 16384,
        "model": "gemma4:e4b-it-q4_K_M"
      }
    ],
    "roles": {
      "manager": { "provider": "ollama" },
      "workers": { "provider": "ollama" }
    },
    "embed": { "enabled": true, "provider": "ollama", "model": "nomic-embed-text" }
  }
}
```

### Roles

`ai.roles.<role>` is just `{ provider }`, pointing at one entry in `ai.providers[]`. The model
is resolved from that entry, not repeated on the pointer.

- `ai.roles.manager` — the main agent that answers you.
- `ai.roles.workers` — the executor workers, the summarizer sub-agent, and the heartbeat
  sub-agent.

You can point both roles at the same provider, or split them — for example a large model for
the manager and a cheaper one for the workers.

### Context window

`num_ctx` defaults to `16384` when omitted. The OpenAI-compatible client sends it as the
request `max_tokens`; the Ollama client sends it as `options.num_ctx`. If `base_url` is left
empty, the provider falls back to its shipped default URL.

### Embeddings

`ai.embed` is a separate pointer, `{ enabled, provider, model }`. Its `base_url` and
`api_token` are reused from the matching `ai.providers[]` entry, but the `model` stays on the
pointer because the embedding model differs from the chat model.

Some providers have no `/embeddings` endpoint — `groq` and `xai`, for example — and their
`embed()` call throws. The callers catch that and warn rather than fail, so semantic memory
silently degrades to no embeddings. If you rely on semantic recall, point `ai.embed` at an
embeddings-capable provider. See [Concepts](/docs/concepts) for how memory uses embeddings.

### No migration from older layouts

This is the only `ai` shape Koris understands. There is no auto-migration from earlier
layouts — if the file drifts, regenerate the `ai` block from `koris.example.json`.

## Errors and retries

Provider error strings keep a `(NNN)` status token or a recognised keyword. Koris classifies
them into `aborted`, `timeout`, `authentication`, `rate_limited`, `unavailable`,
`malformed_response`, `context_length`, or `unknown`, and retries the ones worth retrying.

A `context_length` error while the session is in manual summarizer mode makes the gateway
auto-compact, rotate to a fresh session seeded with the summary, and retry the turn once. See
[Concepts](/docs/concepts) for session compaction.

## Call ordering

Two independent flags control how LLM calls are scheduled.

- `ai.parallel` — provider level. Default `true` runs LLM calls concurrently. Set it `false`
  to funnel every call through one shared slot, where interactive calls (the manager and the
  executor workers) go ahead of background calls (the summarizer and heartbeat), and
  background work waits out a short grace period after the last interactive call.
- `ai.subagents_parallel` — sub-agent level, independent of the above. Default `false` makes
  the heartbeat and summarizer share a single queue so they never run at the same time. Set
  it `true` to give each its own queue.

Neither the heartbeat nor the summarizer ever runs its own tasks concurrently, regardless of
these flags.

## Adding a provider

- **OpenAI-compatible service** — add one row to `openai-compatible/presets.ts`.
- **Native provider** — create `core/src/services/providers/<name>/index.ts` exporting
  `providerManifest()`, then add it to the array in `core/src/services/providers/index.ts`.

Onboarding, the setup wizard, the Providers page, and the connectivity checks all read the
manifest registry, so a new provider shows up in all of them without further wiring. See the
[Admin dashboard](/docs/admin-dashboard) for the Providers page.
