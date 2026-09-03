---
title: Overview
order: 1
---

# Overview

Koris is an autonomous AI-agent framework you run on your own infrastructure. It
receives messages through pluggable channels, runs them through an LLM, executes
tools on your behalf, and keeps memory and sessions in a local SQLite database so
state persists across restarts.

## Start here

- **[Getting Started](/docs/getting-started)** — requirements, install, first run, configuration.
- **[Concepts](/docs/concepts)** — how a message becomes a reply: sessions, memory, compaction, trust.

## Building blocks

- **[Channels](/docs/channels)** — Telegram, WhatsApp, the terminal UI, and the web dashboard.
- **[AI Providers](/docs/ai-providers)** — providers, roles, embeddings, queueing.
- **[Tools](/docs/tools)** — the actions the agent can take beyond replying.
- **[Skills](/docs/skills)** — Markdown files that teach the agent how to handle a kind of request.
- **[Plugins](/docs/plugins)** — extend Koris without touching its core.
- **[Commands](/docs/commands)** — slash commands intercepted before a message reaches the agent.

## Operating Koris

- **[Admin Dashboard](/docs/admin-dashboard)** — the browser surface for chatting and configuration.
- **[Security](/docs/security)** — running safely on public channels and untrusted input.

## Elsewhere

- **[Marketplace](/marketplace)** — browse the tools, channels, and skills that ship with Koris.
- **[Source on GitHub](https://github.com/guilhermesalviano/koris)** — the framework itself.
