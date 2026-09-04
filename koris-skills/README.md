# koris-skills/

Canonical source for `koris` skills whose source has been removed from the
`koris` repo and now lives here instead. Same idea as `koris-plugins/` (see
that directory's README), applied to skills: this is the actual, maintained
`SKILL.md` (plus any accompanying files), not a vendored/read-only snapshot.
Nothing here is built, imported, or executed by this Next.js app.

## Layout

Mirrors the path convention used in `koris`: `koris-skills/<slug>/...`
(skills in `koris` aren't further grouped by family, unlike `plugins/tools/`),
matching `sourcePath` in the corresponding
`content/marketplace/skills/<slug>.json` entry (whose `sourceUrl` should point
back at this repo for these skills).

Every `SKILL.md` here is plain GFM Markdown — frontmatter (`name`,
`description`, `read_when`) plus prose sections (`##` headings, bullet lists,
fenced code blocks for requests/responses). No custom XML tags.

## Contents

5 skills, all originally at `koris`'s `skills/<slug>/`, removed there and
now maintained here going forward:

- `cat-fact/` — the `cat-fact` skill. Sample/reference skill for this
  pattern.
- `weather/` — the `weather` skill.
- `calendar-coredash/` — the `calendar-coredash` skill (renamed from
  `calendar-gateway`).
- `emails-coredash/` — the `emails-coredash` skill (renamed from
  `emails-gateway`).
- `todo-coredash/` — the `todo-coredash` skill (renamed from
  `todo-gateway`).

The three `-coredash` skills were renamed from `-gateway`: slug, directory,
`SKILL.md` front-matter `name`, and the matching `content/marketplace/*.json`
`slug`/`name`/`type`/`tags` were all updated accordingly. Prose that uses
"gateway" as a generic architecture term (e.g. "internal gateway API", the
`GATEWAY_HOST` env var) was intentionally left as-is — only the skill's own
naming was renamed, not the underlying concept it describes.

## Adding another skill here

1. Move its directory in under `koris-skills/<slug>/`.
2. Update the matching `content/marketplace/skills/<slug>.json`'s
   `sourcePath` (e.g. `koris-skills/<slug>`) and `sourceUrl` (this repo's
   GitHub URL for that path) to stop pointing at `koris`.
3. Note the move in this file and in AGENTS.md's "Relationship to koris"
   section.
