import Image from 'next/image'
import { Headphones } from 'lucide-react'
import type { ContentItem } from '@/lib/types'
import { CATEGORY_LABELS, type Category } from '@/lib/types'
import { formatDuration, getCategoryColor } from '@/lib/utils'

interface PodcastCardProps {
  item: ContentItem
}

export function PodcastCard({ item }: PodcastCardProps) {
  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex gap-4 bg-card rounded-[--radius-card] p-4 border border-stroke hover:border-ink-subtle transition-all duration-200"
      style={{ boxShadow: 'var(--shadow-card)' }}
    >
      <div className="relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-card-elevated">
        {item.thumbnail_url ? (
          <Image
            src={item.thumbnail_url}
            alt={item.title}
            fill
            className="object-cover"
            sizes="80px"
          />
        ) : (
          <div className="absolute inset-0 bg-stroke flex items-center justify-center">
            <Headphones size={24} className="text-ink-subtle" />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1.5">
          <span className={`t-label ${getCategoryColor(item.category as Category)}`}>
            {CATEGORY_LABELS[item.category as Category]}
          </span>
        </div>
        <h3 className="font-display font-semibold text-ink text-sm leading-snug line-clamp-2 group-hover:underline decoration-ink-subtle underline-offset-2">
          {item.title}
        </h3>
        <div className="flex items-center gap-2 mt-2">
          <p className="t-meta truncate">{item.source_name}</p>
          {item.duration != null && (
            <>
              <span className="t-meta">·</span>
              <p className="t-meta flex-shrink-0">{formatDuration(item.duration)}</p>
            </>
          )}
        </div>
      </div>
    </a>
  )
}
