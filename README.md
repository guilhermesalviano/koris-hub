# koris-hub

The public web presence for [Koris](https://github.com/guilhermesalviano/koris) — the
autonomous AI assistant framework. This repo holds:

- **`/`** — the marketing landing page
- **`/marketplace`** — a browsable catalog of the tools, channels, and skills that ship with Koris
- **`/docs`** — the documentation site (currently a hello-world scaffold)

It is a standalone [Next.js](https://nextjs.org) App Router app, statically exported
(`output: 'export'`) and deployed to GitHub Pages on the custom domain
<https://hub.koaris.com>.

## Stack

- Next.js 16 (static export, custom domain, `basePath: ''`)
- React 19, TypeScript 7 (`tsc --noEmit` for type-checking — no ESLint)
- Tailwind CSS v4 via `@tailwindcss/postcss` (`@theme` tokens in `src/app/globals.css`, dark only)
- Markdown via `react-markdown` + `remark-gfm` + `gray-matter` — no second build tool
- pnpm 10.18.3, Node ≥ 24

This repo is checked out inside the `koris` working tree for convenience but is a
fully independent repository (`koris` `.gitignore`s it). It has its own
`pnpm-workspace.yaml` so pnpm treats it as its own root.

## Commands

```bash
pnpm install
pnpm dev        # dev server — http://localhost:3000/koris
pnpm build      # static export to out/
pnpm preview    # serve out/ (note: does not replicate the /koris base path)
pnpm lint       # tsc --noEmit
```

## Marketplace catalog

The catalog is plain JSON: one file per entry at `content/marketplace/<slug>.json`,
typed by `content/marketplace/schema.ts`. The `slug` field must equal the filename.
See [`/docs/marketplace/adding-an-entry`](content/docs/marketplace/adding-an-entry.md)
for the authoring guide. `scripts/generate-catalog.ts` is a sketch helper that can
re-derive `params` / `readWhen` from a local `koris` checkout.

## Docs

Markdown files under `content/docs/`. Frontmatter: `title`, `order`. A directory
becomes a section via its `index.md`. The left sidebar is generated from the tree.

## Changelog

The landing page's changelog is built from the `koris` repo's [GitHub
Releases](https://github.com/guilhermesalviano/koris/releases). `src/lib/changelog.ts`
fetches the Releases API during `next build`, so the section refreshes on every deploy
(stable releases only; a fetch failure just omits the section). CI passes a read-only
`GITHUB_TOKEN` to raise the API rate limit.

## Deploy

Push to `main` → `.github/workflows/deploy.yml` runs `pnpm build` and publishes
`out/` to the `gh-pages` branch via `peaceiris/actions-gh-pages`. GitHub Pages must
be pointed at the `gh-pages` branch (`/` root) once in repo settings.
