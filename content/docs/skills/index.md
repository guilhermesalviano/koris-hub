---
title: Skills
order: 8
---

# Skills

A skill is a Markdown file that teaches the agent how to handle a particular kind of request.
Skills are instructions, not code — when a skill is active, its body is folded into the
agent's context so the model knows what to do. Contrast this with [tools](/docs/tools), which
are executable handlers the model calls.

## Anatomy

Each skill is a folder under `plugins/skills/` containing a `SKILL.md`:

```
plugins/skills/
  weather/
    SKILL.md
```

`SKILL.md` has YAML front-matter with `name` and `description`, followed by a body of
instructions:

```md
---
name: weather
description: "Get current weather and forecasts. Use when the user asks about weather,
  temperature, or forecasts for a location. No API key needed."
---

Instructions for the agent go here.
```

The `description` is what the agent uses to decide whether the skill is relevant, so make it
specific about when to use the skill and when not to.

## How skills load

`SkillSyncService` (`core/src/services/skills/skill-sync.ts`) syncs `plugins/skills/` into the
`learned_skills` table at startup and again on any file change, using a filesystem watch with
a 500 ms debounce. Rows whose skill folder was removed are pruned on the next sync.

On sync, each skill body is wrapped in `SKILL_LEARNING_PROMPT`, with the `<GATEWAY_HOST>`
placeholder resolved to `config.GATEWAY_HOST`.

## Trust

Only trusted senders receive learned skills. An untrusted sender gets a plain reply with no
skills and no tools. See [Security](/docs/security) for how trust is decided per channel.

## Skills that ship with Koris

- `weather`
- `cat-fact`
- `calendar-coredash`
- `emails-coredash`
- `todo-coredash`

## Adding a skill

1. Create `plugins/skills/<name>/SKILL.md` with `name` and `description` front-matter and a body.
2. Save the file — the watcher picks it up, or restart the app.
3. From the Admin dashboard's Skills page you can enable or disable individual skills and
   trigger a manual re-sync. See the [Admin dashboard](/docs/admin-dashboard).

To publish a skill in the catalog, follow
[Adding a marketplace entry](/docs/marketplace/adding-an-entry); it will appear in the
[marketplace](/marketplace) alongside tools and channels.
