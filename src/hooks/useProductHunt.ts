import { useQuery } from '@tanstack/react-query'
import { fetchProductHunt } from '@/api/producthunt'

export function useProductHunt(daysAgo = 0, enabled = true) {
  return useQuery({
    queryKey: ['producthunt', daysAgo],
    queryFn: () => fetchProductHunt(daysAgo),
    enabled,
    staleTime: 15 * 60 * 1000, // 15 minutes — PH updates daily
    refetchInterval: 30 * 60 * 1000, // 30 minutes
  })
}
