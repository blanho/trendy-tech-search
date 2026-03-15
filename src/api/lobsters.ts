import type { FeedItem } from '@/types/feed'
import { fetchWithRetry } from '@/api/client'

interface LobstersStory {
  short_id: string
  title: string
  url: string
  score: number
  comment_count: number
  created_at: string
  submitter_user: {
    username: string
  }
  tags: string[]
  comments_url: string
}

const SOURCE = 'Lobste.rs'

/**
 * Fetch and normalize Lobste.rs hottest stories.
 * API docs: https://lobste.rs/about
 */
export async function fetchLobsters(page = 1): Promise<FeedItem[]> {
  const res = await fetchWithRetry(
    `https://lobste.rs/hottest.json?page=${page}`,
    { source: SOURCE },
  )

  const stories: LobstersStory[] = await res.json()

  return stories.map((story) => ({
    id: `lobsters-${story.short_id}`,
    title: story.title,
    url: story.url || story.comments_url,
    source: 'lobsters' as const,
    score: story.score,
    comments: story.comment_count,
    commentsUrl: story.comments_url,
    createdAt: story.created_at,
    author: story.submitter_user.username,
    tags: story.tags,
  }))
}
