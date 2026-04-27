import { MessageSquare, ExternalLink } from 'lucide-react'
import type { ContentItem } from '@/lib/types'
import { CATEGORY_LABELS, type Category } from '@/lib/types'
import { getCategoryColor, getCategoryDimBg, formatDate } from '@/lib/utils'

interface ForumCardProps {
  item: ContentItem
}

export function ForumCard({ item }: ForumCardProps) {
  const commentMatch = item.excerpt?.match(/(\d+)\s+comments?/i)
  const commentCount = commentMatch ? parseInt(commentMatch[1], 10) : null

  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block bg-card rounded-[--radius-card] p-4 border border-stroke hover:border-ink-subtle transition-all duration-200"
      style={{ boxShadow: 'var(--shadow-card)' }}
    >
      <div className="flex items-center gap-2 mb-3">
        <span
          className={`t-label px-2 py-0.5 rounded-pill ${getCategoryColor(item.category as Category)} ${getCategoryDimBg(item.category as Category)}`}
        >
          {item.source_name}
        </span>
        <span className="t-label text-ink-subtle">{CATEGORY_LABELS[item.category as Category]}</span>
      </div>
      <h3 className="font-display font-semibold text-ink text-base leading-snug group-hover:underline decoration-ink-subtle underline-offset-2">
        {item.title}
      </h3>
      <div className="flex items-center gap-3 mt-3">
        {commentCount != null && (
          <div className="flex items-center gap-1 text-ink-muted">
            <MessageSquare size={13} strokeWidth={1.5} />
            <span className="t-meta">{commentCount.toLocaleString()}</span>
          </div>
        )}
        <p className="t-meta">{formatDate(item.published_at)}</p>
        <ExternalLink size={12} className="text-ink-subtle ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </a>
  )
}
