---
title: Commands
order: 11
---

# Commands

Slash commands are intercepted by `MessageGateway` before the message reaches the
agent. Recognition, channel completion, and the `/help` text are all derived from a
single list, `SLASH_COMMANDS` in `core/src/services/commands/registry.ts`, so a
command is added or retired in exactly one place.

## Reference

| Command | Usage | What it does |
| --- | --- | --- |
| `/help` | `/help [command]` | Show help; `/help <command>` for detail on one command. |
| `/status` | | Connection, AI provider, model and session mode. |
| `/usage` | `/usage [days\|today]` | Token-usage report from the audit log. |
| `/whoami` | | How the agent sees you: channel and access level. |
| `/memory` | | What earlier context has been summarised into this session. |
| `/clear` | | End this session and start a fresh, empty one. Nothing is carried forward. |
| `/compact` | | Summarise this session into memory, then start a fresh one seeded with the summary. |
| `/allow` | `/allow <domain>` | Add a domain to `allowed_domains`. Trusted senders only. |
| `/exit` | | How to leave the session. Listed on the TUI only. |

`/reset` is an alias for `/clear`. `/quit` and `/bye` are aliases for `/exit`.

## Notes

- **`/usage`** aggregates LLM calls, tool calls, tokens and wall-clock time. `/usage`
  is all-time, `/usage today` is since midnight, and `/usage 7` is the last 7 days.
- **`/clear` vs `/compact`** — `/clear` drops the current thread entirely; `/compact`
  keeps a summary. See [Concepts](/docs/concepts) for how sessions and summarisation
  work.
- **`/allow`** edits the domain allowlist that gates outbound requests. Only trusted
  senders may run it. See [Security](/docs/security).
- **`/status`** reports which provider and model are serving the current session. See
  [AI providers](/docs/ai-providers).

## Access

Commands marked trusted are limited to authorised users. An unauthorised sender who
runs one is told to ask the administrator to add them to the allowed list.
