export function getTimeAgo(unixSeconds: number, now = Date.now()): string {
  if (!Number.isFinite(unixSeconds) || unixSeconds <= 0) return 'Posting date unavailable';
  const days = Math.floor(Math.max(0, now - unixSeconds * 1000) / 86_400_000);
  if (days === 0) return 'Posted today';
  if (days === 1) return 'Posted 1 day ago';
  if (days < 30) return `Posted ${days} days ago`;
  const months = Math.floor(days / 30);
  return `Posted ${months} ${months === 1 ? 'month' : 'months'} ago`;
}

export function normalizeJobType(type: string): string {
  return type.toLowerCase().replace(/[\s-]+/g, '');
}
