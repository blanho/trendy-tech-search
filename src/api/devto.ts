import type { FeedItem } from '@/types/feed'
import { fetchWithRetry } from '@/api/client'

interface DevtoArticle {
  id: number
  title: string
  url: string
  comments_count: number
  positive_reactions_count: number
  published_at: string
  user: {
    username: string
  }
  tag_list: string[]
  cover_image?: string
}

const SOURCE = 'Dev.to'

export async function fetchDevto(page = 1, perPage = 20): Promise<FeedItem[]> {
  const params = new URLSearchParams({
    per_page: perPage.toString(),
    page: page.toString(),
    top: '7',
  })

  const res = await fetchWithRetry(`https://dev.to/api/articles?${params}`, {
    source: SOURCE,
  })

  const articles: DevtoArticle[] = await res.json()

  return articles.map((article) => ({
    id: `devto-${article.id}`,
    title: article.title,
    url: article.url,
    source: 'devto' as const,
    score: article.positive_reactions_count,
    comments: article.comments_count,
    commentsUrl: `${article.url}#comments`,
    createdAt: article.published_at,
    author: article.user.username,
    tags: article.tag_list,
    thumbnail: article.cover_image ?? undefined,
  }))
}
