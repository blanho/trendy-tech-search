import { useEffect, useCallback } from 'react'
import { usePreferencesStore } from '@/store/preferencesStore'

export function useKeyboardNavigation(
  columnItems: { source: string; items: { url: string; id: string }[] }[],
) {
  const {
    focusedColumnIndex,
    focusedItemIndex,
    setFocusedColumn,
    setFocusedItem,
    isBookmarked,
    addBookmark,
    removeBookmark,
  } = usePreferencesStore()

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {

      const tag = (e.target as HTMLElement).tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return

      const currentColumn = columnItems[focusedColumnIndex]
      if (!currentColumn) return

      switch (e.key) {
        case 'j':
          e.preventDefault()
          setFocusedItem(Math.min(focusedItemIndex + 1, currentColumn.items.length - 1))
          break

        case 'k':
          e.preventDefault()
          setFocusedItem(Math.max(focusedItemIndex - 1, 0))
          break

        case 'h':
          e.preventDefault()
          setFocusedColumn(Math.max(focusedColumnIndex - 1, 0))
          break

        case 'l':
          e.preventDefault()
          setFocusedColumn(Math.min(focusedColumnIndex + 1, columnItems.length - 1))
          break

        case 'o':
        case 'Enter': {
          e.preventDefault()
          const item = currentColumn.items[focusedItemIndex]
          if (item) {
            window.open(item.url, '_blank', 'noopener,noreferrer')
          }
          break
        }

        case 's': {
          e.preventDefault()
          const item = currentColumn.items[focusedItemIndex]
          if (item) {
            if (isBookmarked(item.id)) {
              removeBookmark(item.id)
            } else {

              addBookmark(item as Parameters<typeof addBookmark>[0])
            }
          }
          break
        }

        case 'g':
          e.preventDefault()
          setFocusedItem(0)
          break

        case 'G':
          e.preventDefault()
          setFocusedItem(currentColumn.items.length - 1)
          break
      }
    },
    [
      focusedColumnIndex,
      focusedItemIndex,
      columnItems,
      setFocusedColumn,
      setFocusedItem,
      isBookmarked,
      addBookmark,
      removeBookmark,
    ],
  )

  useEffect(() => {
    globalThis.addEventListener('keydown', handleKeyDown)
    return () => globalThis.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])
}
