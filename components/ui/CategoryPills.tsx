'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { ALL_CATEGORIES, CATEGORY_LABELS, type Category } from '@/lib/types'

export function CategoryPills() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const active = searchParams.get('category') as Category | null

  const setCategory = (cat: Category | null) => {
    const params = new URLSearchParams(searchParams.toString())
    if (cat) {
      params.set('category', cat)
    } else {
      params.delete('category')
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }

  return (
    <nav aria-label="Filter by category" className="flex items-center gap-1.5 flex-wrap">
      <button
        onClick={() => setCategory(null)}
        className={`t-label px-3 py-1.5 rounded-pill transition-colors ${
          !active
            ? 'bg-ink text-canvas'
            : 'text-ink-muted hover:text-ink hover:bg-card'
        }`}
      >
        All
      </button>
      {ALL_CATEGORIES.map((cat) => (
        <button
          key={cat}
          onClick={() => setCategory(cat)}
          className={`t-label px-3 py-1.5 rounded-pill transition-colors ${
            active === cat
              ? 'bg-ink text-canvas'
              : 'text-ink-muted hover:text-ink hover:bg-card'
          }`}
        >
          {CATEGORY_LABELS[cat]}
        </button>
      ))}
    </nav>
  )
}
