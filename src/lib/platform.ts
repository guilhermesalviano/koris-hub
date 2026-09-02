// Client-safe OS helpers, shared by the download CTAs and the "Get started" tabs.
// Kept out of `downloads.ts` so importing them never pulls the GitHub fetch into
// a client bundle.

export type Platform = 'mac' | 'windows' | 'linux';

export const PLATFORM_LABELS: Record<Platform, string> = {
  mac: 'macOS',
  windows: 'Windows',
  linux: 'Linux',
};

// Best-effort OS sniff from the user agent. Returns null on the server (static
// export) and when nothing matches — callers fall back to a generic link.
export function detectPlatform(): Platform | null {
  if (typeof navigator === 'undefined') return null;
  const ua = `${navigator.userAgent} ${navigator.platform}`.toLowerCase();
  if (ua.includes('mac') || ua.includes('iphone') || ua.includes('ipad')) return 'mac';
  if (ua.includes('win')) return 'windows';
  if (ua.includes('linux') || ua.includes('android')) return 'linux';
  return null;
}
