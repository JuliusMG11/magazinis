'use client'

import { useEmbedDrawer } from '@/components/ui/EmbedDrawer'
import { PodcastCard } from './PodcastCard'
import { getEmbedUrl } from '@/lib/utils'
import type { ContentItem } from '@/lib/types'

interface Props {
  item: ContentItem
}

export function PodcastCardInteractive({ item }: Props) {
  const { openDrawer } = useEmbedDrawer()
  const embedUrl = getEmbedUrl(item)

  function handleClick(e: React.MouseEvent) {
    if (!embedUrl) return
    if (window.innerWidth < 768) return
    e.preventDefault()
    openDrawer(embedUrl, item.title)
  }

  return (
    <div onClick={handleClick} className={embedUrl ? 'cursor-pointer' : undefined}>
      <PodcastCard item={item} />
    </div>
  )
}
