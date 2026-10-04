const DAY = 86400;

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map(w => w[0])
    .join('')
    .toUpperCase();
}

export function timeAgo(unixSeconds: number): string {
  const days = Math.floor((Math.floor(Date.now() / 1000) - unixSeconds) / DAY);
  if (days === 0) return 'today';
  if (days === 1) return '1 day ago';
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  return months === 1 ? '1 month ago' : `${months} months ago`;
}

const SIZE_UNITS = ['KB', 'MB', 'GB'];

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const exp = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), SIZE_UNITS.length);
  return `${(bytes / Math.pow(1024, exp)).toFixed(1)} ${SIZE_UNITS[exp]}`;
}
