import type { SourceAdapter, FetchedItem, RedditSourceConfig } from './types'

const FETCH_WINDOW_MS = 30 * 60 * 60 * 1000

interface RedditPost {
  data: {
    title: string
    permalink: string
    selftext: string
    score: number
    num_comments: number
    created_utc: number
    thumbnail: string
    stickied: boolean
    author: string
  }
}

interface RedditResponse {
  data: { children: RedditPost[] }
}

export function createRedditAdapter(config: RedditSourceConfig): SourceAdapter {
  return {
    name: `r/${config.subreddit}`,
    async fetch(): Promise<FetchedItem[]> {
      const url = `https://www.reddit.com/r/${config.subreddit}.json?limit=25`
      const res = await fetch(url, {
        headers: { 'User-Agent': 'daily-digest-aggregator/1.0' },
      })
      if (!res.ok) throw new Error(`Reddit r/${config.subreddit}: HTTP ${res.status}`)

      const data = (await res.json()) as RedditResponse
      const since = new Date(Date.now() - FETCH_WINDOW_MS)

      return data.data.children
        .filter(({ data: post }) => {
          if (post.stickied) return false
          return new Date(post.created_utc * 1000) >= since
        })
        .map(({ data: post }) => {
          const thumbnail =
            post.thumbnail && post.thumbnail.startsWith('http') ? post.thumbnail : undefined
          const excerpt = post.selftext
            ? post.selftext.slice(0, 250)
            : `${post.score} upvotes · ${post.num_comments} comments`

          return {
            source_type: 'forum' as const,
            source_name: `r/${config.subreddit}`,
            category: config.category,
            title: post.title,
            excerpt,
            url: `https://www.reddit.com${post.permalink}`,
            thumbnail_url: thumbnail,
            author: post.author,
            published_at: new Date(post.created_utc * 1000).toISOString(),
          }
        })
    },
  }
}
