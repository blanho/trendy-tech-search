import { useInfiniteQuery } from '@tanstack/react-query'
import { fetchHashnode } from '@/api/hashnode'

export function useHashnode(enabled = true) {
  return useInfiniteQuery({
    queryKey: ['hashnode'],
    queryFn: ({ pageParam }) => fetchHashnode(20, pageParam),
    getNextPageParam: (lastPage) =>
      lastPage.hasNextPage ? lastPage.endCursor : undefined,
    initialPageParam: undefined as string | undefined,
    enabled,
    staleTime: 5 * 60 * 1000,
    refetchInterval: 10 * 60 * 1000,
    select: (data) => ({
      ...data,
      pages: data.pages.map((page) => page.items),
    }),
  })
}
