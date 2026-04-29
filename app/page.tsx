import type { Metadata } from 'next'
import type { Category, ContentItem } from '@/lib/types'
import { CATEGORY_LABELS, ALL_CATEGORIES } from '@/lib/types'
import { getHeroItem, getRecentItems } from '@/lib/db/queries'
import { HeroCard } from '@/components/cards/HeroCard'
import { VideoCardInteractive } from '@/components/cards/VideoCardInteractive'
import { PodcastCardInteractive } from '@/components/cards/PodcastCardInteractive'
import { ArticleCard } from '@/components/cards/ArticleCard'
import { ForumCard } from '@/components/cards/ForumCard'
import { MotionCard } from '@/components/cards/MotionCard'

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

interface HomePageProps {
  searchParams: Promise<{ category?: string }>
}

export async function generateMetadata({
  searchParams,
}: HomePageProps): Promise<Metadata> {
  const { category } = await searchParams
  if (category && ALL_CATEGORIES.includes(category as Category)) {
    const label = CATEGORY_LABELS[category as Category]
    return {
      title: `${label} — Daily Digest`,
      description: `Today's best ${label.toLowerCase()} content, curated daily.`,
    }
  }
  return {}
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const { category } = await searchParams
  const activeCategory = category as Category | undefined

  const hero = await getHeroItem()
  const rest = await getRecentItems({ category: activeCategory, limit: 30 })
  const gridItems = hero ? rest.filter((item) => item.id !== hero.id) : rest

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {hero && (
        <section className="mb-12">
          <p className="t-label text-ink-subtle mb-4">Today&apos;s lead story</p>
          <MotionCard>
            <HeroCard item={hero} />
          </MotionCard>
        </section>
      )}

      {gridItems.length > 0 && (
        <section>
          <div className="flex items-center gap-4 mb-6">
            <p className="t-label text-ink-subtle">Latest</p>
            <div className="flex-1 h-px bg-stroke" />
          </div>
          <MagazineGrid items={gridItems} />
        </section>
      )}

      {!hero && gridItems.length === 0 && (
        <div className="text-center py-24">
          <p className="font-display text-2xl text-ink-muted font-semibold">
            Nothing here yet.
          </p>
          <p className="text-sm text-ink-subtle mt-2">
            Check back after the next daily run.
          </p>
        </div>
      )}
    </div>
  )
}

function MagazineGrid({ items }: { items: ContentItem[] }) {
  const rows: ContentItem[][] = []
  let i = 0
  let rowPattern = 0

  while (i < items.length) {
    const patterns = [2, 3, 2, 2]
    const count = patterns[rowPattern % patterns.length]
    rows.push(items.slice(i, i + count))
    i += count
    rowPattern++
  }

  let globalIdx = 0

  return (
    <div className="space-y-6">
      {rows.map((row, rowIdx) => {
        const rowItems = row
        const startIdx = globalIdx
        globalIdx += rowItems.length

        const patternIdx = rowIdx % 4

        if (rowItems.length === 1) {
          return (
            <div key={rowIdx} className="grid grid-cols-1">
              <MotionCard delay={startIdx * 0.04}>
                <CardByType item={rowItems[0]} size="large" />
              </MotionCard>
            </div>
          )
        }

        if (rowItems.length === 3) {
          return (
            <div key={rowIdx} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {rowItems.map((item, j) => (
                <MotionCard key={item.id} delay={(startIdx + j) * 0.04}>
                  <CardByType item={item} />
                </MotionCard>
              ))}
            </div>
          )
        }

        const isWideLeft = patternIdx === 0
        const isWideRight = patternIdx === 2

        if (isWideLeft && rowItems.length === 2) {
          return (
            <div key={rowIdx} className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              <div className="lg:col-span-7">
                <MotionCard delay={startIdx * 0.04}>
                  <CardByType item={rowItems[0]} size="large" />
                </MotionCard>
              </div>
              <div className="lg:col-span-5">
                <MotionCard delay={(startIdx + 1) * 0.04}>
                  <CardByType item={rowItems[1]} />
                </MotionCard>
              </div>
            </div>
          )
        }

        if (isWideRight && rowItems.length === 2) {
          return (
            <div key={rowIdx} className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              <div className="lg:col-span-5">
                <MotionCard delay={startIdx * 0.04}>
                  <CardByType item={rowItems[0]} />
                </MotionCard>
              </div>
              <div className="lg:col-span-7">
                <MotionCard delay={(startIdx + 1) * 0.04}>
                  <CardByType item={rowItems[1]} size="large" />
                </MotionCard>
              </div>
            </div>
          )
        }

        return (
          <div key={rowIdx} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {rowItems.map((item, j) => (
              <MotionCard key={item.id} delay={(startIdx + j) * 0.04}>
                <CardByType item={item} />
              </MotionCard>
            ))}
          </div>
        )
      })}
    </div>
  )
}
