---
title: Admin Dashboard
order: 12
---

# Admin Dashboard

Koris ships a browser dashboard for chatting with the agent and managing its configuration.

## What serves it

The UI is a React 19 single-page app (Vite, React Router, Tailwind) in `apps/web/`. The server
side is an Express app in `core/src/dashboard/` listening on port 3000; it serves the built
bundle from `dist-web/` and falls back to `index.html` for any unmatched route so the SPA owns
routing. Opening `/` redirects to `/admin`, which lands on the chat view.

## Navigation

The left nav links to:

- **Overview** (`/admin/overview`) — status at a glance.
- **Memories** (`/admin/memories`) — the long-term `memories` rows.
- **Beats** (`/admin/heartbeats`) — create, update, and delete scheduled beats; cron
  expressions are validated on save.
- **Skills** (`/admin/skills`) — the merged list of skills on disk and in the database;
  enable or disable each one, or trigger a manual sync.
- **Queue** (`/admin/queue`) — the provider and sub-agent queue state.
- **Audit** (`/admin/audit`) — the token-usage and call audit log.

A chats panel lists your sessions; each opens at `/admin/chat/<sessionId>`, and starting a new
chat goes to `/admin/chat`.

## Chat

Prior history is hydrated from the admin API. Replies stream over Server-Sent Events from
`/api/chat`, which accepts an optional `sessionId` to target a specific session. A context bar
shows the session's estimated token usage against the manager's `num_ctx`.

## Settings

Configuration lives in a modal with four tabs:

- **Providers** — the provider catalogue with a test-connection button. Activating a provider
  for a role writes a partial settings patch, so switching one role never drops another
  provider's credentials. See [AI providers](/docs/ai-providers).
- **Channels** — per-channel settings and the unlisted-sender trust toggle. See
  [channels](/docs/channels).
- **Sessions** — session-level options such as the summarizer mode.
- **General** — everything else.

Secrets in settings responses are deep-masked. A separate Plugins modal lists every tool and
channel plugin with a live on/off toggle; see [tools](/docs/tools) and [plugins](/docs/plugins).

## First run

With no `koris.json`, the first visit opens a setup wizard at `/setup` that walks through
providers, channels, and a plugins step before writing the initial config.

## API and dev workflow

The admin API is mounted at `/api/admin`. `POST /api/admin/sessions` creates a new session
without ending the current one.

- `pnpm dev:client` — Vite dev server on port 5173, proxying `/api` and `/health` to
  `localhost:3000`.
- `pnpm build:client` — build the frontend into `dist-web/`.
- `pnpm lint:client` — type-check `apps/web/`.
