export type SourceType = 'youtube' | 'spotify' | 'medium' | 'rss' | 'forum'

export type Category = 'startups' | 'frontend' | 'backend' | 'ai' | 'ai-dev' | 'crypto'

export interface ContentItem {
  id: string
  source_type: SourceType
  source_name: string
  category: Category
  title: string
  excerpt?: string
  url: string
  thumbnail_url?: string
  author?: string
  duration?: number       // seconds — video/podcast only
  embed_html?: string     // youtube/spotify iframe — Phase 4+
  published_at: string    // ISO 8601 date string
  fetched_at: string
  created_at: string
}

export const CATEGORY_LABELS: Record<Category, string> = {
  startups: 'Startups',
  frontend: 'Frontend',
  backend: 'Backend',
  ai: 'AI News',
  'ai-dev': 'AI Dev',
  crypto: 'Crypto',
}

export const ALL_CATEGORIES: Category[] = ['startups', 'frontend', 'backend', 'ai', 'ai-dev', 'crypto']
