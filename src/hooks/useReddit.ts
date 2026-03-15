import { useInfiniteQuery } from '@tanstack/react-query'
import { fetchReddit } from '@/api/reddit'

export function useReddit(enabled = true) {
  return useInfiniteQuery({
    queryKey: ['reddit'],
    queryFn: ({ pageParam }) => fetchReddit(pageParam, 20),
    getNextPageParam: (lastPage) => lastPage.after ?? undefined,
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
