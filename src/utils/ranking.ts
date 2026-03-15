import type { FeedItem } from '@/types/feed'
import { getRecencyScore } from '@/utils/date'

export function calculateTrendScore(item: FeedItem): number {
  const scoreVal = item.score ?? 0
  const commentsVal = item.comments ?? 0
  const recency = getRecencyScore(item.createdAt)

  return scoreVal * 0.6 + commentsVal * 0.3 + recency * 0.1
}

export function sortFeedItems(
  items: FeedItem[],
  mode: 'score' | 'newest' | 'trending',
): FeedItem[] {
  const sorted = [...items]

  switch (mode) {
    case 'score':
      return sorted.sort((a, b) => (b.score ?? 0) - (a.score ?? 0))

    case 'newest':
      return sorted.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0
        return dateB - dateA
      })

    case 'trending':
      return sorted.sort((a, b) => calculateTrendScore(b) - calculateTrendScore(a))

    default:
      return sorted
  }
}

export function normalizeScore(score: number, maxScore: number): number {
  if (maxScore === 0) return 0
  return Math.round((score / maxScore) * 100)
}
