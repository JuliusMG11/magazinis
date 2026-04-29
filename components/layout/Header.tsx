import { Suspense } from 'react'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { CategoryPills } from '@/components/ui/CategoryPills'

function DateDisplay() {
  const now = new Date()
  const formatted = new Intl.DateTimeFormat('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(now)

  return (
    <span className="t-meta text-ink-subtle hidden sm:block">
      {formatted}
    </span>
  )
}

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-canvas/90 backdrop-blur-sm border-b border-stroke">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-4">
            <a href="/" className="flex items-center gap-2 group">
              <span
                className="font-display font-bold text-xl tracking-tight text-ink"
                style={{ fontVariantLigatures: 'none' }}
              >
                Tech Magazinis
              </span>
            </a>
            <DateDisplay />
          </div>
          <ThemeToggle />
        </div>
        <div className="pb-3">
          <Suspense fallback={<div className="h-8" />}>
            <CategoryPills />
          </Suspense>
        </div>
      </div>
    </header>
  )
}
