import { useCallback, useEffect, useMemo, useState } from 'react'
import { Box, Grid } from '@mui/material'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  horizontalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { FeedSource } from '@/types/feed'
import { usePreferencesStore } from '@/store/preferencesStore'
import { useHackerNews } from '@/hooks/useHackerNews'
import { useReddit } from '@/hooks/useReddit'
import { useDevto } from '@/hooks/useDevto'
import { useGithubTrending } from '@/hooks/useGithubTrending'
import { useLobsters } from '@/hooks/useLobsters'
import { useHashnode } from '@/hooks/useHashnode'
import { useProductHunt } from '@/hooks/useProductHunt'
import { useFreeCodeCamp } from '@/hooks/useFreeCodeCamp'
import FeedColumn from '@/components/FeedColumn/FeedColumn'
import DashboardLayout from '@/components/Layout/DashboardLayout'
import BookmarksDrawer from '@/components/Bookmarks/BookmarksDrawer'
import EmptyState from '@/components/EmptyState/EmptyState'
import KeyboardShortcutsDialog from '@/components/KeyboardShortcuts/KeyboardShortcutsDialog'
import StatusBar from '@/components/StatusBar/StatusBar'
import { useKeyboardNavigation } from '@/hooks/useKeyboardNavigation'
import { useNotificationStore } from '@/store/notificationStore'

// Sortable column wrapper
function SortableColumn({
  id,
  children,
}: Readonly<{
  id: string
  children: (dragHandleProps: Record<string, unknown>) => React.ReactNode
}>) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <Box ref={setNodeRef} style={style} sx={{ height: 'calc(100vh - 100px)' }}>
      {children({ ...attributes, ...listeners })}
    </Box>
  )
}

function getMdSize(count: number): number {
  if (count <= 2) return 6
  if (count <= 4) return 3
  return 4 // 3-per-row for 5+ columns — scrolls horizontally
}

function getLgSize(count: number): number {
  if (count <= 4) return 12 / count
  if (count <= 6) return 2 // 6-per-row
  return 2 // still 6-per-row, will overflow and scroll
}

