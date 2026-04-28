import { NextRequest } from 'next/server'
import { getAllAdapters } from '@/lib/sources/index'
import { runAggregation } from '@/lib/aggregator'

export async function POST(request: NextRequest) {
  const adminToken = process.env.ADMIN_TOKEN
  if (!adminToken) {
    return Response.json({ error: 'ADMIN_TOKEN not configured' }, { status: 500 })
  }

  const authHeader = request.headers.get('Authorization')
  if (authHeader !== `Bearer ${adminToken}`) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const adapters = getAllAdapters()
  console.log(`[aggregate] starting run with ${adapters.length} adapters`)

  const result = await runAggregation(adapters)
  console.log(`[aggregate] done — added: ${result.added}, skipped: ${result.skipped}, errors: ${result.errors.length}`)

  return Response.json({
    ok: true,
    adapters: adapters.length,
    added: result.added,
    skipped: result.skipped,
    errors: result.errors,
  })
}
