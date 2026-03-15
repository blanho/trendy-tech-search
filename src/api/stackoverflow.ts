import type { FeedItem } from '@/types/feed'
import { fetchWithRetry } from '@/api/client'

interface SOQuestion {
  question_id: number
  title: string
  link: string
  score: number
  answer_count: number
  view_count: number
  creation_date: number
  tags: string[]
  owner: {
    display_name: string
    profile_image?: string
  }
  is_answered: boolean
}

interface SOResponse {
  items: SOQuestion[]
  has_more: boolean
  quota_remaining: number
}

const SOURCE = 'Stack Overflow'

function decodeHtmlEntities(text: string): string {
  return text
    .replaceAll('&amp;', '&')
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&quot;', '"')
    .replaceAll('&#39;', "'")
    .replaceAll(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
}

export async function fetchStackOverflow(
  page = 1,
  pageSize = 25,
): Promise<{ items: FeedItem[]; hasMore: boolean }> {
  const params = new URLSearchParams({
    order: 'desc',
    sort: 'hot',
    site: 'stackoverflow',
    pagesize: pageSize.toString(),
    page: page.toString(),
  })

  const res = await fetchWithRetry(
    `https://api.stackexchange.com/2.3/questions?${params}`,
    { source: SOURCE },
  )

  const data: SOResponse = await res.json()

  const items: FeedItem[] = data.items.map((q) => ({
    id: `so-${q.question_id}`,
    title: decodeHtmlEntities(q.title),
    url: q.link,
    source: 'stackoverflow' as const,
    score: q.score,
    comments: q.answer_count,
    commentsUrl: `${q.link}#answers`,
    createdAt: new Date(q.creation_date * 1000).toISOString(),
    author: q.owner.display_name,
    tags: q.tags,
    thumbnail: q.owner.profile_image,
  }))

  return { items, hasMore: data.has_more }
}
