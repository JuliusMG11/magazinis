import { desc, eq } from 'drizzle-orm'
import { db } from './client'
import { contentItems } from './schema'
import type { ContentItem, Category } from '../types'

export async function getRecentItems(opts: {
  category?: Category
  limit?: number
  offset?: number
}): Promise<ContentItem[]> {
  const { category, limit = 20, offset = 0 } = opts

  const rows = await db
    .select()
    .from(contentItems)
    .where(category ? eq(contentItems.category, category) : undefined)
    .orderBy(desc(contentItems.published_at))
    .limit(limit)
    .offset(offset)

  return rows.map(rowToContentItem)
}

export async function getHeroItem(): Promise<ContentItem | null> {
  const [row] = await db
    .select()
    .from(contentItems)
    .orderBy(desc(contentItems.published_at))
    .limit(1)

  return row ? rowToContentItem(row) : null
}

export async function getItemsByCategory(
  category: Category,
  limit = 20,
): Promise<ContentItem[]> {
  const rows = await db
    .select()
    .from(contentItems)
    .where(eq(contentItems.category, category))
    .orderBy(desc(contentItems.published_at))
    .limit(limit)

  return rows.map(rowToContentItem)
}

export async function upsertItem(
  item: Omit<ContentItem, 'id' | 'fetched_at' | 'created_at'>,
): Promise<'inserted' | 'skipped'> {
  const result = await db
    .insert(contentItems)
    .values({
      source_type: item.source_type,
      source_name: item.source_name,
      category: item.category,
      title: item.title,
      excerpt: item.excerpt,
      url: item.url,
      thumbnail_url: item.thumbnail_url,
      author: item.author,
      duration: item.duration,
      embed_html: item.embed_html,
      published_at: new Date(item.published_at),
      fetched_at: new Date(),
    })
    .onConflictDoNothing({ target: contentItems.url })

  return result.length === 0 ? 'skipped' : 'inserted'
}

function rowToContentItem(row: typeof contentItems.$inferSelect): ContentItem {
  return {
    id: row.id,
    source_type: row.source_type,
    source_name: row.source_name,
    category: row.category,
    title: row.title,
    excerpt: row.excerpt ?? undefined,
    url: row.url,
    thumbnail_url: row.thumbnail_url ?? undefined,
    author: row.author ?? undefined,
    duration: row.duration ?? undefined,
    embed_html: row.embed_html ?? undefined,
    published_at: row.published_at.toISOString(),
    fetched_at: row.fetched_at.toISOString(),
    created_at: row.created_at.toISOString(),
  }
}
