---
title: Getting Started
order: 3
---

# Getting Started

Koris is an autonomous AI-agent framework written in TypeScript. It receives messages
through pluggable channels (Telegram, WhatsApp, a terminal UI, and a web dashboard),
runs them through an LLM, and can execute tools on your behalf. State lives in a local
SQLite database, so memory and sessions persist across restarts.

## Requirements

- Node.js >= 24
- `pnpm` — the repo is a single-package pnpm workspace. Never use `npm` or `yarn`.

## Install and run

```bash
pnpm install
pnpm build      # compiles TypeScript and builds the web frontend
pnpm app        # web dashboard on http://localhost:3000
```

`pnpm build` is required before `pnpm app`. To run a different surface:

- `pnpm app` — Web dashboard
- `pnpm app --tui` — terminal UI

## Configuration

On first run with no `koris.json`, the web app drops you into a browser setup wizard —
no manual config editing needed. Two CLI entry points cover the same ground:

- `pnpm onboard` — the CLI onboarding flow
- `pnpm validate` — checks `koris.json` against the expected schema

In a normal checkout `koris.json` lives in the working directory. The `BASE_DIR` /
`DATA_DIR` split only matters for the packaged desktop app. There is no auto-migration
of the `ai` block from older layouts — if it drifts, regenerate it from
`koris.example.json`. See [AI providers](/docs/ai-providers) for the current shape.

## Desktop app

`apps/desktop/` is a thin Electron shell. It does not reimplement the UI: it manages
the koris server and loads the existing web dashboard in a native window. It is
packaged with electron-builder.

## Resetting state

```bash
pnpm clear:memory   # deletes the local SQLite database files
```

## Next

- [Concepts](/docs/concepts) — message flow, sessions, memory, compaction, trust
- [Channels](/docs/channels) — Telegram, WhatsApp, TUI, web dashboard
- [AI providers](/docs/ai-providers) — providers, roles, embeddings, queueing
- [Admin dashboard](/docs/admin-dashboard) — the web admin surface
