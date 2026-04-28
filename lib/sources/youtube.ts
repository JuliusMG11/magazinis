import type { SourceAdapter, FetchedItem, YouTubeChannelConfig } from './types'

const YT_API = 'https://www.googleapis.com/youtube/v3'
const FETCH_WINDOW_MS = 30 * 60 * 60 * 1000

interface YTSearchItem {
  id: { videoId: string }
}

interface YTVideoItem {
  id: string
  snippet: {
    title: string
    description: string
    publishedAt: string
    thumbnails: {
      maxres?: { url: string }
      high?: { url: string }
      medium?: { url: string }
      default?: { url: string }
    }
  }
  contentDetails: { duration: string } // ISO 8601 e.g. PT1H2M3S
}

export function createYoutubeAdapter(
  config: YouTubeChannelConfig,
  apiKey: string,
): SourceAdapter {
  return {
    name: config.name,
    async fetch(): Promise<FetchedItem[]> {
      const publishedAfter = new Date(Date.now() - FETCH_WINDOW_MS).toISOString()

      const searchParams = new URLSearchParams({
        key: apiKey,
        channelId: config.channelId,
        type: 'video',
        publishedAfter,
        part: 'snippet',
        maxResults: '10',
        order: 'date',
      })
      const searchRes = await fetch(`${YT_API}/search?${searchParams}`)
      if (!searchRes.ok) {
        throw new Error(`YouTube search for ${config.name}: HTTP ${searchRes.status}`)
      }
      const searchData = (await searchRes.json()) as { items?: YTSearchItem[] }
      if (!searchData.items?.length) return []

      const videoIds = searchData.items.map(i => i.id.videoId).join(',')
      const videosParams = new URLSearchParams({
        key: apiKey,
        id: videoIds,
        part: 'snippet,contentDetails',
      })
      const videosRes = await fetch(`${YT_API}/videos?${videosParams}`)
      if (!videosRes.ok) {
        throw new Error(`YouTube videos for ${config.name}: HTTP ${videosRes.status}`)
      }
      const videosData = (await videosRes.json()) as { items?: YTVideoItem[] }
      if (!videosData.items?.length) return []

      return videosData.items.map((video): FetchedItem => ({
        source_type: 'youtube',
        source_name: config.name,
        category: config.category,
        title: video.snippet.title,
        excerpt: video.snippet.description?.slice(0, 280) || undefined,
        url: `https://www.youtube.com/watch?v=${video.id}`,
        thumbnail_url:
          video.snippet.thumbnails.maxres?.url ??
          video.snippet.thumbnails.high?.url ??
          video.snippet.thumbnails.medium?.url ??
          video.snippet.thumbnails.default?.url,
        author: config.name,
        duration: parseDuration(video.contentDetails.duration),
        published_at: video.snippet.publishedAt,
      }))
    },
  }
}

// PT1H2M3S → 3723 seconds
function parseDuration(iso8601: string): number {
  const match = iso8601.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
  if (!match) return 0
  return (
    parseInt(match[1] ?? '0') * 3600 +
    parseInt(match[2] ?? '0') * 60 +
    parseInt(match[3] ?? '0')
  )
}
