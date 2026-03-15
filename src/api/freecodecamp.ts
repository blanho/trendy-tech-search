import type { FeedItem } from '@/types/feed'
import { fetchWithRetry } from '@/api/client'

interface FCCArticle {
  title: string
  url: string
  slug: string
  id: string
  feature_image: string | null
  published_at: string
  reading_time: number
  excerpt: string
  primary_author: {
    name: string
    slug: string
  }
  tags: { name: string; slug: string }[]
}

interface FCCResponse {
  posts: FCCArticle[]
  meta: {
    pagination: {
      page: number
      limit: number
      pages: number
      total: number
      next: number | null
    }
  }
}

const SOURCE = 'freeCodeCamp'

export async function fetchFreeCodeCamp(page = 1, limit = 20): Promise<FeedItem[]> {
  const res = await fetchWithRetry(
    `/api/proxy/freecodecamp?page=${page}&limit=${limit}`,
    { source: SOURCE },
  )

  const data: FCCResponse = await res.json()

  return data.posts.map((article) => ({
    id: `fcc-${article.id}`,
    title: article.title,
    url: article.url || `https://www.freecodecamp.org/news/${article.slug}`,
    source: 'freecodecamp' as const,
    score: article.reading_time ?? 0,
    comments: 0,
    commentsUrl: article.url || `https://www.freecodecamp.org/news/${article.slug}`,
    createdAt: article.published_at,
    author: article.primary_author?.name,
    tags: article.tags?.map((t) => t.name) ?? [],
    thumbnail: article.feature_image ?? undefined,
  }))
}
