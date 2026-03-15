import type { FeedItem } from '@/types/feed'
import { fetchWithRetry } from '@/api/client'

interface PHFeedItem {
  id: string
  title: string
  url: string
  published: string
  author: string
  content: string
}

const SOURCE = 'Product Hunt'

export async function fetchProductHunt(): Promise<FeedItem[]> {
  const res = await fetchWithRetry('/api/proxy/producthunt', {
    source: SOURCE,
  })

  const items: PHFeedItem[] = await res.json()

  return items.map((item, index) => ({
    id: `ph-${item.id || index}`,
    title: item.title,
    url: item.url,
    source: 'producthunt' as const,
    score: 0,
    comments: 0,
    commentsUrl: item.url,
    createdAt: item.published,
    author: item.author,
    tags: [],
  }))
}
