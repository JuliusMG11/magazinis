import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

declare global {
  // eslint-disable-next-line no-var
  var __db: ReturnType<typeof drizzle<typeof schema>> | undefined
}

function createClient() {
  const client = postgres(process.env.DATABASE_URL!, {
    ssl: 'require',
    max: 5,
    idle_timeout: 20,
    connect_timeout: 10,
  })
  return drizzle(client, { schema })
}

export const db = globalThis.__db ?? (globalThis.__db = createClient())
