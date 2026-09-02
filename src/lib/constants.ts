// The code repository (releases, source, issues).
export const REPO_URL = 'https://github.com/guilhermesalviano/koris';
export const RELEASES_URL = `${REPO_URL}/releases/latest`;

// This repo — the website / marketplace / docs. Used for "edit this entry" links.
export const HUB_REPO_URL = 'https://github.com/guilhermesalviano/koris-hub';

// Must match `basePath` in next.config.ts — next/image does not auto-prefix
// local `src` values with basePath in this static-export setup.
export const BASE_PATH = '/koris';
