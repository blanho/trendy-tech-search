import type { FeedItem } from '@/types/feed'
import { fetchWithRetry } from '@/api/client'

interface GithubRepo {
  rank: number
  repositoryName: string
  username: string
  url: string
  description: string
  language: string
  languageColor: string
  totalStars: number
  forks: number
  starsSince: number
  since: string
  builtBy: { username: string; url: string; avatar: string }[]
}

const SOURCE = 'GitHub'

export async function fetchGithubTrending(
  since: 'daily' | 'weekly' | 'monthly' = 'daily',
): Promise<FeedItem[]> {
  const res = await fetchWithRetry(
    `/api/proxy/github?since=${since}`,
    { source: SOURCE },
  )

  const repos: GithubRepo[] = await res.json()

  return repos.map((repo) => ({
    id: `github-${repo.username}-${repo.repositoryName}`,
    title: `${repo.username}/${repo.repositoryName}`,
    url: repo.url,
    source: 'github' as const,
    score: repo.totalStars,
    comments: repo.forks,
    createdAt: new Date().toISOString(),
    author: repo.username,
    tags: repo.language ? [repo.language] : [],
    thumbnail: repo.builtBy?.[0]?.avatar,
  }))
}
