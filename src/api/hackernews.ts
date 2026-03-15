import type { FeedItem } from '@/types/feed'

interface HNStory {
  id: number
  title: string
  url?: string
  score: number
  descendants: number
  time: number
  by: string
  type: string
}

const BASE_URL = 'https://hacker-news.firebaseio.com/v0'

/**
 * Fetch top story IDs from Hacker News.
 */
async function fetchTopStoryIds(limit = 30): Promise<number[]> {
  const res = await fetch(`${BASE_URL}/topstories.json`)
  if (!res.ok) throw new Error('Failed to fetch Hacker News top stories')
  const ids: number[] = await res.json()
  return ids.slice(0, limit)
}

/**
 * Fetch a single story by ID.
 */
async function fetchStory(id: number): Promise<HNStory> {
  const res = await fetch(`${BASE_URL}/item/${id}.json`)
  if (!res.ok) throw new Error(`Failed to fetch HN story ${id}`)
  return res.json()
}

/**
 * Fetch and normalize Hacker News stories.
 */
export async function fetchHackerNews(page = 0, pageSize = 20): Promise<FeedItem[]> {
  const offset = page * pageSize
  const ids = await fetchTopStoryIds(offset + pageSize)
  const pageIds = ids.slice(offset, offset + pageSize)

  const stories = await Promise.all(pageIds.map(fetchStory))

  return stories
    .filter((s) => s?.type === 'story')
    .map((story) => ({
      id: `hn-${story.id}`,
      title: story.title,
      url: story.url ?? `https://news.ycombinator.com/item?id=${story.id}`,
      source: 'hackernews' as const,
      score: story.score,
      comments: story.descendants ?? 0,
      commentsUrl: `https://news.ycombinator.com/item?id=${story.id}`,
      createdAt: new Date(story.time * 1000).toISOString(),
      author: story.by,
    }))
}
