import { useInfiniteQuery } from '@tanstack/react-query'
import { fetchStackOverflow } from '@/api/stackoverflow'

export function useStackOverflow(enabled = true) {
  return useInfiniteQuery({
    queryKey: ['stackoverflow'],
    queryFn: ({ pageParam }) => fetchStackOverflow(pageParam),
    getNextPageParam: (lastPage, _allPages, lastPageParam) =>
      lastPage.hasMore ? lastPageParam + 1 : undefined,
    initialPageParam: 1,
    enabled,
    staleTime: 5 * 60 * 1000,
    refetchInterval: 10 * 60 * 1000,
    select: (data) => ({
      ...data,
      pages: data.pages.map((page) => page.items),
    }),
  })
}
