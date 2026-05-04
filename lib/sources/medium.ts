import Parser from 'rss-parser'
import type { SourceAdapter, FetchedItem, MediumSourceConfig } from './types'

type MediumItem = {
  title?: string
  link?: string
  guid?: string
  isoDate?: string
  pubDate?: string
  contentSnippet?: string
  creator?: string
  'content:encoded'?: string
  'media:content'?: { $?: { url?: string } } | Array<{ $?: { url?: string } }>
}

const parser = new Parser<Record<string, unknown>, MediumItem>({
  customFields: {
    item: [
      ['content:encoded', 'content:encoded'],
      ['media:content', 'media:content', { keepArray: false }],
    ],
  },
  requestOptions: {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; TechMagazinis/1.0)' },
  },
})

const FETCH_WINDOW_MS = 30 * 60 * 60 * 1000
const MIN_FOLLOWERS = 1_000

// Per-run in-memory cache — avoids duplicate lookups for the same author
const followerCache = new Map<string, number>()

function extractUsername(url: string): string | null {
  const match = url.match(/medium\.com\/@([A-Za-z0-9_.-]+)\//)
  return match?.[1] ?? null
}

async function getFollowerCount(username: string): Promise<number> {
  const cached = followerCache.get(username)
  if (cached !== undefined) return cached

  try {
    const res = await fetch(`https://medium.com/@${username}?format=json`, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; TechMagazinis/1.0)' },
    })
    if (!res.ok) return Infinity // fail open: don't discard on API error
    const text = await res.text()
    const jsonStart = text.indexOf('{')
    if (jsonStart === -1) return Infinity
    const data = JSON.parse(text.slice(jsonStart)) as {
      payload?: { user?: { socialStats?: { followerCount?: number } } }
    }
    const count = data?.payload?.user?.socialStats?.followerCount ?? Infinity
    followerCache.set(username, count)
    return count
  } catch {
    return Infinity // fail open
  }
}

export function createMediumAdapter(config: MediumSourceConfig): SourceAdapter {
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

        // Strip query params from Medium canonical URLs
        const url = item.link.split('?')[0]

        const username = extractUsername(url)
        if (username) {
          const followers = await getFollowerCount(username)
          if (followers < MIN_FOLLOWERS) continue
        }

        items.push({
          source_type: 'medium',
          source_name: config.name,
          category: config.category,
          title: item.title.trim(),
          excerpt: item.contentSnippet?.slice(0, 300) || undefined,
          url,
          thumbnail_url: extractMediumThumbnail(item),
          author: item.creator ?? undefined,
          published_at: pubDate.toISOString(),
        })
      }

      return items
    },
  }
}

function extractMediumThumbnail(item: MediumItem): string | undefined {
  const media = item['media:content']
  if (media) {
    if (Array.isArray(media)) {
      const url = media[0]?.$?.url
      if (url) return url
    } else {
      const url = (media as { $?: { url?: string } }).$?.url
      if (url) return url
    }
  }
  const encoded = item['content:encoded']
  if (encoded) {
    const match = encoded.match(/<img[^>]+src="([^"]+)"/)
    if (match?.[1]) return match[1]
  }
  return undefined
}
