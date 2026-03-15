import type { FeedItem } from '@/types/feed'
import { fetchWithRetry } from '@/api/client'

interface PHPost {
  id: number
  name: string
  tagline: string
  slug: string
  votes_count: number
  comments_count: number
  created_at: string
  thumbnail: { url: string } | null
  topics: { name: string }[]
  makers: { name: string }[]
  redirect_url: string
  discussion_url: string
}

const SOURCE = 'Product Hunt'

/**
 * Fetch and normalize Product Hunt daily trending products.
 *
 * Uses the public /posts endpoint which returns today's featured products.
 * No API key required for basic listing.
 */
export async function fetchProductHunt(
  daysAgo = 0,
): Promise<FeedItem[]> {
  // Use the public posts endpoint — returns today's or specified day's posts
  const date = new Date()
  date.setDate(date.getDate() - daysAgo)
  const dateStr = date.toISOString().split('T')[0] // YYYY-MM-DD

  const res = await fetchWithRetry(
    `https://api.producthunt.com/v1/posts?day=${dateStr}`,
    {
      source: SOURCE,
      // Public endpoint, no auth needed for basic listing
      headers: {
        Accept: 'application/json',
      },
    },
  )

  const data = await res.json()
  const posts: PHPost[] = data.posts ?? data ?? []

  return posts.map((post) => ({
    id: `ph-${post.id}`,
    title: `${post.name} — ${post.tagline}`,
    url: post.redirect_url || `https://www.producthunt.com/posts/${post.slug}`,
    source: 'producthunt' as const,
    score: post.votes_count,
    comments: post.comments_count,
    commentsUrl: post.discussion_url || `https://www.producthunt.com/posts/${post.slug}`,
    createdAt: post.created_at,
    author: post.makers?.[0]?.name,
    tags: post.topics?.map((t) => t.name) ?? [],
    thumbnail: post.thumbnail?.url,
  }))
}
