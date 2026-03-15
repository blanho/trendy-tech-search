import { useInfiniteQuery } from '@tanstack/react-query'
import { fetchDevto } from '@/api/devto'

export function useDevto(enabled = true) {
  return useInfiniteQuery({
    queryKey: ['devto'],
    queryFn: ({ pageParam = 1 }) => fetchDevto(pageParam, 20),
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length === 20 ? allPages.length + 1 : undefined,
    initialPageParam: 1,
    enabled,
    staleTime: 5 * 60 * 1000,
    refetchInterval: 10 * 60 * 1000,
  })
}
