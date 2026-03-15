import { useInfiniteQuery } from '@tanstack/react-query'
import { fetchIndieHackers } from '@/api/indiehackers'

export function useIndieHackers(enabled = true) {
  return useInfiniteQuery({
    queryKey: ['indiehackers'],
    queryFn: ({ pageParam }) => fetchIndieHackers(pageParam),
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length > 0 ? allPages.length + 1 : undefined,
    initialPageParam: 1,
    enabled,
    staleTime: 5 * 60 * 1000,
    refetchInterval: 10 * 60 * 1000,
  })
}
