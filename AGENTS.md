# AGENTS.md

Guidance for agents working in `koris-hub` — the public website, plugins
marketplace, and docs for [Koris](https://github.com/guilhermesalviano/koris).

## What this is

A standalone Next.js 16 App Router app, **statically exported** (`output: 'export'`
in `next.config.ts`), deployed to GitHub Pages on the custom domain
`https://hub.koaris.com` (`public/CNAME`) — served from the domain root, so
`basePath: ''`.
Independent repo; not part of the `koris` pnpm workspace (it has its own
`pnpm-workspace.yaml` so pnpm/Turbopack stop walking up).

## Commands

- `pnpm dev` — dev server (`http://localhost:3000/koris`)
- `pnpm build` — static export to `out/`
- `pnpm lint` — `tsc --noEmit -p tsconfig.json` (no ESLint; strict TS)
- `pnpm preview` — `serve out/` (does **not** replicate the `/koris` prefix)

Run `pnpm lint` and `pnpm build` before considering a change done.

## Layout

```
src/app/            routes: / (landing), /marketplace, /marketplace/[slug],
                    /docs, /docs/[...slug]; api/changelog, api/downloads
                    (force-static GitHub Releases proxies); layout.tsx,
                    not-found.tsx, globals.css
src/components/     Navbar, Hero, HowItWorks, Feature, Changelog, Footer, icons,
                    Markdown, MarketplaceCard, ParamTable, DocsSidebar
src/lib/            constants.ts, changelog.ts, downloads.ts, marketplace.ts,
                    docs.ts
content/marketplace/  <slug>.json catalog entries + schema.ts (typed)
content/docs/         *.md docs (frontmatter: title, order); index.md per section
scripts/              generate-catalog.ts (sketch)
koris-plugins/        canonical home for plugin source that has moved out of `koris`
                      (reference only, not built/imported by this app); see
                      koris-plugins/README.md
koris-skills/          same idea as koris-plugins/, for skills; see koris-skills/README.md
```

## Conventions / gotchas

- **Static export**: every dynamic route needs `generateStaticParams()` **and**
  `export const dynamicParams = false`. `/marketplace/[slug]` and `/docs/[...slug]`
  both do this.
- **`params` is a Promise** (Next 15+): page and `generateMetadata` are `async` and
  `await params`.
- **`next/image` + basePath**: local `src` values are not auto-prefixed in this
  static-export setup — prefix with `BASE_PATH` from `src/lib/constants.ts`
  (see `Navbar.tsx`).
- **Styling**: Tailwind v4, CSS-first `@theme` tokens in `globals.css`
  (`bg`, `bg-subtle`, `txt`, `muted`, `accent`, `border`), dark only. No
  `tailwind.config`. Markdown is styled with `@tailwindcss/typography` (`@plugin`
  in `globals.css`).
- **Markdown**: `react-markdown` + `remark-gfm` in `src/components/Markdown.tsx`.
  No MDX, no second build tool. Keep it that way unless docs genuinely need inline
  React.
- **Catalog**: JSON files are the source of truth. `src/lib/marketplace.ts`
  validates `slug === filename` and the `family` enum at load time — a bad entry
  fails the build. `scripts/generate-catalog.ts` only *merges* derived fields.
- **`@content/*`** tsconfig alias → `./content/*`; `@/*` → `./src/*`.

## Relationship to koris

The `koris` repo no longer contains a website. It links here from its README /
AGENTS.md. Some plugin/skill source still lives in `koris` (`plugins/`,
`skills/`); this repo describes those via `content/marketplace/`. A growing
set of plugins and skills (see `koris-plugins/README.md` and
`koris-skills/README.md` for the current lists) have had their source removed
from `koris` and now live here instead, under `koris-plugins/` /
`koris-skills/` — for those, `content/marketplace/*.json` `sourcePath`/
`sourceUrl` point at this repo, not `koris`.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
