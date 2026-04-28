import type { SourceAdapter, FetchedItem, SpotifyShowConfig } from './types'

const SPOTIFY_TOKEN_URL = 'https://accounts.spotify.com/api/token'
const SPOTIFY_API = 'https://api.spotify.com/v1'
const FETCH_WINDOW_MS = 30 * 60 * 60 * 1000

interface SpotifyEpisode {
  id: string
  name: string
  description: string
  release_date: string   // YYYY-MM-DD
  duration_ms: number
  external_urls: { spotify: string }
  images: Array<{ url: string; width: number; height: number }>
}

async function getAccessToken(clientId: string, clientSecret: string): Promise<string> {
  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')
  const res = await fetch(SPOTIFY_TOKEN_URL, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  })
  if (!res.ok) throw new Error(`Spotify token request failed: HTTP ${res.status}`)
  const data = (await res.json()) as { access_token: string }
  return data.access_token
}

export function createSpotifyAdapter(
  config: SpotifyShowConfig,
  clientId: string,
  clientSecret: string,
): SourceAdapter {
  return {
    name: config.name,
    async fetch(): Promise<FetchedItem[]> {
      const token = await getAccessToken(clientId, clientSecret)
      const since = new Date(Date.now() - FETCH_WINDOW_MS)

      const params = new URLSearchParams({ limit: '10', market: 'US' })
      const res = await fetch(`${SPOTIFY_API}/shows/${config.showId}/episodes?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) {
        throw new Error(`Spotify episodes for ${config.name}: HTTP ${res.status}`)
      }
      const data = (await res.json()) as { items: SpotifyEpisode[] }

      return data.items
        .filter(ep => ep != null && new Date(ep.release_date) >= since)
        .map((ep): FetchedItem => ({
          source_type: 'spotify',
          source_name: config.name,
          category: config.category,
          title: ep.name,
          excerpt: ep.description?.slice(0, 280) || undefined,
          url: ep.external_urls.spotify,
          thumbnail_url: ep.images[0]?.url,
          author: config.name,
          duration: Math.round(ep.duration_ms / 1000),
          published_at: new Date(ep.release_date).toISOString(),
        }))
    },
  }
}
