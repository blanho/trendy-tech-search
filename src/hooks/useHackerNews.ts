import { useInfiniteQuery } from '@tanstack/react-query'
import { fetchHackerNews } from '@/api/hackernews'

export function useHackerNews(enabled = true) {
  return useInfiniteQuery({
    queryKey: ['hackernews'],
    queryFn: ({ pageParam = 0 }) => fetchHackerNews(pageParam, 20),
    getNextPageParam: (_lastPage, allPages) => allPages.length,
    initialPageParam: 0,
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 10 * 60 * 1000, // 10 minutes
  })
}
