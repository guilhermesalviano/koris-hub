import type { LatestDownloads } from './downloads';
import type { ChangelogEntry } from './changelog';

let downloadsPromise: Promise<LatestDownloads | null> | null = null;
let changelogPromise: Promise<ChangelogEntry[]> | null = null;

/**
 * Client-side cached and deduplicated fetcher for `/api/downloads`.
 * Multiple components mounting on the same page (e.g. Hero DownloadButton,
 * Footer DownloadButton, and Download section) share a single network request.
 */
export function fetchCachedDownloads(): Promise<LatestDownloads | null> {
  if (!downloadsPromise) {
    downloadsPromise = fetch('/api/downloads')
      .then((res) => (res.ok ? (res.json() as Promise<LatestDownloads | null>) : null))
      .catch((err) => {
        console.warn('[client-api] Failed to fetch downloads:', err);
        return null;
      });
  }
  return downloadsPromise;
}

/**
 * Client-side cached and deduplicated fetcher for `/api/changelog`.
 */
export function fetchCachedChangelog(): Promise<ChangelogEntry[]> {
  if (!changelogPromise) {
    changelogPromise = fetch('/api/changelog')
      .then((res) => (res.ok ? (res.json() as Promise<ChangelogEntry[]>) : []))
      .catch((err) => {
        console.warn('[client-api] Failed to fetch changelog:', err);
        return [];
      });
  }
  return changelogPromise;
}
