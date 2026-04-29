import type {
  RssSourceConfig,
  MediumSourceConfig,
  HnCategoryConfig,
  RedditSourceConfig,
  YouTubeChannelConfig,
  SpotifyShowConfig,
} from './types'

// ── RSS news feeds ────────────────────────────────────────────────────────────
export const RSS_SOURCES: RssSourceConfig[] = [
  // Startups
  { name: 'TechCrunch', url: 'https://techcrunch.com/feed/', category: 'startups' },
  { name: 'CzechCrunch', url: 'https://cc.cz/feed/', category: 'startups' },
  { name: 'The Next Web', url: 'https://thenextweb.com/feed/', category: 'startups' },
  { name: 'Sifted', url: 'https://sifted.eu/rss/', category: 'startups' },
  { name: 'EU-Startups', url: 'https://www.eu-startups.com/feed/', category: 'startups' },
  // Frontend
  { name: 'JavaScript Weekly', url: 'https://javascriptweekly.com/rss/', category: 'frontend' },
  { name: 'Frontend Focus', url: 'https://frontendfoc.us/rss', category: 'frontend' },
  { name: 'Smashing Magazine', url: 'https://www.smashingmagazine.com/feed/', category: 'frontend' },
  { name: 'web.dev', url: 'https://web.dev/feed.xml', category: 'frontend' },
  { name: 'CSS-Tricks', url: 'https://css-tricks.com/feed/', category: 'frontend' },
  { name: 'Vercel Blog', url: 'https://vercel.com/blog/rss', category: 'frontend' },
  // Backend
  { name: 'InfoQ', url: 'https://feed.infoq.com/', category: 'backend' },
  { name: 'Changelog', url: 'https://changelog.com/feed', category: 'backend' },
  { name: 'Lobste.rs', url: 'https://lobste.rs/rss', category: 'backend' },
  { name: 'Node Weekly', url: 'https://nodeweekly.com/rss/', category: 'backend' },
  { name: 'Bun Blog', url: 'https://bun.sh/rss.xml', category: 'backend' },
  { name: 'Deno Blog', url: 'https://deno.com/feed', category: 'backend' },
  { name: 'Node.js Blog', url: 'https://nodejs.org/en/feed/blog.xml', category: 'backend' },
  { name: 'Dev.to node', url: 'https://dev.to/feed/tag/node', category: 'backend' },
  { name: 'Dev.to TypeScript', url: 'https://dev.to/feed/tag/typescript', category: 'backend' },
  // AI News
  { name: 'The Decoder', url: 'https://the-decoder.com/feed/', category: 'ai' },
  { name: 'VentureBeat', url: 'https://venturebeat.com/feed/', category: 'ai' },
  { name: 'MIT Tech Review AI', url: 'https://www.technologyreview.com/feed/', category: 'ai' },
  // AI Dev
  { name: 'Dev.to AI', url: 'https://dev.to/feed/tag/ai', category: 'ai-dev' },
  { name: 'Dev.to machine-learning', url: 'https://dev.to/feed/tag/machinelearning', category: 'ai-dev' },
  { name: 'Dev.to LLM', url: 'https://dev.to/feed/tag/llm', category: 'ai-dev' },
]

// ── Medium RSS feeds ─────────────────────────────────────────────────────────
export const MEDIUM_SOURCES: MediumSourceConfig[] = [
  { name: 'Medium: Startup', url: 'https://medium.com/feed/tag/startup', category: 'startups' },
  { name: 'Medium: JavaScript', url: 'https://medium.com/feed/tag/javascript', category: 'frontend' },
  { name: 'Better Programming', url: 'https://medium.com/feed/better-programming', category: 'backend' },
  { name: 'Medium: Artificial Intelligence', url: 'https://medium.com/feed/tag/artificial-intelligence', category: 'ai' },
  { name: 'Towards Data Science', url: 'https://medium.com/feed/towards-data-science', category: 'ai-dev' },
]

