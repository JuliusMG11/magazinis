import type { ContentItem, Category } from '../types'

export type FetchedItem = Omit<ContentItem, 'id' | 'fetched_at' | 'created_at'>

export interface SourceAdapter {
  readonly name: string
  fetch(): Promise<FetchedItem[]>
}

// Per-adapter config shapes used by config.ts and each adapter factory
export interface RssSourceConfig {
  name: string
  url: string
  category: Category
}

export interface MediumSourceConfig {
  name: string
  url: string   // e.g. https://medium.com/feed/tag/javascript
  category: Category
}

export interface HnCategoryConfig {
  category: Category
  keywords: string[]
}

export interface RedditSourceConfig {
  subreddit: string
  category: Category
}

export interface YouTubeChannelConfig {
  channelId: string
  name: string
  category: Category
}

export interface SpotifyShowConfig {
  showId: string
  name: string
  category: Category
}
