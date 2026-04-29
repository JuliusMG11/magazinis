'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ALL_CATEGORIES, CATEGORY_LABELS, type Category } from '@/lib/types'

export function CategoryPills() {
  const pathname = usePathname()

  const activeCategory = pathname.startsWith('/c/')
    ? (pathname.split('/c/')[1]?.split('/')[0] as Category | undefined)
    : null

  const pillClass = (isActive: boolean) =>
    `t-label px-3 py-1.5 rounded-pill transition-colors ${
      isActive
        ? 'bg-ink text-canvas'
        : 'text-ink-muted hover:text-ink hover:bg-card'
    }`

  return (
    <nav aria-label="Browse by category" className="flex items-center gap-1.5 flex-wrap">
      <Link href="/" className={pillClass(!activeCategory)}>
        All
      </Link>
      {ALL_CATEGORIES.map((cat) => (
        <Link key={cat} href={`/c/${cat}`} className={pillClass(activeCategory === cat)}>
          {CATEGORY_LABELS[cat]}
        </Link>
      ))}
    </nav>
  )
}
