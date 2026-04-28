import { getAllAdapters } from '@/lib/sources/index'
import { runAggregation } from '@/lib/aggregator'
import { insertCronRun, finishCronRun } from '@/lib/db/queries'

export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET
  if (!cronSecret) {
    return Response.json({ error: 'CRON_SECRET not configured' }, { status: 500 })
  }

  const authHeader = request.headers.get('Authorization')
  if (authHeader !== `Bearer ${cronSecret}`) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const runId = await insertCronRun()
  console.log(`[cron] run started — id: ${runId}`)

  const adapters = getAllAdapters()
  const result = await runAggregation(adapters)

  await finishCronRun(runId, {
    items_added: result.added,
    items_skipped: result.skipped,
    errors: result.errors.length > 0 ? result.errors : null,
  })

  console.log(`[cron] run finished — added: ${result.added}, skipped: ${result.skipped}, errors: ${result.errors.length}`)

  return Response.json({
    ok: true,
    run_id: runId,
    added: result.added,
    skipped: result.skipped,
    errors: result.errors,
  })
}