export default function Dashboard() {
  const [bookmarksOpen, setBookmarksOpen] = useState(false)

  const { enabledSources, columnOrder, setColumnOrder } = usePreferencesStore()
  const addToast = useNotificationStore((s) => s.addToast)

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
  )

  // Fetch data for each source
  const hn = useHackerNews(enabledSources.includes('hackernews'))
  const reddit = useReddit(enabledSources.includes('reddit'))
  const devto = useDevto(enabledSources.includes('devto'))
  const github = useGithubTrending('daily', enabledSources.includes('github'))
  const lobsters = useLobsters(enabledSources.includes('lobsters'))
  const hashnode = useHashnode(enabledSources.includes('hashnode'))
  const producthunt = useProductHunt(0, enabledSources.includes('producthunt'))
  const freecodecamp = useFreeCodeCamp(enabledSources.includes('freecodecamp'))

  // Map source to data
  const sourceDataMap = useMemo(
    () => ({
      hackernews: {
        items: hn.data?.pages.flat() ?? [],
        isLoading: hn.isLoading,
        isError: hn.isError,
        error: hn.error,
        isFetchingNextPage: hn.isFetchingNextPage,
        hasNextPage: hn.hasNextPage,
        fetchNextPage: hn.fetchNextPage,
        refetch: hn.refetch,
        dataUpdatedAt: hn.dataUpdatedAt,
      },
      reddit: {
        items: reddit.data?.pages.flat() ?? [],
        isLoading: reddit.isLoading,
        isError: reddit.isError,
        error: reddit.error,
        isFetchingNextPage: reddit.isFetchingNextPage,
        hasNextPage: reddit.hasNextPage,
        fetchNextPage: reddit.fetchNextPage,
        refetch: reddit.refetch,
        dataUpdatedAt: reddit.dataUpdatedAt,
      },
      devto: {
        items: devto.data?.pages.flat() ?? [],
        isLoading: devto.isLoading,
        isError: devto.isError,
        error: devto.error,
        isFetchingNextPage: devto.isFetchingNextPage,
        hasNextPage: devto.hasNextPage,
        fetchNextPage: devto.fetchNextPage,
        refetch: devto.refetch,
        dataUpdatedAt: devto.dataUpdatedAt,
      },
      github: {
        items: github.data ?? [],
        isLoading: github.isLoading,
        isError: github.isError,
        error: github.error,
        isFetchingNextPage: false,
        hasNextPage: false,
        fetchNextPage: undefined,
        refetch: github.refetch,
        dataUpdatedAt: github.dataUpdatedAt,
      },
      lobsters: {
        items: lobsters.data?.pages.flat() ?? [],
        isLoading: lobsters.isLoading,
        isError: lobsters.isError,
        error: lobsters.error,
        isFetchingNextPage: lobsters.isFetchingNextPage,
        hasNextPage: lobsters.hasNextPage,
        fetchNextPage: lobsters.fetchNextPage,
        refetch: lobsters.refetch,
        dataUpdatedAt: lobsters.dataUpdatedAt,
      },
      hashnode: {
        items: hashnode.data?.pages.flat() ?? [],
        isLoading: hashnode.isLoading,
        isError: hashnode.isError,
        error: hashnode.error,
        isFetchingNextPage: hashnode.isFetchingNextPage,
        hasNextPage: hashnode.hasNextPage,
        fetchNextPage: hashnode.fetchNextPage,
        refetch: hashnode.refetch,
        dataUpdatedAt: hashnode.dataUpdatedAt,
      },
      producthunt: {
        items: producthunt.data ?? [],
        isLoading: producthunt.isLoading,
        isError: producthunt.isError,
        error: producthunt.error,
        isFetchingNextPage: false,
        hasNextPage: false,
        fetchNextPage: undefined,
        refetch: producthunt.refetch,
        dataUpdatedAt: producthunt.dataUpdatedAt,
      },
      freecodecamp: {
        items: freecodecamp.data?.pages.flat() ?? [],
        isLoading: freecodecamp.isLoading,
        isError: freecodecamp.isError,
        error: freecodecamp.error,
        isFetchingNextPage: freecodecamp.isFetchingNextPage,
        hasNextPage: freecodecamp.hasNextPage,
        fetchNextPage: freecodecamp.fetchNextPage,
        refetch: freecodecamp.refetch,
        dataUpdatedAt: freecodecamp.dataUpdatedAt,
      },
    }),
    [hn, reddit, devto, github, lobsters, hashnode, producthunt, freecodecamp],
  )

  // Visible columns based on enabled sources and order
  const visibleColumns = useMemo(
    () => columnOrder.filter((source) => enabledSources.includes(source)),
    [columnOrder, enabledSources],
  )

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event
      if (!over || active.id === over.id) return

      const oldIndex = columnOrder.indexOf(active.id as FeedSource)
      const newIndex = columnOrder.indexOf(over.id as FeedSource)

      const newOrder = [...columnOrder]
      newOrder.splice(oldIndex, 1)
      newOrder.splice(newIndex, 0, active.id as FeedSource)
      setColumnOrder(newOrder)
    },
    [columnOrder, setColumnOrder],
  )

  const colCount = visibleColumns.length
  const [shortcutsOpen, setShortcutsOpen] = useState(false)

  const totalItems = useMemo(
    () =>
      visibleColumns.reduce((acc, source) => acc + sourceDataMap[source].items.length, 0),
    [visibleColumns, sourceDataMap],
  )

  // Keyboard navigation data
  const columnItemsForNav = useMemo(
    () =>
      visibleColumns.map((source) => ({
        source,
        items: sourceDataMap[source].items,
      })),
    [visibleColumns, sourceDataMap],
  )
  useKeyboardNavigation(columnItemsForNav)

  // Refresh all sources
  const handleRefreshAll = useCallback(() => {
    hn.refetch()
    reddit.refetch()
    devto.refetch()
    github.refetch()
    lobsters.refetch()
    hashnode.refetch()
    producthunt.refetch()
    freecodecamp.refetch()
    addToast({ message: 'Refreshing all sources…', severity: 'info', duration: 2000 })
  }, [hn, reddit, devto, github, lobsters, hashnode, producthunt, freecodecamp, addToast])

  // Listen for '?' to open shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).matches('input,textarea,select')) return
      if (e.key === '?') {
        setShortcutsOpen(true)
      } else if (e.key === 'r') {
        handleRefreshAll()
      }
    }
    globalThis.addEventListener('keydown', handler)
    return () => globalThis.removeEventListener('keydown', handler)
  }, [handleRefreshAll])

  return (
    <DashboardLayout onShowBookmarks={() => setBookmarksOpen(true)} onRefreshAll={handleRefreshAll}>
      {visibleColumns.length === 0 ? (
        <EmptyState type="no-sources" />
      ) : (
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={visibleColumns} strategy={horizontalListSortingStrategy}>
          <Grid container spacing={2} sx={{ height: 'calc(100vh - 100px)' }}>
            {visibleColumns.map((source, index) => {
              const data = sourceDataMap[source]
              return (
                <Grid
                  key={source}
                  size={{
                    xs: 12,
                    sm: colCount <= 2 ? 6 : 12,
                    md: getMdSize(colCount),
                    lg: getLgSize(colCount),
                  }}
                >
                  <SortableColumn id={source}>
                    {(dragHandleProps) => (
                      <FeedColumn
                        source={source}
                        items={data.items}
                        isLoading={data.isLoading}
                        isError={data.isError}
                        error={data.error}
                        isFetchingNextPage={data.isFetchingNextPage}
                        hasNextPage={data.hasNextPage}
                        fetchNextPage={data.fetchNextPage}
                        refetch={data.refetch}
                        dataUpdatedAt={data.dataUpdatedAt}
                        columnIndex={index}
                        dragHandleProps={dragHandleProps}
                      />
                    )}
                  </SortableColumn>
                </Grid>
              )
            })}
          </Grid>
        </SortableContext>
      </DndContext>
      )}

      <BookmarksDrawer open={bookmarksOpen} onClose={() => setBookmarksOpen(false)} />
      <KeyboardShortcutsDialog open={shortcutsOpen} onClose={() => setShortcutsOpen(false)} />
      <StatusBar totalItems={totalItems} onShowShortcuts={() => setShortcutsOpen(true)} />
    </DashboardLayout>
  )
}