// ── HackerNews keyword classifier ────────────────────────────────────────────
// Order matters: more-specific categories (ai-dev) must come before general ones (ai).
export const HN_CATEGORY_CONFIGS: HnCategoryConfig[] = [
  {
    category: 'ai-dev',
    keywords: [
      'claude code', 'copilot', 'cursor ', 'mcp', 'model context protocol',
      'ai coding', 'agentic', 'ai agent', 'code generation', 'ai for developers',
      'llm tool', 'ai pair', 'devin',
    ],
  },
  {
    category: 'ai',
    keywords: [
      'gpt', 'claude', 'gemini', 'llm', 'large language model',
      'artificial intelligence', 'openai', 'anthropic', 'deepmind',
      'machine learning', 'llama', 'mistral', 'ai model', 'foundation model',
    ],
  },
  {
    category: 'frontend',
    keywords: [
      'react', 'next.js', 'nextjs', 'vue', 'svelte', 'css ', 'tailwind',
      'browser', 'frontend', 'webassembly', 'remix', 'astro', 'angular',
      'web components', 'vite',
    ],
  },
  {
    category: 'backend',
    keywords: [
      'node.js', 'nodejs', 'bun ', 'deno', 'postgresql', 'mongodb', 'redis',
      'docker', 'kubernetes', 'serverless', 'backend', 'rest api', 'graphql',
      'microservice', 'hono', 'fastify',
    ],
  },
  {
    category: 'startups',
    keywords: [
      'startup', 'founder', 'funding', 'series a', 'series b', 'series c',
      'venture capital', 'y combinator', 'seed round', 'acquired', 'acquisition',
      'ipo', 'valuation', 'unicorn',
    ],
  },
]

// ── Reddit subreddits ─────────────────────────────────────────────────────────
export const REDDIT_SOURCES: RedditSourceConfig[] = [
  { subreddit: 'startups', category: 'startups' },
  { subreddit: 'javascript', category: 'frontend' },
  { subreddit: 'reactjs', category: 'frontend' },
  { subreddit: 'node', category: 'backend' },
  { subreddit: 'MachineLearning', category: 'ai' },
  { subreddit: 'artificial', category: 'ai' },
  { subreddit: 'LocalLLaMA', category: 'ai-dev' },
]

// ── YouTube channels ─────────────────────────────────────────────────────────
// Channel IDs verified at: youtube.com/channel/{channelId}
export const YOUTUBE_CHANNELS: YouTubeChannelConfig[] = [
  // Startups
  { channelId: 'UCcefcZRL2oaA_uBNeo5UOWg', name: 'Y Combinator', category: 'startups' },
  // Frontend
  { channelId: 'UCsBjURrPoezykLs9EqgamOA', name: 'Fireship', category: 'frontend' },
  { channelId: 'UCbmNph6atAoGfqLoCL_duAg', name: 'Theo', category: 'frontend' },
  { channelId: 'UCFbNIlppjAuEX4znoulh0Cw', name: 'Web Dev Simplified', category: 'frontend' },
  // AI News
  { channelId: 'UCNJ1Ymd5yFuUPtn21xtRbbw', name: 'AI Explained', category: 'ai' },
  { channelId: 'UCbfYPyITQ-7l4upoX8nvctg', name: 'Two Minute Papers', category: 'ai' },
  // AI Dev
  { channelId: 'UCJXGnMFcHSBmMllqqUH2Fbw', name: 'Matthew Berman', category: 'ai-dev' },
]

// ── Spotify shows ─────────────────────────────────────────────────────────────
// Show IDs from: https://open.spotify.com/show/{showId}
export const SPOTIFY_SHOWS: SpotifyShowConfig[] = [
  // Frontend
  { showId: '4kYCRYJ3yK5DQbP5tbfZby', name: 'Syntax.fm', category: 'frontend' },
  // AI News
  { showId: '2MAi0BvDc6GTFvKFPXnkCL', name: 'Lex Fridman Podcast', category: 'ai' },
]
