import Parser from 'rss-parser'
import type { SourceAdapter, FetchedItem, RssSourceConfig } from './types'

type RssItem = {
  title?: string
  link?: string
  isoDate?: string
  pubDate?: string
  contentSnippet?: string
  creator?: string
  author?: string
  enclosure?: { url?: string }
  'media:content'?: { $?: { url?: string } } | Array<{ $?: { url?: string } }>
}

const parser = new Parser<Record<string, unknown>, RssItem>({
  customFields: {
    item: [['media:content', 'media:content', { keepArray: false }]],
  },
  requestOptions: {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; TechMagazinis/1.0)' },
  },
})

const FETCH_WINDOW_MS = 30 * 60 * 60 * 1000 // 30 hours

export function createRssAdapter(config: RssSourceConfig): SourceAdapter {
  return {
    name: config.name,
    async fetch(): Promise<FetchedItem[]> {
      const feed = await parser.parseURL(config.url)
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

        items.push({
          source_type: 'rss',
          source_name: config.name,
          category: config.category,
          title: item.title.trim(),
          excerpt: item.contentSnippet?.slice(0, 300) || undefined,
          url: item.link,
          thumbnail_url: extractThumbnail(item),
          author: (item.creator || item.author) ?? undefined,
          published_at: pubDate.toISOString(),
        })
      }

      return items
    },
  }
}

function extractThumbnail(item: RssItem): string | undefined {
  const media = item['media:content']
  if (media) {
    if (Array.isArray(media)) return media[0]?.$?.url
    return (media as { $?: { url?: string } }).$?.url
  }
  return item.enclosure?.url
}
