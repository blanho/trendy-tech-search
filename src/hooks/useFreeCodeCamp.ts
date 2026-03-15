import { useInfiniteQuery } from '@tanstack/react-query'
import { fetchFreeCodeCamp } from '@/api/freecodecamp'

export function useFreeCodeCamp(enabled = true) {
  return useInfiniteQuery({
    queryKey: ['freecodecamp'],
    queryFn: ({ pageParam = 1 }) => fetchFreeCodeCamp(pageParam, 20),
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length === 20 ? allPages.length + 1 : undefined,
    initialPageParam: 1,
    enabled,
    staleTime: 10 * 60 * 1000,
    refetchInterval: 20 * 60 * 1000,
  })
}
