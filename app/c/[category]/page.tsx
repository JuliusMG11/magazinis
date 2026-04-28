import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import type { Category, ContentItem } from '@/lib/types'
import { ALL_CATEGORIES, CATEGORY_LABELS } from '@/lib/types'
import { getItemsByCategory } from '@/lib/db/queries'
import { VideoCardInteractive } from '@/components/cards/VideoCardInteractive'
import { PodcastCardInteractive } from '@/components/cards/PodcastCardInteractive'
import { ArticleCard } from '@/components/cards/ArticleCard'
import { ForumCard } from '@/components/cards/ForumCard'
import { MotionCard } from '@/components/cards/MotionCard'

const PAGE_SIZE = 30

interface CategoryPageProps {
  params: Promise<{ category: string }>
  searchParams: Promise<{ page?: string }>
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category } = await params
  if (!ALL_CATEGORIES.includes(category as Category)) return {}
  const label = CATEGORY_LABELS[category as Category]
  return {
    title: `${label} — Daily Digest`,
    description: `The best ${label.toLowerCase()} content from YouTube, podcasts, news, and forums — curated daily.`,
    openGraph: {
      title: `${label} — Daily Digest`,
      description: `The best ${label.toLowerCase()} content, curated daily.`,
      type: 'website',
    },
  }
}

export async function generateStaticParams() {
  return ALL_CATEGORIES.map((category) => ({ category }))
}

function CardByType({ item, size }: { item: ContentItem; size?: 'default' | 'large' }) {
  switch (item.source_type) {
    case 'youtube':
      return <VideoCardInteractive item={item} size={size} />
    case 'spotify':
      return <PodcastCardInteractive item={item} />
    case 'forum':
      return <ForumCard item={item} />
    default:
      return <ArticleCard item={item} size={size} />
  }
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { category } = await params
  const { page: pageParam } = await searchParams

  if (!ALL_CATEGORIES.includes(category as Category)) notFound()

  const cat = category as Category
  const page = Math.max(1, parseInt(pageParam ?? '1', 10) || 1)
  const offset = (page - 1) * PAGE_SIZE

  const items = await getItemsByCategory(cat, { limit: PAGE_SIZE + 1, offset })
  const hasNextPage = items.length > PAGE_SIZE
  const pageItems = hasNextPage ? items.slice(0, PAGE_SIZE) : items
  const label = CATEGORY_LABELS[cat]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-10">
        <p className="t-label text-ink-subtle mb-1">Category</p>
        <h1 className="font-display text-4xl font-bold text-ink">{label}</h1>
      </div>

      {pageItems.length === 0 ? (
        <div className="text-center py-24">
          <p className="font-display text-2xl text-ink-muted font-semibold">Nothing here yet.</p>
          <p className="text-sm text-ink-subtle mt-2">Check back after the next daily run.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {pageItems.map((item, i) => (
            <MotionCard key={item.id} delay={i * 0.03}>
              <CardByType item={item} />
            </MotionCard>
          ))}
        </div>
      )}

      {(page > 1 || hasNextPage) && (
        <div className="flex items-center justify-between mt-12 pt-6 border-t border-stroke">
          {page > 1 ? (
            <a
              href={`/c/${cat}?page=${page - 1}`}
              className="text-sm font-medium text-ink-muted hover:text-ink transition-colors"
            >
              ← Newer
            </a>
          ) : (
            <span />
          )}
          <p className="t-meta">Page {page}</p>
          {hasNextPage ? (
            <a
              href={`/c/${cat}?page=${page + 1}`}
              className="text-sm font-medium text-ink-muted hover:text-ink transition-colors"
            >
              Older →
            </a>
          ) : (
            <span />
          )}
        </div>
      )}
    </div>
  )
}
