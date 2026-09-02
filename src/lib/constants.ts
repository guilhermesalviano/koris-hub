// The code repository (releases, source, issues).
export const REPO_URL = 'https://github.com/guilhermesalviano/koris';
export const RELEASES_URL = `${REPO_URL}/releases/latest`;

// Releases REST API for the code repo — the changelog is built from this at build time.
export const RELEASES_API_URL = 'https://api.github.com/repos/guilhermesalviano/koris/releases';

// This repo — the website / marketplace / docs. Used for "edit this entry" links.
export const HUB_REPO_URL = 'https://github.com/guilhermesalviano/koris-hub';

// Must match `basePath` in next.config.ts — next/image does not auto-prefix
// local `src` values with basePath in this static-export setup.
// Empty: the site is served from the root of the custom domain.
export const BASE_PATH = '';
