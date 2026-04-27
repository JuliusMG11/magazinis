import Image from 'next/image'
import { Play, Headphones, ExternalLink } from 'lucide-react'
import type { ContentItem } from '@/lib/types'
import { CATEGORY_LABELS, type Category } from '@/lib/types'
import { getCategoryColor, getCategoryDimBg, formatDate, formatDuration } from '@/lib/utils'

interface HeroCardProps {
  item: ContentItem
}

const SOURCE_ICON = {
  youtube: Play,
  spotify: Headphones,
  medium: ExternalLink,
  rss: ExternalLink,
  forum: ExternalLink,
}

export function HeroCard({ item }: HeroCardProps) {
  const Icon = SOURCE_ICON[item.source_type] ?? ExternalLink

  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative block w-full overflow-hidden rounded-[--radius-card] border border-stroke hover:border-ink-subtle transition-all duration-300 bg-card"
      style={{ boxShadow: 'var(--shadow-card)' }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[360px]">
        {item.thumbnail_url && (
          <div className="relative overflow-hidden bg-card-elevated lg:order-last min-h-[240px] lg:min-h-0">
            <Image
              src={item.thumbnail_url}
              alt={item.title}
              fill
              priority
              className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-card/20 to-transparent lg:bg-gradient-to-r" />
          </div>
        )}
        <div className="flex flex-col justify-between p-6 lg:p-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span
                className={`t-label px-2.5 py-1 rounded-pill ${getCategoryColor(item.category as Category)} ${getCategoryDimBg(item.category as Category)}`}
              >
                {CATEGORY_LABELS[item.category as Category]}
              </span>
              <div className="flex items-center gap-1.5 text-ink-muted">
                <Icon size={13} strokeWidth={1.5} />
                <span className="t-label">{item.source_name}</span>
              </div>
            </div>
            <h2 className="t-display-lg text-ink group-hover:underline decoration-ink-subtle underline-offset-4 mb-4">
              {item.title}
            </h2>
            {item.excerpt && (
              <p className="text-base text-ink-muted leading-relaxed line-clamp-3">
                {item.excerpt}
              </p>
            )}
          </div>
          <div className="flex items-center gap-3 mt-6 pt-4 border-t border-stroke-subtle">
            {item.author && <p className="t-meta">{item.author}</p>}
            {item.author && <span className="t-meta">·</span>}
            <p className="t-meta">{formatDate(item.published_at)}</p>
            {item.duration != null && (
              <>
                <span className="t-meta">·</span>
                <p className="t-meta">{formatDuration(item.duration)}</p>
              </>
            )}
          </div>
        </div>
      </div>
    </a>
  )
}
