import { RSS_SOURCES, MEDIUM_SOURCES, YOUTUBE_CHANNELS, SPOTIFY_SHOWS, REDDIT_SOURCES } from './config'

export interface SidebarSource {
  name: string // exact source_name stored in DB
}

export const SIDEBAR_GROUPS = {
  youtube: YOUTUBE_CHANNELS.map((s) => ({ name: s.name })),
  spotify: SPOTIFY_SHOWS.map((s) => ({ name: s.name })),
  news: [
    ...RSS_SOURCES.map((s) => ({ name: s.name })),
    ...MEDIUM_SOURCES.map((s) => ({ name: s.name })),
  ],
  forum: [
    { name: 'Hacker News' },
    ...REDDIT_SOURCES.map((s) => ({ name: `r/${s.subreddit}` })),
  ],
} satisfies Record<string, SidebarSource[]>
