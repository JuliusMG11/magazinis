import { createRssAdapter } from './rss'
import { createMediumAdapter } from './medium'
import { createYoutubeAdapter } from './youtube'
import { createSpotifyAdapter } from './spotify'
import { RSS_SOURCES, MEDIUM_SOURCES, YOUTUBE_CHANNELS, SPOTIFY_SHOWS } from './config'
import type { SourceAdapter } from './types'

export function getAllAdapters(): SourceAdapter[] {
  const adapters: SourceAdapter[] = []

  for (const c of RSS_SOURCES) adapters.push(createRssAdapter(c))
  for (const c of MEDIUM_SOURCES) adapters.push(createMediumAdapter(c))

  const ytKey = process.env.YOUTUBE_API_KEY
  if (ytKey) {
    for (const c of YOUTUBE_CHANNELS) adapters.push(createYoutubeAdapter(c, ytKey))
  }

  const spotifyId = process.env.SPOTIFY_CLIENT_ID
  const spotifySecret = process.env.SPOTIFY_CLIENT_SECRET
  if (spotifyId && spotifySecret) {
    for (const c of SPOTIFY_SHOWS) adapters.push(createSpotifyAdapter(c, spotifyId, spotifySecret))
  }

  return adapters
}
