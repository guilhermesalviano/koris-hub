---
name: docs-generator
description: >-
  Author or edit content for the koris-hub site — Markdown docs under
  content/docs/ and JSON catalog entries under content/marketplace/. Use whenever
  the task is writing, restructuring, or reviewing docs pages or marketplace
  entries in this repo. Enforces a per-file validation gate: after every file is
  written it is shown to the user for explicit approval before the next one.
---

# docs-generator

How to navigate `content/` in **koris-hub** and produce `.md` docs (and
`.json` marketplace entries) that build and render correctly — one file at a
time, each approved by the user before moving on.

## When to use

- Writing a new docs page or section under `content/docs/`.
- Editing / restructuring existing docs.
- Adding or changing a marketplace catalog entry under `content/marketplace/`.
- Reviewing content for correctness against the build rules below.

## Non‑negotiable: validate every file

Create or modify **one file, then stop.** Do not touch the next file until the
current one is approved.

For each file:

1. Write it (Write for new, Edit for changes).
2. Post a validation block to the user — use this exact shape:

   ```
   ── FILE 1/N ── content/docs/<path>.md  (new | edited)
   Route:      /docs/<slug>            (or "n/a" for marketplace JSON)
   Frontmatter: title="…"  order=N
   Links out:  /docs/…, https://…      (list every link in the file)
   Checklist:
     - frontmatter present and typed correctly (title: string, order: number)
     - H1 matches the title
     - every internal link points to a slug that exists (or is being added in this batch)
     - tone / structure matches neighbouring files
     - GFM only — no raw HTML, no MDX
   <full file content, or a unified diff for edits>
   ```

3. Wait for an explicit "approved" / "ok" / "looks good" (or edits). Silence is
   not approval — ask again.
4. If changes are requested, apply them and re-post the block for the same file.
5. Only then move to the next file.

At the start, list the full set of files you intend to create/edit and their
order, so the user knows the scope. Number the validation blocks `i/N`.

After the **last** file is approved:

- Run `pnpm lint` and `pnpm build`.
- Confirm new docs routes show up in the build output and in the sidebar tree.
- Report every route created/changed.

## Navigate first — read before you write

1. `find content -type f | sort` — see the whole tree.
2. Read `src/lib/docs.ts` — it is the source of truth for how docs are
   discovered, sorted, and routed. Re-read it if any rule below is unclear.
3. Read the 2–3 `.md` files nearest to what you're adding. Match their voice
   (concise, second person, short sections), heading depth, and line wrapping
   (~90–100 cols).
4. Read `AGENTS.md` (repo root) — "Conventions / gotchas" and the `content/`
   layout notes.
5. For marketplace work also read `content/docs/marketplace/adding-an-entry.md`
   and `content/marketplace/schema.ts`.

## content/docs/ — the rules

Rendered by `src/app/docs/[...slug]/page.tsx` (and `docs/page.tsx` for the root)
through `src/components/Markdown.tsx`: `react-markdown` + `remark-gfm`, styled
with `@tailwindcss/typography` (`prose prose-invert`).

**Frontmatter (required on every `.md`):**

```md
---
title: Human Readable Title
order: 3
---
```

- `title` — string. Used in the sidebar label and the `<title>` (`"<title> ·
  Koris Docs"`). Missing/!string ⇒ falls back to the last slug segment.
- `order` — number. Sort key within a directory; ties break on `title`
  alphabetically. Missing/!number ⇒ `999`.

**Files & routing:**

- `content/docs/foo.md` → `/docs/foo`. `content/docs/a/b.md` → `/docs/a/b`.
- A **subdirectory** is a nav group and **must** contain `index.md` with its own
  frontmatter (without it the group title is just the folder name, order `999`).
- Top‑level `content/docs/index.md` renders at `/docs`. Note: the sidebar's root
  link label is **hardcoded** in `src/components/DocsSidebar.tsx` ("Hello
  World") — changing this file's `title` does **not** update it; that needs a
  code change, call it out if relevant.
- Filenames: kebab-case, `.md` only. No spaces.
- Static export with `dynamicParams = false`: a new page is only reachable
  **after `pnpm build`**, and any linked `/docs/...` path must resolve to a real
  file or the link 404s.

**Markdown you may use (GFM):** headings, bold/italic, lists, ordered lists,
fenced code blocks (```lang — plain rendered, no highlighting, language tag is
harmless), tables, task lists, strikethrough, blockquotes, bare-URL autolinks,
horizontal rules.

**Do not use:** raw HTML (not rendered — no `rehype-raw`), MDX / JSX, `import`,
custom components, `<details>`, HTML comments as content.

**Links:**

- Internal → root-relative: `/docs/marketplace/adding-an-entry`, `/marketplace`,
  `/#features`. Never relative (`../x`) and never include `.md`.
- External → full `https://` URL.
- Images → put the asset in `public/` and reference `/asset.png`.

**Body conventions:** one `#` H1 near the top, matching the `title`. Start
subsections at `##`. Keep paragraphs tight; prefer lists and short code blocks.

## content/marketplace/ — the rules

These are **`.json`, not Markdown** — but the same one-file-at-a-time validation
gate applies. Follow `content/docs/marketplace/adding-an-entry.md`.

- One file per entry: `content/marketplace/<slug>.json`.
- `slug` inside the file **must equal** the filename without `.json`
  (`src/lib/marketplace.ts` throws a build error otherwise).
- `family` ∈ `tool | channel | skill`.
- Required keys: `slug, name, family, summary, description, tags, sourcePath,
  sourceUrl`. Tools also need `toolName` + `params[]`; skills also need
  `readWhen[]`. Full type in `content/marketplace/schema.ts`.
- `description` is Markdown (rendered on the detail page) — same GFM-only,
  no-HTML rule as docs.
- Copy the closest existing entry (`issue.json` for a tool, `weather.json` for a
  skill) and edit; keep 2-space indent and a trailing newline.
- In the validation block, list `slug`, `family`, and confirm `slug` ==
  filename.

## Definition of done

- Every file individually approved by the user.
- `pnpm lint` (`tsc --noEmit`) passes.
- `pnpm build` passes and the new routes appear in its output.
- Sidebar / catalog shows the new entries in the intended order.
- Every internal link resolves to a built route.
