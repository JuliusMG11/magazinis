import { ALL_CATEGORIES, CATEGORY_LABELS } from '@/lib/types'
import { getLastCronRun } from '@/lib/db/queries'
import { formatRelativeTime } from '@/lib/utils'

const SOURCES = [
  'YouTube', 'Spotify', 'Hacker News', 'Medium',
  'TechCrunch', 'Sifted', 'web.dev', 'Vercel Blog',
  'Anthropic Blog', 'The Decoder',
]

export async function Footer() {
  let lastRun = null
  try {
    lastRun = await getLastCronRun()
  } catch {
    // DB unavailable during build or deploy — show fallback
  }
  const lastUpdatedText = lastRun?.finished_at
    ? `Updated ${formatRelativeTime(lastRun.finished_at)}`
    : 'Updated daily at 07:00 CET'

  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-stroke mt-24 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-10">
          <div>
            <p className="font-display font-bold text-lg text-ink mb-2">Tech Magazinis</p>
            <p className="text-sm text-ink-muted leading-relaxed max-w-xs">
              A daily curated magazine pulling the best of tech, startups, and AI from across the web.
            </p>
          </div>
          <div>
            <p className="t-label text-ink-subtle mb-3">Categories</p>
            <ul className="space-y-1.5">
              {ALL_CATEGORIES.map((cat) => (
                <li key={cat}>
                  <a
                    href={`/?category=${cat}`}
                    className="text-sm text-ink-muted hover:text-ink transition-colors"
                  >
                    {CATEGORY_LABELS[cat]}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="t-label text-ink-subtle mb-3">Sources</p>
            <p className="text-sm text-ink-muted leading-relaxed">
              {SOURCES.join(' · ')}
            </p>
          </div>
        </div>
        <div className="pt-6 border-t border-stroke-subtle flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <p className="t-meta">{lastUpdatedText}</p>
          <p className="t-meta">© {year} Tech Magazinis — personal project, no commercial affiliation</p>
        </div>
      </div>
    </footer>
  )
}
