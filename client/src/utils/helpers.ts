export function formatXP(xp: number): string {
  if (xp >= 1000) return `${(xp / 1000).toFixed(1)}k`;
  return xp.toString();
}

export function getLevelTitle(level: number): string {
  if (level < 3) return 'Rising Hero';
  if (level < 5) return 'Emerging Hero';
  if (level < 8) return 'Established Hero';
  if (level < 12) return 'Notable Hero';
  if (level < 16) return 'Distinguished Hero';
  if (level < 20) return 'Elite Hero';
  return 'Legendary Hero';
}

export function getXPProgress(xp: number): number {
  const currentLevelXP = (Math.floor(xp / 1000)) * 1000;
  return ((xp - currentLevelXP) / 1000) * 100;
}

export function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return n.toString();
}

export function timeAgo(date: string | Date): string {
  const now = new Date();
  const past = new Date(date);
  const diffMs = now.getTime() - past.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  const diffMonth = Math.floor(diffDay / 30);
  const diffYear = Math.floor(diffMonth / 12);

  if (diffYear > 0) return `${diffYear}y ago`;
  if (diffMonth > 0) return `${diffMonth}mo ago`;
  if (diffDay > 0) return `${diffDay}d ago`;
  if (diffHour > 0) return `${diffHour}h ago`;
  if (diffMin > 0) return `${diffMin}m ago`;
  return 'just now';
}

export function getBadgeStyle(rarity: string): string {
  switch (rarity.toLowerCase()) {
    case 'legendary': return 'badge-legendary';
    case 'epic': return 'badge-epic';
    case 'rare': return 'badge-rare';
    default: return 'badge-common';
  }
}

export function getCategoryColor(category: string): string {
  const map: Record<string, string> = {
    Innovation: 'text-violet-500 bg-violet-50 dark:bg-violet-900/30',
    Technical: 'text-blue-500 bg-blue-50 dark:bg-blue-900/30',
    Community: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/30',
    Impact: 'text-amber-500 bg-amber-50 dark:bg-amber-900/30',
    Achievement: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-900/30',
    Security: 'text-rose-500 bg-rose-50 dark:bg-rose-900/30',
  };
  return map[category] || 'text-slate-500 bg-slate-50 dark:bg-slate-800';
}
