import { fetchRawGitHubReleases } from './github-releases';

export interface ChangelogEntry {
  version: string; // tag_name with a leading "v" stripped, e.g. "0.1.4"
  date: string | null; // published_at, "YYYY-MM-DD"
  url: string; // release html_url
}

const MAX_ENTRIES = 10;

// Data layer for the `/api/changelog` route handler. Hits the centralized releases
// service (deduplicated across endpoints, cached with TTL) and normalizes it to
// `ChangelogEntry[]`, newest first, stable releases only.
export async function fetchChangelogEntries(): Promise<ChangelogEntry[]> {
  try {
    const releases = await fetchRawGitHubReleases();

    return releases
      .filter((release) => !release.draft && !release.prerelease)
      // Newest first by publish date; unpublished releases sink to the bottom.
      .sort((a, b) => (b.published_at ?? '').localeCompare(a.published_at ?? ''))
      .slice(0, MAX_ENTRIES)
      .map((release) => ({
        version: release.tag_name.replace(/^v/, ''),
        date: release.published_at ? release.published_at.slice(0, 10) : null,
        url: release.html_url,
      }));
  } catch (err) {
    console.warn('[changelog] Error getting changelog entries:', err);
    return [];
  }
}
