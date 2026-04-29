'use client'

import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { SIDEBAR_GROUPS } from '@/lib/sources/registry'

const SECTIONS = [
  { key: 'youtube' as const, label: 'Videos' },
  { key: 'spotify' as const, label: 'Podcasts' },
  { key: 'news' as const, label: 'News & Blogs' },
  { key: 'forum' as const, label: 'Forum' },
]

function SidebarInner() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const activeSource = searchParams.get('source')

  function buildHref(source: string | null) {
    const params = new URLSearchParams(searchParams.toString())
    if (source) {
      params.set('source', source)
    } else {
      params.delete('source')
    }
    const qs = params.toString()
    return qs ? `${pathname}?${qs}` : pathname
  }

  return (
    <nav className="py-5 px-3 space-y-5">
      <Link
        href={buildHref(null)}
        className={`block t-label px-2 py-1 rounded transition-colors ${
          !activeSource ? 'text-ink font-semibold' : 'text-ink-muted hover:text-ink'
        }`}
      >
        All sources
      </Link>

      {SECTIONS.map(({ key, label }) => (
        <div key={key}>
          <p className="t-label text-ink-subtle px-2 mb-1">{label}</p>
          <ul className="space-y-0.5">
            {SIDEBAR_GROUPS[key].map((source) => (
              <li key={source.name}>
                <Link
                  href={buildHref(source.name)}
                  className={`block text-sm px-2 py-1 rounded transition-colors truncate ${
                    activeSource === source.name
                      ? 'bg-ink text-canvas'
                      : 'text-ink-muted hover:text-ink hover:bg-card'
                  }`}
                  title={source.name}
                >
                  {source.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  )
}

export function SourceSidebar() {
  return (
    <aside className="hidden lg:block w-52 shrink-0 border-r border-stroke sticky top-14 self-start h-[calc(100vh-3.5rem)] overflow-y-auto">
      <Suspense fallback={<div className="py-5 px-3 space-y-2"><div className="h-3 bg-surface rounded animate-pulse" /></div>}>
        <SidebarInner />
      </Suspense>
    </aside>
  )
}
