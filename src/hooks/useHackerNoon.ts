import { useInfiniteQuery } from '@tanstack/react-query'
import { fetchHackerNoon } from '@/api/hackernoon'

export function useHackerNoon(enabled = true) {
  return useInfiniteQuery({
    queryKey: ['hackernoon'],
    queryFn: ({ pageParam }) => fetchHackerNoon(pageParam),
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length > 0 ? allPages.length + 1 : undefined,
    initialPageParam: 1,
    enabled,
    staleTime: 5 * 60 * 1000,
    refetchInterval: 10 * 60 * 1000,
  })
}
