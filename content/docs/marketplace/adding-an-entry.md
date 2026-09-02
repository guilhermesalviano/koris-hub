---
title: Adding a marketplace entry
order: 1
---

# Adding a marketplace entry

The [marketplace](/marketplace) catalog is plain JSON in this repo — one file per
entry at `content/marketplace/<slug>.json`. No build step, no database.

## Steps

1. **Copy an existing entry** that's close to what you're adding, e.g.
   `content/marketplace/issue.json` for a tool or `content/marketplace/weather.json`
   for a skill.
2. **Rename it** to `<slug>.json`. The `slug` field inside the file **must** equal
   the filename without `.json` — the loader throws a build error otherwise.
3. **Fill in the fields** (see the schema below).
4. Run `pnpm dev` and open `http://localhost:3000/marketplace/<slug>` to
   check the card and detail page.
5. `pnpm lint` and `pnpm build` must both pass.

## Schema

The full type lives in `content/marketplace/schema.ts`.

| Field | Required | Notes |
| --- | --- | --- |
| `slug` | ✅ | kebab-case; equals the filename and the URL segment |
| `name` | ✅ | display name |
| `family` | ✅ | `tool` \| `channel` \| `skill` |
| `type` | | finer label: `action`, `query`, `messaging`, `gateway`, `utility`, … |
| `summary` | ✅ | one line, shown on cards |
| `description` | ✅ | markdown, shown on the detail page |
| `tags` | ✅ | string array |
| `sourcePath` | ✅ | path inside the koris repo, e.g. `plugins/tools/issue` |
| `sourceUrl` | ✅ | full GitHub URL to `sourcePath` |
| `toolName` | tools | the LLM-facing name, e.g. `issue` |
| `params` | tools | `{ name, type, required, description, enum? }[]` |
| `readWhen` | skills | the `read_when` triggers from `SKILL.md` |
| `requiresConfirmation` | | `true` if the plugin needs explicit user confirmation |
| `defaultEnabled` | | enablement state in a fresh koris install |
| `capturedFrom` | | optional koris git ref this snapshot came from |

## Keeping it in sync

The JSON files are the source of truth — they're written and reviewed by hand. A
sketch helper, `scripts/generate-catalog.ts`, can re-derive `params` / `readWhen`
from a local `koris` checkout and merge them into the existing files without
clobbering the hand-written prose. Source parsing is brittle, so always review its
output.
