# AGENTS.md

Guidance for agents working in `koris-hub` — the public website, plugins
marketplace, and docs for [Koris](https://github.com/guilhermesalviano/koris).

## What this is

A standalone Next.js 16 App Router app, **statically exported** (`output: 'export'`
in `next.config.ts`), deployed to GitHub Pages at
`https://guilhermesalviano.github.io/koris` — hence `basePath: '/koris'`.
Independent repo; not part of the `koris` pnpm workspace (it has its own
`pnpm-workspace.yaml` so pnpm/Turbopack stop walking up).

## Commands

- `pnpm dev` — dev server (`http://localhost:3000/koris`)
- `pnpm build` — static export to `out/`
- `pnpm lint` — `tsc --noEmit -p tsconfig.json` (no ESLint; strict TS)
- `pnpm preview` — `serve out/` (does **not** replicate the `/koris` prefix)
- `pnpm sync:changelog` — refresh `content/changelog.md` from the koris repo

Run `pnpm lint` and `pnpm build` before considering a change done.

## Layout

```
src/app/            routes: / (landing), /marketplace, /marketplace/[slug],
                    /docs, /docs/[...slug]; layout.tsx, not-found.tsx, globals.css
src/components/     Navbar, Hero, HowItWorks, Feature, Changelog, Footer, icons,
                    Markdown, MarketplaceCard, ParamTable, DocsSidebar
src/lib/            constants.ts, changelog.ts, marketplace.ts, docs.ts
content/marketplace/  <slug>.json catalog entries + schema.ts (typed)
content/docs/         *.md docs (frontmatter: title, order); index.md per section
content/changelog.md  vendored snapshot of koris/CHANGELOG.md
scripts/              sync-changelog.ts, generate-catalog.ts (sketch)
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
AGENTS.md. Plugin/skill source still lives in `koris` (`plugins/`, `skills/`); this
repo only *describes* them.
