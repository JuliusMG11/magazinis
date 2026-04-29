import { desc, eq, isNotNull, and } from 'drizzle-orm'
import { db } from './client'
import { contentItems, cronRuns } from './schema'
import type { CronRunRow } from './schema'
import type { ContentItem, Category } from '../types'

export async function getRecentItems(opts: {
  category?: Category
  source?: string
  limit?: number
  offset?: number
}): Promise<ContentItem[]> {
  const { category, source, limit = 20, offset = 0 } = opts

  const rows = await db
    .select()
    .from(contentItems)
    .where(and(
      category ? eq(contentItems.category, category) : undefined,
      source ? eq(contentItems.source_name, source) : undefined,
    ))
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
  opts: { limit?: number; offset?: number; source?: string } = {},
): Promise<ContentItem[]> {
  const { limit = 20, offset = 0, source } = opts

  const rows = await db
    .select()
    .from(contentItems)
    .where(and(
      eq(contentItems.category, category),
      source ? eq(contentItems.source_name, source) : undefined,
    ))
    .orderBy(desc(contentItems.published_at))
    .limit(limit)
    .offset(offset)

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

export async function insertCronRun(): Promise<string> {
  const [row] = await db
    .insert(cronRuns)
    .values({})
    .returning({ id: cronRuns.id })
  if (!row) throw new Error('cron run insert returned no row')
  return row.id
}

export async function finishCronRun(
  id: string,
  data: { items_added: number; items_skipped: number; errors: unknown },
): Promise<void> {
  await db
    .update(cronRuns)
    .set({
      finished_at: new Date(),
      items_added: data.items_added,
      items_skipped: data.items_skipped,
      errors: data.errors as any,
    })
    .where(eq(cronRuns.id, id))
}

export async function getLastCronRun(): Promise<CronRunRow | null> {
  const [row] = await db
    .select()
    .from(cronRuns)
    .where(isNotNull(cronRuns.finished_at))
    .orderBy(desc(cronRuns.finished_at))
    .limit(1)
  return row ?? null
}
