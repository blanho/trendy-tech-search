import { memo, useCallback, useRef } from 'react'
import { IconButton, InputAdornment, TextField, Tooltip } from '@mui/material'
import { Clear as ClearIcon, Search as SearchIcon } from '@mui/icons-material'
import { useSearchStore } from '@/store/searchStore'

const SearchBar = memo(function SearchBar() {
  const { query, setQuery, clearQuery } = useSearchStore()
  const inputRef = useRef<HTMLInputElement>(null)

  const handleClear = useCallback(() => {
    clearQuery()
    inputRef.current?.focus()
  }, [clearQuery])

  return (
    <TextField
      inputRef={inputRef}
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="Filter posts..."
      size="small"
      variant="outlined"
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ fontSize: 18, opacity: 0.5 }} />
            </InputAdornment>
          ),
          endAdornment: query ? (
            <InputAdornment position="end">
              <Tooltip title="Clear">
                <IconButton size="small" onClick={handleClear} sx={{ cursor: 'pointer' }}>
                  <ClearIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </Tooltip>
            </InputAdornment>
          ) : null,
        },
      }}
      sx={{
        width: { xs: 120, sm: 200, md: 240 },
        '& .MuiOutlinedInput-root': {
          borderRadius: 2,
          fontSize: 13,
          height: 36,
        },
      }}
    />
  )
})

export default SearchBar
