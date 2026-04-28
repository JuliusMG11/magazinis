import type { Category } from './types'

export function formatDuration(seconds: number): string {
  if (seconds < 3600) {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${String(s).padStart(2, '0')}`
  }
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  return `${h}h ${m}m`
}

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(iso))
}

export function getCategoryColor(category: Category): string {
  const map: Record<Category, string> = {
    startups: 'text-startups',
    frontend: 'text-frontend',
    backend: 'text-backend',
    ai: 'text-ai',
    'ai-dev': 'text-aidev',
  }
  return map[category]
}

export function getCategoryDimBg(category: Category): string {
  const map: Record<Category, string> = {
    startups: 'bg-startups-dim dark:bg-startups/10',
    frontend: 'bg-frontend-dim dark:bg-frontend/10',
    backend: 'bg-backend-dim dark:bg-backend/10',
    ai: 'bg-ai-dim dark:bg-ai/10',
    'ai-dev': 'bg-aidev-dim dark:bg-aidev/10',
  }
  return map[category]
}

export function formatRelativeTime(date: Date): string {
  const diffMs = Date.now() - date.getTime()
  const diffMins = Math.floor(diffMs / 60_000)
  const diffHours = Math.floor(diffMs / 3_600_000)
  const diffDays = Math.floor(diffMs / 86_400_000)

  if (diffMins < 2) return 'just now'
  if (diffMins < 60) return diffMins === 1 ? '1 minute ago' : `${diffMins} minutes ago`
  if (diffHours < 24) return diffHours === 1 ? '1 hour ago' : `${diffHours} hours ago`
  return diffDays === 1 ? 'yesterday' : `${diffDays} days ago`
}
