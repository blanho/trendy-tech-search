import { useQuery } from '@tanstack/react-query'
import { fetchProductHunt } from '@/api/producthunt'

export function useProductHunt(enabled = true) {
  return useQuery({
    queryKey: ['producthunt'],
    queryFn: () => fetchProductHunt(),
    enabled,
    staleTime: 15 * 60 * 1000,
    refetchInterval: 30 * 60 * 1000,
  })
}
