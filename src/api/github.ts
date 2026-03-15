import type { FeedItem } from '@/types/feed'
import { fetchWithRetry } from '@/api/client'

interface GithubRepo {
  id: number
  full_name: string
  html_url: string
  description: string | null
  language: string | null
  stargazers_count: number
  forks_count: number
  created_at: string
  owner: {
    login: string
    avatar_url: string
  }
  topics?: string[]
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
    id: `github-${repo.id}`,
    title: repo.full_name,
    url: repo.html_url,
    source: 'github' as const,
    score: repo.stargazers_count,
    comments: repo.forks_count,
    createdAt: repo.created_at,
    author: repo.owner.login,
    tags: repo.language ? [repo.language] : [],
    thumbnail: repo.owner.avatar_url,
  }))
}
