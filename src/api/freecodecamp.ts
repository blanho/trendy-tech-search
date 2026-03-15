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

/**
 * Ghost Content API key for freeCodeCamp news.
 * This is a public read-only key embedded in their website's source.
 */
const FCC_API_KEY = 'e1c2e68c9e795a2e402f7c70e3'

/**
 * Fetch and normalize freeCodeCamp articles via Ghost Content API.
 */
export async function fetchFreeCodeCamp(page = 1, limit = 20): Promise<FeedItem[]> {
  const params = new URLSearchParams({
    key: FCC_API_KEY,
    page: page.toString(),
    limit: limit.toString(),
    include: 'tags,authors',
    order: 'published_at desc',
    fields: 'id,title,url,slug,feature_image,published_at,reading_time,excerpt',
  })

  const res = await fetchWithRetry(
    `https://www.freecodecamp.org/news/ghost/api/v3/content/posts/?${params}`,
    { source: SOURCE },
  )

  const data: FCCResponse = await res.json()

  return data.posts.map((article) => ({
    id: `fcc-${article.id}`,
    title: article.title,
    url: article.url || `https://www.freecodecamp.org/news/${article.slug}`,
    source: 'freecodecamp' as const,
    score: article.reading_time ?? 0, // Use reading time as score proxy
    comments: 0, // Ghost API doesn't expose comment count
    commentsUrl: article.url || `https://www.freecodecamp.org/news/${article.slug}`,
    createdAt: article.published_at,
    author: article.primary_author?.name,
    tags: article.tags?.map((t) => t.name) ?? [],
    thumbnail: article.feature_image ?? undefined,
  }))
}
