import Image from 'next/image'
import { Play } from 'lucide-react'
import type { ContentItem } from '@/lib/types'
import { CATEGORY_LABELS, type Category } from '@/lib/types'
import { formatDuration, getCategoryColor } from '@/lib/utils'

interface VideoCardProps {
  item: ContentItem
  size?: 'default' | 'large'
}

export function VideoCard({ item, size = 'default' }: VideoCardProps) {
  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block bg-card rounded-[--radius-card] overflow-hidden border border-stroke hover:border-ink-subtle transition-all duration-200"
      style={{ boxShadow: 'var(--shadow-card)' }}
    >
      <div className="relative aspect-video overflow-hidden bg-card-elevated">
        {item.thumbnail_url ? (
          <Image
            src={item.thumbnail_url}
            alt={item.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 bg-stroke" />
        )}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-ink/20">
          <div className="bg-canvas rounded-full p-3">
            <Play size={20} className="text-ink fill-ink ml-0.5" />
          </div>
        </div>
        {item.duration != null && (
          <div className="absolute bottom-2 right-2 bg-ink/80 text-canvas text-xs font-mono px-1.5 py-0.5 rounded">
            {formatDuration(item.duration)}
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className={`t-label ${getCategoryColor(item.category as Category)}`}>
            {CATEGORY_LABELS[item.category as Category]}
          </span>
          <span className="t-label text-ink-subtle">·</span>
          <span className="t-label text-ink-subtle">YouTube</span>
        </div>
        <h3
          className={`font-display font-semibold text-ink group-hover:text-ink transition-colors leading-snug ${
            size === 'large' ? 't-display-md' : 'text-base'
          }`}
        >
          {item.title}
        </h3>
        <p className="t-meta mt-2">{item.source_name}</p>
      </div>
    </a>
  )
}
