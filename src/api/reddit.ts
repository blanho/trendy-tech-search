import type { FeedItem } from '@/types/feed'
import { fetchWithRetry } from '@/api/client'

interface RedditPost {
  data: {
    id: string
    title: string
    url: string
    permalink: string
    score: number
    num_comments: number
    created_utc: number
    author: string
    thumbnail?: string
    subreddit: string
  }
}

interface RedditResponse {
  data: {
    children: RedditPost[]
    after: string | null
  }
}

const SOURCE = 'Reddit'

/**
 * Fetch and normalize Reddit /r/programming top posts.
 */
export async function fetchReddit(after?: string, limit = 20): Promise<{
  items: FeedItem[]
  after: string | null
}> {
  const params = new URLSearchParams({
    limit: limit.toString(),
    raw_json: '1',
  })
  if (after) params.set('after', after)

  const res = await fetchWithRetry(
    `https://www.reddit.com/r/programming/top.json?${params}`,
    {
      source: SOURCE,
      headers: { 'User-Agent': 'TrendyTechSearch/1.0' },
    },
  )

  const data: RedditResponse = await res.json()

  const items: FeedItem[] = data.data.children.map((post) => ({
    id: `reddit-${post.data.id}`,
    title: post.data.title,
    url: post.data.url,
    source: 'reddit' as const,
    score: post.data.score,
    comments: post.data.num_comments,
    commentsUrl: `https://www.reddit.com${post.data.permalink}`,
    createdAt: new Date(post.data.created_utc * 1000).toISOString(),
    author: post.data.author,
    thumbnail:
      post.data.thumbnail?.startsWith('http')
        ? post.data.thumbnail
        : undefined,
  }))

  return { items, after: data.data.after }
}
