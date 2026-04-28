import Parser from 'rss-parser'
import type { SourceAdapter, FetchedItem, HnCategoryConfig } from './types'
import type { Category } from '../types'

const parser = new Parser()
const HN_FEED_URL = 'https://hnrss.org/frontpage'
const FETCH_WINDOW_MS = 30 * 60 * 60 * 1000

export function createHnAdapter(categoryConfigs: HnCategoryConfig[]): SourceAdapter {
  return {
    name: 'Hacker News',
    async fetch(): Promise<FetchedItem[]> {
      const feed = await parser.parseURL(HN_FEED_URL)
      const since = new Date(Date.now() - FETCH_WINDOW_MS)
      const items: FetchedItem[] = []

      for (const item of feed.items) {
        if (!item.title || !item.link) continue
        const pubDate = item.isoDate
          ? new Date(item.isoDate)
          : item.pubDate
          ? new Date(item.pubDate)
          : null
        if (!pubDate || pubDate < since) continue

        const titleLower = item.title.toLowerCase()
        const category = classifyItem(titleLower, categoryConfigs)
        if (!category) continue

        const commentMatch = item.contentSnippet?.match(/(\d+)\s+comment/i)
        const commentCount = commentMatch ? parseInt(commentMatch[1], 10) : 0
        const excerpt = commentCount > 0
          ? `${item.contentSnippet?.slice(0, 200).trim()}. ${commentCount} comments.`
          : item.contentSnippet?.slice(0, 250) || undefined

        items.push({
          source_type: 'forum',
          source_name: 'Hacker News',
          category,
          title: item.title.trim(),
          excerpt,
          url: item.link,
          author: 'HN Community',
          published_at: pubDate.toISOString(),
        })
      }

      return items
    },
  }
}

function classifyItem(titleLower: string, configs: HnCategoryConfig[]): Category | null {
  for (const { category, keywords } of configs) {
    if (keywords.some(kw => titleLower.includes(kw))) return category
  }
  return null
}
