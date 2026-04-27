import Image from 'next/image'
import type { ContentItem } from '@/lib/types'
import { CATEGORY_LABELS, type Category } from '@/lib/types'
import { getCategoryColor, formatDate } from '@/lib/utils'

interface ArticleCardProps {
  item: ContentItem
  size?: 'default' | 'large'
}

export function ArticleCard({ item, size = 'default' }: ArticleCardProps) {
  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block bg-card rounded-[--radius-card] overflow-hidden border border-stroke hover:border-ink-subtle transition-all duration-200"
      style={{ boxShadow: 'var(--shadow-card)' }}
    >
      {item.thumbnail_url && (
        <div className="relative aspect-[16/9] overflow-hidden bg-card-elevated">
          <Image
            src={item.thumbnail_url}
            alt={item.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
      )}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className={`t-label ${getCategoryColor(item.category as Category)}`}>
            {CATEGORY_LABELS[item.category as Category]}
          </span>
          <span className="t-label text-ink-subtle">·</span>
          <span className="t-label text-ink-subtle">{item.source_name}</span>
        </div>
        <h3
          className={`font-display font-semibold text-ink leading-snug group-hover:underline decoration-ink-subtle underline-offset-2 ${
            size === 'large' ? 't-display-md' : 'text-base'
          }`}
        >
          {item.title}
        </h3>
        {item.excerpt && (
          <p className="text-sm text-ink-muted mt-2 leading-relaxed line-clamp-3">
            {item.excerpt}
          </p>
        )}
        <div className="flex items-center gap-2 mt-3">
          {item.author && <p className="t-meta">{item.author}</p>}
          {item.author && <span className="t-meta">·</span>}
          <p className="t-meta">{formatDate(item.published_at)}</p>
        </div>
      </div>
    </a>
  )
}
