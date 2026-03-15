import type { FeedItem } from '@/types/feed'
import { fetchWithRetry } from '@/api/client'

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
const SOURCE = 'Hacker News'

async function fetchTopStoryIds(limit = 30): Promise<number[]> {
  const res = await fetchWithRetry(`${BASE_URL}/topstories.json`, { source: SOURCE })
  const ids: number[] = await res.json()
  return ids.slice(0, limit)
}

async function fetchStory(id: number): Promise<HNStory> {
  const res = await fetchWithRetry(`${BASE_URL}/item/${id}.json`, {
    source: SOURCE,
    maxRetries: 1,
  })
  return res.json()
}

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
