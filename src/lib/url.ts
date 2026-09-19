/**
 * Validates whether a URL is safe for navigation or rendering in links.
 * Strips dangerous URI schemes such as `javascript:`, `vbscript:`, and `data:text/html`.
 */
export function isSafeUrl(url: string | undefined): boolean {
  if (!url) return false;
  const trimmed = url.trim().toLowerCase();
  if (
    trimmed.startsWith('javascript:') ||
    trimmed.startsWith('vbscript:') ||
    trimmed.startsWith('data:text/html')
  ) {
    return false;
  }
  return true;
}
