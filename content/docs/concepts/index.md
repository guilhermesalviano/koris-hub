---
title: Concepts
order: 4
---

# Concepts

How a message becomes a reply in Koris, and the pieces that keep state between messages.

## Message flow

1. A channel plugin (Telegram, WhatsApp, or the TUI) receives a message, normalizes it into
   an `InboundChannelMessage`, and hands it to the generic `IChannelHandler`. That handler
   applies the channel rules — group-mention filter, trust-based gating of tools and learned
   skills, prompt prefixing, reply splitting — then calls `MessageGateway.handle`.
2. `MessageGateway` resolves the session for the sender, checks whether the message is a slash
   command, and otherwise delegates to the **MainAgent**.
3. **MainAgent** calls `ChatService.complete`. The full prompt is assembled by
   `PromptRepository` (system prompt, tool-execution contract, tool schemas, learned skills,
   retrieved memories, message history) and sent to the AI provider.
4. If the model returns tool calls, they go to the **ToolCallPipeline** and then the
   **ExecutorWorker**, which loops tool-call, tool-result, next model call until the model
   returns a final message.
5. After the reply is sent, background jobs fire: a **ConversationWorker** persists the
   exchange, and the **Summarizer** sub-agent may condense older context into memories.

See [AI providers](/docs/ai-providers) for how each agent is routed to a provider and model,
and how concurrent model calls are ordered.

## Agents and workers

- **MainAgent** — the main orchestrator; owns the conversation with the model.
- **ExecutorWorker** — runs the tool-call loop until a final message.
- **Summarizer sub-agent** — condenses context into `memories` rows in the background.
- **Heartbeat sub-agent** — runs scheduled beats (see below).

## Sessions

A session is one running conversation. Slash commands manage its lifetime:

- `/clear` (alias `/reset`) ends the session and starts a fresh, empty one — nothing carried
  forward.
- `/compact` summarizes the session into memory, then rotates to a fresh session seeded with
  that summary.

The full command list is in the [commands reference](/docs/commands).

## Memory

State lives in a local SQLite database (`better-sqlite3`, synchronous, WAL mode) with its file
under `core/memory/`. Tables:

| Table | Holds |
| --- | --- |
| `sessions` | one row per conversation |
| `messages` | short-term history; `role` is `user`, `assistant`, or `system` |
| `memories` | long-term notes; `type` is `summary`, `fact`, `lesson`, or `reminder` |
| `images` | base64 attachments referenced by message rows |
| `learned_skills` | skills synced from the `plugins/skills/` folder |
| `heartbeat` | scheduled beats |
| `plugin_settings` | per-plugin enabled state for every tool and channel |

All access goes through `core/src/repositories/*` — SQL is not written elsewhere. `pnpm
clear:memory` deletes the database files.

## Summarizer and compaction

With `session.summarizer_mode: "manual"` the per-turn summarizer is off. In that mode
`MessageGateway` runs a safety valve instead:

- **Before a turn**, if the estimated session token count reaches `session.compact_threshold`
  (default `0.9`) times the manager's `num_ctx`, it auto-compacts: summarize the session into
  memory, then rotate to a fresh session seeded with the summary.
- **Reactively**, on a `context_length` error from the provider, it does the same compaction
  and retries the turn once.

Either way it prints a one-line notice explaining what happened. In the default `auto` mode
this does not apply, because every exchange is already condensed.

## Heartbeats

Heartbeats are cron-scheduled sub-agents. `core/heartbeats.default.json` is seeded into the
`heartbeat` table on every startup: config-owned beats are marked `managed` and kept fully in
sync (updated on change, removed when dropped from the file), while beats you create through
the `set_beat` tool or the dashboard are never touched.

The reserved `__koris_clear_images__` beat is handled natively — no model call — and simply
empties the `images` table.

The beat tools (`set_beat`, `list_beats`, `update_beat`, `delete_beat`) are documented in the
[tools reference](/docs/tools).
