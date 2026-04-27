import { config } from 'dotenv'
config({ path: '.env.local' })

import postgres from 'postgres'
import { drizzle } from 'drizzle-orm/postgres-js'
import { contentItems } from '../lib/db/schema'
import type { NewContentItem } from '../lib/db/schema'

const client = postgres(process.env.DATABASE_URL!, { ssl: 'require', max: 1 })
const db = drizzle(client)

const NOW = new Date('2026-04-26T06:00:00.000Z')

const SEED_ITEMS: Omit<NewContentItem, 'id' | 'fetched_at' | 'created_at'>[] = [
  // ── Startups ─────────────────────────────────────────────────────────────
  {
    source_type: 'youtube', source_name: 'Y Combinator', category: 'startups',
    title: 'How Sequoia Thinks About Early-Stage Investing in 2026',
    excerpt: "Roelof Botha breaks down the firm's current thesis, why European founders are increasingly on their radar, and what separates a $10M seed from a $100M Series A.",
    url: 'https://www.youtube.com/watch?v=mock-s1',
    thumbnail_url: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&q=80',
    author: 'Y Combinator', duration: 3847,
    published_at: new Date('2026-04-26T04:12:00.000Z'),
  },
  {
    source_type: 'spotify', source_name: 'Acquired', category: 'startups',
    title: "The Stripe Story: Building the Internet's Financial Infrastructure",
    excerpt: "Ben and David go deep on Stripe's decade-long arc from a two-person Irish startup to a $65B company processing hundreds of billions in payments annually.",
    url: 'https://open.spotify.com/episode/mock-s2',
    thumbnail_url: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&q=80',
    author: 'Ben Gilbert & David Rosenthal', duration: 14820,
    published_at: new Date('2026-04-25T09:00:00.000Z'),
  },
  {
    source_type: 'rss', source_name: 'Sifted', category: 'startups',
    title: 'EU Startup Monitor 2026: €42B raised in Q1 — but where is the money going?',
    excerpt: 'Despite a global pullback in late-stage venture, European early-stage activity hit a five-year high. Climate-tech and B2B SaaS dominate the deal flow.',
    url: 'https://sifted.eu/articles/mock-s3',
    thumbnail_url: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&q=80',
    author: 'Sifted Editorial', published_at: new Date('2026-04-26T07:30:00.000Z'),
  },
  {
    source_type: 'forum', source_name: 'Hacker News', category: 'startups',
    title: "Ask HN: What's the most underrated European startup ecosystem right now?",
    excerpt: 'Thread discussing Warsaw, Tallinn, and Bucharest as emerging hubs. 312 comments.',
    url: 'https://news.ycombinator.com/item?id=mock-s4',
    author: 'HN Community', published_at: new Date('2026-04-25T18:22:00.000Z'),
  },
  {
    source_type: 'rss', source_name: 'TechCrunch', category: 'startups',
    title: 'Inside the €180M Series B that just quietly closed in Berlin',
    excerpt: 'A deep-dive on the latest mega-round to come out of the German capital, what the company does, who led it, and why VCs are still bullish on European B2B.',
    url: 'https://techcrunch.com/mock-s5',
    thumbnail_url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80',
    author: 'Ingrid Lunden', published_at: new Date('2026-04-24T14:00:00.000Z'),
  },
  {
    source_type: 'medium', source_name: 'First Round Review', category: 'startups',
    title: "The founder's guide to pricing your first SaaS product",
    excerpt: 'Most early-stage founders underprice. This piece breaks down the pricing frameworks that have worked across 200+ portfolio companies.',
    url: 'https://review.firstround.com/mock-s6',
    thumbnail_url: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80',
    author: 'First Round Capital', published_at: new Date('2026-04-23T10:00:00.000Z'),
  },

  // ── Frontend ─────────────────────────────────────────────────────────────
  {
    source_type: 'youtube', source_name: 'Theo — t3.gg', category: 'frontend',
    title: 'React 19 Compiler: What Actually Changes in Your Codebase',
    excerpt: 'Theo walks through the React Compiler in production, showing before/after render profiles and which patterns benefit most from automatic memoization.',
    url: 'https://www.youtube.com/watch?v=mock-f1',
    thumbnail_url: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=800&q=80',
    author: 'Theo Browne', duration: 2156,
    published_at: new Date('2026-04-26T03:00:00.000Z'),
  },
  {
    source_type: 'spotify', source_name: 'Syntax.fm', category: 'frontend',
    title: "CSS in 2026 — Container Queries, @scope, and What's Coming Next",
    excerpt: "Wes and Scott cover the CSS features that shipped this year, which ones are actually worth using in production, and a preview of what's in the pipeline.",
    url: 'https://open.spotify.com/episode/mock-f2',
    thumbnail_url: 'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=400&q=80',
    author: 'Wes Bos & Scott Tolinski', duration: 4320,
    published_at: new Date('2026-04-25T12:00:00.000Z'),
  },
  {
    source_type: 'medium', source_name: 'CSS-Tricks', category: 'frontend',
    title: 'Why I stopped using Tailwind and what I learned from the switch',
    excerpt: "After three years of Tailwind-first development, one engineer's honest account of moving back to CSS Modules — and what each approach actually costs.",
    url: 'https://css-tricks.com/mock-f3',
    thumbnail_url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80',
    author: 'Robin Rendle', published_at: new Date('2026-04-24T15:00:00.000Z'),
  },
  {
    source_type: 'rss', source_name: 'web.dev', category: 'frontend',
    title: 'Interop 2026: The browser features all vendors agreed to standardize',
    excerpt: "CSS anchor positioning, View Transitions Level 2, and the Popover API are the headline items for this year's interoperability focus.",
    url: 'https://web.dev/blog/interop-2026',
    thumbnail_url: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&q=80',
    author: 'Chrome DevRel', published_at: new Date('2026-04-26T08:00:00.000Z'),
  },
  {
    source_type: 'rss', source_name: 'Vercel Blog', category: 'frontend',
    title: 'Next.js 16: Partial Prerendering is now stable',
    excerpt: "PPR ships in stable. Here's what it means for your app: faster TTFB on dynamic pages, zero config, and the new Cache Components API.",
    url: 'https://vercel.com/blog/mock-f5',
    thumbnail_url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80',
    author: 'Lee Robinson', published_at: new Date('2026-04-25T16:00:00.000Z'),
  },
  {
    source_type: 'forum', source_name: 'Hacker News', category: 'frontend',
    title: 'Signals are coming to React: what the RFC actually says',
    excerpt: 'Community analysis of the signals RFC, comparisons with SolidJS, Vue, and Angular implementations. 298 comments.',
    url: 'https://news.ycombinator.com/item?id=mock-f6',
    author: 'HN Community', published_at: new Date('2026-04-25T14:30:00.000Z'),
  },

  // ── Backend ──────────────────────────────────────────────────────────────
  {
    source_type: 'youtube', source_name: 'Fireship', category: 'backend',
    title: 'Bun 2.0 vs Node.js: I tested 47 real-world scenarios',
    excerpt: "Fireship puts Bun's new major release through a gauntlet of HTTP servers, database connections, and file I/O benchmarks against Node.js 24 LTS.",
    url: 'https://www.youtube.com/watch?v=mock-b1',
    thumbnail_url: 'https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?w=800&q=80',
    author: 'Jeff Delaney', duration: 892,
    published_at: new Date('2026-04-26T02:00:00.000Z'),
  },
  {
    source_type: 'spotify', source_name: 'JS Party', category: 'backend',
    title: 'The State of Node.js 2026: What the core team is actually working on',
    excerpt: 'A Node.js core contributor joins the show to discuss the performance roadmap, the future of CommonJS, and why the permission system matters more than you think.',
    url: 'https://open.spotify.com/episode/mock-b2',
    thumbnail_url: 'https://images.unsplash.com/photo-1484417894907-623942c8ee29?w=400&q=80',
    author: 'Changelog Media', duration: 5580,
    published_at: new Date('2026-04-25T10:00:00.000Z'),
  },
  {
    source_type: 'rss', source_name: 'Hono Blog', category: 'backend',
    title: 'Hono v5: RPC client, middleware redesign, and full Cloudflare Workflows support',
    excerpt: 'The lightweight framework hits v5 with a redesigned middleware chain and a type-safe RPC client that generates types from your routes.',
    url: 'https://hono.dev/blog/mock-b3',
    thumbnail_url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80',
    author: 'Yusuke Wada', published_at: new Date('2026-04-24T08:00:00.000Z'),
  },
  {
    source_type: 'forum', source_name: 'Hacker News', category: 'backend',
    title: "Bun now benchmarks faster than some Rust HTTP servers — is this expected?",
    excerpt: "Community discussion on Bun's HTTP performance, JavaScriptCore optimizations, and what the benchmarks measure. 487 comments.",
    url: 'https://news.ycombinator.com/item?id=mock-b4',
    author: 'HN Community', published_at: new Date('2026-04-25T20:00:00.000Z'),
  },
  {
    source_type: 'rss', source_name: 'Node.js Blog', category: 'backend',
    title: "Node.js 24 LTS: What's new and what changed under the hood",
    excerpt: 'The new LTS release ships with V8 13.6, built-in sqlite3, improved permission model, and a new `node:diagnostics_channel` API.',
    url: 'https://nodejs.org/blog/mock-b5',
    thumbnail_url: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&q=80',
    author: 'Node.js Team', published_at: new Date('2026-04-23T12:00:00.000Z'),
  },
  {
    source_type: 'medium', source_name: 'Better Programming', category: 'backend',
    title: "Stop using REST for internal microservices — here's what works better",
    excerpt: 'A production case study on migrating from REST to tRPC + Hono for internal APIs, with measurable latency and DX improvements.',
    url: 'https://medium.com/better-programming/mock-b6',
    thumbnail_url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80',
    author: 'Alex Kondov', published_at: new Date('2026-04-22T09:00:00.000Z'),
  },

  // ── AI News ──────────────────────────────────────────────────────────────
  {
    source_type: 'youtube', source_name: 'AI Explained', category: 'ai',
    title: 'Claude 4 Opus vs GPT-5: 90-day independent benchmark results',
    excerpt: 'A systematic comparison across reasoning, coding, and long-context tasks. The results are more nuanced than the headline numbers suggest.',
    url: 'https://www.youtube.com/watch?v=mock-a1',
    thumbnail_url: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&q=80',
    author: 'AI Explained', duration: 2934,
    published_at: new Date('2026-04-26T05:00:00.000Z'),
  },
  {
    source_type: 'rss', source_name: 'Anthropic Blog', category: 'ai',
    title: 'Introducing Claude 4.5: Extended context, improved reasoning, and new safety research',
    excerpt: "Anthropic's latest model release includes a 400k context window, significant improvements on MMLU-Pro, and new Constitutional AI research findings.",
    url: 'https://anthropic.com/blog/mock-a2',
    thumbnail_url: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&q=80',
    author: 'Anthropic', published_at: new Date('2026-04-26T08:00:00.000Z'),
  },
  {
    source_type: 'rss', source_name: 'Google DeepMind', category: 'ai',
    title: 'Gemini 2.5 Ultra: Technical report and benchmark breakdown',
    excerpt: 'DeepMind publishes technical details behind their latest flagship model, including architecture decisions and performance on scientific reasoning tasks.',
    url: 'https://deepmind.google/blog/mock-a3',
    thumbnail_url: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&q=80',
    author: 'Google DeepMind', published_at: new Date('2026-04-25T14:00:00.000Z'),
  },
  {
    source_type: 'medium', source_name: 'Towards Data Science', category: 'ai',
    title: "The race to AGI just got real — here's what the labs aren't saying publicly",
    excerpt: 'An analysis of the gap between what AI labs publish and what their internal benchmarks likely show, based on public statements and hiring patterns.',
    url: 'https://towardsdatascience.com/mock-a4',
    thumbnail_url: 'https://images.unsplash.com/photo-1655720828018-edd2daec9349?w=800&q=80',
    author: 'Tim Dettmers', published_at: new Date('2026-04-24T11:00:00.000Z'),
  },
  {
    source_type: 'rss', source_name: 'The Decoder', category: 'ai',
    title: "OpenAI's Q3 revenue: $6.2B and growing — but costs are growing faster",
    excerpt: "A financial deep-dive into OpenAI's latest numbers, what they mean for the AI industry, and the sustainability questions that investors are quietly raising.",
    url: 'https://the-decoder.com/mock-a5',
    thumbnail_url: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&q=80',
    author: 'Maximilian Schreiner', published_at: new Date('2026-04-25T07:00:00.000Z'),
  },
  {
    source_type: 'forum', source_name: 'Hacker News', category: 'ai',
    title: 'Meta releases Llama 4 under a fully open license — community reaction',
    excerpt: 'Discussion on what "open" means, commercial use implications, and early benchmark comparisons to proprietary models. 543 comments.',
    url: 'https://news.ycombinator.com/item?id=mock-a6',
    author: 'HN Community', published_at: new Date('2026-04-25T11:00:00.000Z'),
  },

  // ── AI Dev ───────────────────────────────────────────────────────────────
  {
    source_type: 'youtube', source_name: 'Theo — t3.gg', category: 'ai-dev',
    title: 'I used Claude Code for 60 days straight — here\'s my honest review',
    excerpt: 'After 60 days of daily Claude Code usage across five production projects, Theo breaks down what works, what breaks, and whether the subscription is worth it.',
    url: 'https://www.youtube.com/watch?v=mock-d1',
    thumbnail_url: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800&q=80',
    author: 'Theo Browne', duration: 1823,
    published_at: new Date('2026-04-26T01:00:00.000Z'),
  },
  {
    source_type: 'spotify', source_name: 'Latent Space', category: 'ai-dev',
    title: 'The Cursor Founders on building an AI IDE from scratch (and what comes next)',
    excerpt: "Anysphere's co-founders discuss the architectural decisions behind Cursor, why they bet on language models for code editing before anyone else.",
    url: 'https://open.spotify.com/episode/mock-d2',
    thumbnail_url: 'https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=800&q=80',
    author: 'Alessio Fanelli & Swyx', duration: 6840,
    published_at: new Date('2026-04-25T08:00:00.000Z'),
  },
  {
    source_type: 'rss', source_name: 'Vercel Blog', category: 'ai-dev',
    title: 'MCP is becoming the USB-C of AI integrations — and what that means for your stack',
    excerpt: 'The Model Context Protocol has quietly become the default way AI agents communicate with tools. We look at adoption patterns and how to build MCP-native apps.',
    url: 'https://vercel.com/blog/mock-d3',
    thumbnail_url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80',
    author: 'Lee Robinson', published_at: new Date('2026-04-26T06:30:00.000Z'),
  },
  {
    source_type: 'forum', source_name: 'Hacker News', category: 'ai-dev',
    title: 'We let Claude Code complete our senior engineering interview — it passed',
    excerpt: "A startup ran their standard senior engineer take-home through Claude Code unassisted. The results, what it got right, and why they're rethinking the interview. 621 comments.",
    url: 'https://news.ycombinator.com/item?id=mock-d4',
    author: 'HN Community', published_at: new Date('2026-04-25T22:00:00.000Z'),
  },
  {
    source_type: 'rss', source_name: 'Anthropic Blog', category: 'ai-dev',
    title: 'Claude Code Agent SDK: Build autonomous coding agents with full context',
    excerpt: 'The new Agent SDK lets you build multi-step coding agents that maintain context across tool calls, spawn subagents, and integrate with your existing CI/CD pipeline.',
    url: 'https://anthropic.com/blog/mock-d5',
    thumbnail_url: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&q=80',
    author: 'Anthropic', published_at: new Date('2026-04-24T09:00:00.000Z'),
  },
  {
    source_type: 'medium', source_name: 'Better Programming', category: 'ai-dev',
    title: 'How I wired 12 MCP servers into my daily dev workflow',
    excerpt: 'A practical walkthrough: from Claude Desktop config to custom MCP servers for Jira, GitHub, Postgres, and Figma — with the gotchas I hit along the way.',
    url: 'https://medium.com/better-programming/mock-d6',
    thumbnail_url: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800&q=80',
    author: 'Swyx', published_at: new Date('2026-04-23T15:00:00.000Z'),
  },
]

async function seed() {
  console.log(`Seeding ${SEED_ITEMS.length} items...`)

  let inserted = 0
  let skipped = 0

  for (const item of SEED_ITEMS) {
    const result = await db
      .insert(contentItems)
      .values({
        ...item,
        fetched_at: NOW,
        created_at: NOW,
      })
      .onConflictDoNothing({ target: contentItems.url })

    if (result.length === 0) {
      skipped++
    } else {
      inserted++
    }
  }

  console.log(`Done. Inserted: ${inserted}, Skipped (duplicates): ${skipped}`)
  await client.end()
}

seed().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
