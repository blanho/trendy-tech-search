import { memo } from 'react'
import { Box, Card, CardContent, Skeleton, Stack } from '@mui/material'

interface FeedItemSkeletonProps {
  compact?: boolean
}

const FeedItemSkeleton = memo(function FeedItemSkeleton({ compact }: FeedItemSkeletonProps) {
  if (compact) {
    return (
      <Box sx={{ py: 1.5, px: 2 }}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Skeleton variant="circular" width={20} height={20} />
          <Box sx={{ flex: 1 }}>
            <Skeleton variant="text" width="85%" height={20} />
            <Skeleton variant="text" width="40%" height={16} />
          </Box>
          <Skeleton variant="text" width={40} height={20} />
        </Stack>
      </Box>
    )
  }

  return (
    <Card variant="outlined" sx={{ m: 1 }}>
      <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
        <Skeleton variant="text" width="90%" height={24} />
        <Skeleton variant="text" width="60%" height={20} sx={{ mt: 0.5 }} />
        <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
          <Skeleton variant="text" width={60} height={16} />
          <Skeleton variant="text" width={60} height={16} />
          <Skeleton variant="text" width={80} height={16} />
        </Stack>
      </CardContent>
    </Card>
  )
})

export function FeedColumnSkeleton() {
  return (
    <Box>
      <Box sx={{ px: 2, py: 1.5 }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Skeleton variant="circular" width={24} height={24} />
          <Skeleton variant="text" width={120} height={28} />
        </Stack>
      </Box>
      {['s1', 's2', 's3', 's4', 's5', 's6', 's7', 's8'].map((key) => (
        <FeedItemSkeleton key={key} />
      ))}
    </Box>
  )
}

export default FeedItemSkeleton
