import { useInfiniteQuery } from '@tanstack/react-query'
import { fetchLobsters } from '@/api/lobsters'

export function useLobsters(enabled = true) {
  return useInfiniteQuery({
    queryKey: ['lobsters'],
    queryFn: ({ pageParam = 1 }) => fetchLobsters(pageParam),
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length >= 20 ? allPages.length + 1 : undefined,
    initialPageParam: 1,
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 10 * 60 * 1000, // 10 minutes
  })
}
