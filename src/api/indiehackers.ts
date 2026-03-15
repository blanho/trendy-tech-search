import type { FeedItem } from '@/types/feed'

const SOURCE = 'IndieHackers'
const FIREBASE_DB = 'https://indie-hackers.firebaseio.com'
const PAGE_SIZE = 25

interface FirebasePost {
  title?: string
  body?: string
  createdTimestamp?: number
  updatedTimestamp?: number
  userId?: string
  username?: string
  numReplies?: number
  numViews?: number
  numLinkClicks?: number
  createdByBannedUser?: boolean
}

export async function fetchIndieHackers(page = 1): Promise<FeedItem[]> {
  if (page > 1) return []

  const url = `${FIREBASE_DB}/posts.json?orderBy="createdTimestamp"&limitToLast=${PAGE_SIZE}`

  const res = await fetch(url, {
    signal: AbortSignal.timeout(10_000),
  })
  if (!res.ok) {
    throw new Error(`${SOURCE}: HTTP ${res.status} — ${res.statusText}`)
  }

  const data: Record<string, FirebasePost> | null = await res.json()
  if (!data || typeof data !== 'object') return []

  return Object.entries(data)
    .filter(([, post]) => !post.createdByBannedUser && Boolean(post.title))
    .map(([id, post]): FeedItem => {
      const createdAt = post.createdTimestamp
        ? new Date(post.createdTimestamp).toISOString()
        : undefined

      return {
        id: `ih-${id}`,
        title: post.title || 'Untitled Post',
        url: `https://www.indiehackers.com/post/${id}`,
        source: 'indiehackers' as const,
        score: post.numViews ?? 0,
        comments: post.numReplies ?? 0,
        commentsUrl: `https://www.indiehackers.com/post/${id}`,
        createdAt,
        author: post.username,
        tags: [],
      }
    })
    .sort((a, b) => {
      if (!a.createdAt || !b.createdAt) return 0
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })
}
