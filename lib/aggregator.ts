import { upsertItem } from './db/queries'
import type { SourceAdapter } from './sources/types'

export interface AggregationResult {
  added: number
  skipped: number
  errors: Array<{ source: string; message: string }>
}

export async function runAggregation(adapters: SourceAdapter[]): Promise<AggregationResult> {
  const result: AggregationResult = { added: 0, skipped: 0, errors: [] }

  for (const adapter of adapters) {
    try {
      console.log(`[${adapter.name}] fetching...`)
      const items = await adapter.fetch()
      console.log(`[${adapter.name}] got ${items.length} items`)

      for (const item of items) {
        const status = await upsertItem(item)
        if (status === 'inserted') result.added++
        else result.skipped++
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      console.error(`[${adapter.name}] ERROR: ${message}`)
      result.errors.push({ source: adapter.name, message })
    }
  }

  return result
}
