import { memo, useEffect, useReducer } from 'react'
import { Chip, Tooltip } from '@mui/material'
import { Update as UpdateIcon } from '@mui/icons-material'
import { formatRelativeTime } from '@/utils/date'

interface LastUpdatedProps {
  dataUpdatedAt?: number
}

const LastUpdated = memo(function LastUpdated({ dataUpdatedAt }: LastUpdatedProps) {
  const [, forceUpdate] = useReducer((x: number) => x + 1, 0)

  // Re-render every 30s to update relative time
  useEffect(() => {
    const interval = setInterval(forceUpdate, 30_000)
    return () => clearInterval(interval)
  }, [])

  if (!dataUpdatedAt) return null

  const timeStr = formatRelativeTime(new Date(dataUpdatedAt).toISOString())

  return (
    <Tooltip title={`Last updated: ${new Date(dataUpdatedAt).toLocaleTimeString()}`}>
      <Chip
        icon={<UpdateIcon sx={{ fontSize: 14 }} />}
        label={timeStr || 'just now'}
        size="small"
        variant="outlined"
        sx={{
          height: 22,
          fontSize: 10,
          '& .MuiChip-icon': { fontSize: 14 },
          cursor: 'default',
        }}
      />
    </Tooltip>
  )
})

export default LastUpdated
