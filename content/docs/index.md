---
title: Hello World
order: 1
---

# Hello World

Welcome to the Koris docs. This is the starting point — a placeholder page to prove
the docs section works end to end.

Koris is an autonomous AI assistant framework you run on your own infrastructure:
pluggable channels, markdown-defined skills, a plugin system, and SQLite-backed
memory that persists across sessions.

## Where to go next

- **[Marketplace](/marketplace)** — browse the tools, channels, and skills that ship with Koris.
- **[Adding a marketplace entry](/docs/marketplace/adding-an-entry)** — how this site's catalog is authored.
- **[Source on GitHub](https://github.com/guilhermesalviano/koris)** — the framework itself.

## Running Koris

```bash
# grab the latest release, unzip, then:
pnpm install
pnpm build && pnpm app      # web dashboard on http://localhost:3000
```

First run with no `koris.json` drops you into a browser setup wizard — no manual
config editing.

> This page is intentionally minimal. Real documentation lands here as it's written;
> the sidebar on the left is the nav scaffold it will grow into.
