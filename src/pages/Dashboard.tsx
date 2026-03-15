import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Box, IconButton, Tooltip } from '@mui/material'
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
import { useStackOverflow } from '@/hooks/useStackOverflow'
import { useIndieHackers } from '@/hooks/useIndieHackers'
import FeedColumn from '@/components/FeedColumn/FeedColumn'
import { ChevronLeft as ChevronLeftIcon, ChevronRight as ChevronRightIcon } from '@mui/icons-material'
import DashboardLayout from '@/components/Layout/DashboardLayout'
import BookmarksDrawer from '@/components/Bookmarks/BookmarksDrawer'
import EmptyState from '@/components/EmptyState/EmptyState'
import KeyboardShortcutsDialog from '@/components/KeyboardShortcuts/KeyboardShortcutsDialog'
import StatusBar from '@/components/StatusBar/StatusBar'
import { useKeyboardNavigation } from '@/hooks/useKeyboardNavigation'
import { useNotificationStore } from '@/store/notificationStore'

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
    <Box ref={setNodeRef} style={style} sx={{ height: '100%' }}>
      {children({ ...attributes, ...listeners })}
    </Box>
  )
}

export default function Dashboard() {
  const [bookmarksOpen, setBookmarksOpen] = useState(false)

  const { enabledSources, columnOrder, setColumnOrder } = usePreferencesStore()
  const addToast = useNotificationStore((s) => s.addToast)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
  )

  const hn = useHackerNews(enabledSources.includes('hackernews'))
  const reddit = useReddit(enabledSources.includes('reddit'))
  const devto = useDevto(enabledSources.includes('devto'))
  const github = useGithubTrending('daily', enabledSources.includes('github'))
  const lobsters = useLobsters(enabledSources.includes('lobsters'))
  const hashnode = useHashnode(enabledSources.includes('hashnode'))
  const producthunt = useProductHunt(enabledSources.includes('producthunt'))
  const stackoverflow = useStackOverflow(enabledSources.includes('stackoverflow'))
  const indiehackers = useIndieHackers(enabledSources.includes('indiehackers'))

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
      stackoverflow: {
        items: stackoverflow.data?.pages.flat() ?? [],
        isLoading: stackoverflow.isLoading,
        isError: stackoverflow.isError,
        error: stackoverflow.error,
        isFetchingNextPage: stackoverflow.isFetchingNextPage,
        hasNextPage: stackoverflow.hasNextPage,
        fetchNextPage: stackoverflow.fetchNextPage,
        refetch: stackoverflow.refetch,
        dataUpdatedAt: stackoverflow.dataUpdatedAt,
      },
      indiehackers: {
        items: indiehackers.data?.pages.flat() ?? [],
        isLoading: indiehackers.isLoading,
        isError: indiehackers.isError,
        error: indiehackers.error,
        isFetchingNextPage: indiehackers.isFetchingNextPage,
        hasNextPage: indiehackers.hasNextPage,
        fetchNextPage: indiehackers.fetchNextPage,
        refetch: indiehackers.refetch,
        dataUpdatedAt: indiehackers.dataUpdatedAt,
      },
    }),
    [hn, reddit, devto, github, lobsters, hashnode, producthunt, stackoverflow, indiehackers],
  )

  const visibleColumns = useMemo(
    () => columnOrder.filter((source) => enabledSources.includes(source) && source in sourceDataMap),
    [columnOrder, enabledSources, sourceDataMap],
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

  const [shortcutsOpen, setShortcutsOpen] = useState(false)

  const COLUMN_WIDTH = 340
  const COLUMN_GAP = 12

  const trackRef = useRef<HTMLDivElement>(null)
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(false)

  const updateNavState = useCallback(() => {
    const el = trackRef.current
    if (!el) return
    setCanPrev(el.scrollLeft > 2)
    setCanNext(el.scrollLeft < el.scrollWidth - el.clientWidth - 2)
  }, [])

  const scrollByCol = useCallback(
    (dir: -1 | 1) => {
      trackRef.current?.scrollBy({ left: dir * (COLUMN_WIDTH + COLUMN_GAP), behavior: 'smooth' })
    },
    [COLUMN_WIDTH, COLUMN_GAP],
  )

  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    updateNavState()
    const obs = new ResizeObserver(updateNavState)
    obs.observe(el)
    return () => obs.disconnect()
  }, [updateNavState, visibleColumns])

  const totalItems = useMemo(
    () =>
      visibleColumns.reduce((acc, source) => acc + sourceDataMap[source].items.length, 0),
    [visibleColumns, sourceDataMap],
  )

  const columnItemsForNav = useMemo(
    () =>
      visibleColumns.map((source) => ({
        source,
        items: sourceDataMap[source].items,
      })),
    [visibleColumns, sourceDataMap],
  )
  useKeyboardNavigation(columnItemsForNav)

  const handleRefreshAll = useCallback(() => {
    hn.refetch()
    reddit.refetch()
    devto.refetch()
    github.refetch()
    lobsters.refetch()
    hashnode.refetch()
    producthunt.refetch()
    stackoverflow.refetch()
    indiehackers.refetch()
    addToast({ message: 'Refreshing all sources…', severity: 'info', duration: 2000 })
  }, [hn, reddit, devto, github, lobsters, hashnode, producthunt, stackoverflow, indiehackers, addToast])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).matches('input,textarea,select')) return
      if (e.key === '?') {
        setShortcutsOpen(true)
      } else if (e.key === 'r') {
        handleRefreshAll()
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        scrollByCol(-1)
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        scrollByCol(1)
      }
    }
    globalThis.addEventListener('keydown', handler)
    return () => globalThis.removeEventListener('keydown', handler)
  }, [handleRefreshAll, scrollByCol])

  return (
    <DashboardLayout onShowBookmarks={() => setBookmarksOpen(true)} onRefreshAll={handleRefreshAll}>
      {visibleColumns.length === 0 ? (
        <EmptyState type="no-sources" />
      ) : (
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={visibleColumns} strategy={horizontalListSortingStrategy}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, height: 'calc(100vh - 100px)', px: 0.5 }}>

            {/* Left nav */}
            <Tooltip title="Previous (←)" placement="right">
              <span>
                <IconButton
                  onClick={() => scrollByCol(-1)}
                  disabled={!canPrev}
                  size="small"
                  sx={{
                    flexShrink: 0,
                    width: 32,
                    height: 64,
                    borderRadius: 2,
                    bgcolor: 'background.paper',
                    border: '1px solid',
                    borderColor: 'divider',
                    color: 'text.primary',
                    transition: 'all 200ms ease',
                    '&:hover': { bgcolor: 'action.hover', borderColor: 'primary.main' },
                    '&:disabled': { opacity: 0.25 },
                  }}
                >
                  <ChevronLeftIcon fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>

            {/* Scrollable track */}
            <Box
              ref={trackRef as React.Ref<HTMLDivElement>}
              onScroll={updateNavState}
              sx={{
                flex: 1,
                display: 'flex',
                gap: `${COLUMN_GAP}px`,
                overflowX: 'hidden',
                height: '100%',
                py: 0,
                scrollBehavior: 'smooth',
              }}
            >
              {visibleColumns.map((source, index) => {
                const data = sourceDataMap[source]
                return (
                  <Box
                    key={source}
                    sx={{ width: COLUMN_WIDTH, flexShrink: 0, height: '100%' }}
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
                  </Box>
                )
              })}
            </Box>

            {/* Right nav */}
            <Tooltip title="Next (→)" placement="left">
              <span>
                <IconButton
                  onClick={() => scrollByCol(1)}
                  disabled={!canNext}
                  size="small"
                  sx={{
                    flexShrink: 0,
                    width: 32,
                    height: 64,
                    borderRadius: 2,
                    bgcolor: 'background.paper',
                    border: '1px solid',
                    borderColor: 'divider',
                    color: 'text.primary',
                    transition: 'all 200ms ease',
                    '&:hover': { bgcolor: 'action.hover', borderColor: 'primary.main' },
                    '&:disabled': { opacity: 0.25 },
                  }}
                >
                  <ChevronRightIcon fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>

          </Box>
        </SortableContext>
      </DndContext>
      )}

      <BookmarksDrawer open={bookmarksOpen} onClose={() => setBookmarksOpen(false)} />
      <KeyboardShortcutsDialog open={shortcutsOpen} onClose={() => setShortcutsOpen(false)} />
      <StatusBar totalItems={totalItems} onShowShortcuts={() => setShortcutsOpen(true)} />
    </DashboardLayout>
  )
}
