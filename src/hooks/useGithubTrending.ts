import { useQuery } from '@tanstack/react-query'
import { fetchGithubTrending } from '@/api/github'

export function useGithubTrending(
  since: 'daily' | 'weekly' | 'monthly' = 'daily',
  enabled = true,
) {
  return useQuery({
    queryKey: ['github-trending', since],
    queryFn: () => fetchGithubTrending(since),
    enabled,
    staleTime: 15 * 60 * 1000, // 15 minutes
    refetchInterval: 30 * 60 * 1000, // 30 minutes
  })
}
