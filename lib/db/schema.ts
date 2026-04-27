import {
  pgTable,
  text,
  integer,
  timestamp,
  uuid,
  jsonb,
  index,
} from 'drizzle-orm/pg-core'
import type { Category, SourceType } from '../types'

export const contentItems = pgTable(
  'content_items',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    source_type: text('source_type').$type<SourceType>().notNull(),
    source_name: text('source_name').notNull(),
    category: text('category').$type<Category>().notNull(),
    title: text('title').notNull(),
    excerpt: text('excerpt'),
    url: text('url').notNull().unique(),
    thumbnail_url: text('thumbnail_url'),
    author: text('author'),
    duration: integer('duration'),
    embed_html: text('embed_html'),
    published_at: timestamp('published_at', { withTimezone: true }).notNull(),
    fetched_at: timestamp('fetched_at', { withTimezone: true }).notNull().defaultNow(),
    created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index('idx_content_published_at').on(table.published_at),
    index('idx_content_category').on(table.category, table.published_at),
    index('idx_content_source_type').on(table.source_type),
  ],
)

export const cronRuns = pgTable('cron_runs', {
  id: uuid('id').primaryKey().defaultRandom(),
  started_at: timestamp('started_at', { withTimezone: true }).notNull().defaultNow(),
  finished_at: timestamp('finished_at', { withTimezone: true }),
  items_added: integer('items_added').default(0),
  items_skipped: integer('items_skipped').default(0),
  errors: jsonb('errors'),
})

export type ContentItemRow = typeof contentItems.$inferSelect
export type NewContentItem = typeof contentItems.$inferInsert
export type CronRunRow = typeof cronRuns.$inferSelect
export type NewCronRun = typeof cronRuns.$inferInsert
