/**
 * TanStack Query hooks for crawler management
 *
 * Provides hooks for fetching and mutating crawlers with:
 * - Automatic caching and background refetching
 * - Optimistic updates for better UX
 * - Cache invalidation on mutations
 * - Loading and error states
 * - Support for both API-backed and cache-only (local) data
 *
 * Use LOCAL_ID as the crawler ID to work with cache-only data that doesn't
 * persist to the database.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { TablesInsert, TablesUpdate } from '../../types/database-generated.types'
import { fetchEntity, createEntity, updateEntity, deleteEntity } from '../../lib/api'
import { LOCAL_ID, isLocalId } from '../../lib/cacheHelpers'
import type { Tables } from '../../types/database-generated.types'

export { LOCAL_ID }

type Crawler = Tables<'crawlers'>

/**
 * Query key factory for crawlers
 * Ensures consistent cache keys across the app
 */
export const crawlersKeys = {
  all: ['crawlers'] as const,
  byId: (id: string) => [...crawlersKeys.all, id] as const,
}

/**
 * Hook to fetch a single crawler by ID
 *
 * Supports both API-backed and cache-only (local) data:
 * - API-backed: Pass a database ID, fetches from Supabase
 * - Cache-only: Pass LOCAL_ID, returns cached data only (no API call)
 *
 * @param id - Crawler ID, or LOCAL_ID for cache-only
 * @returns Query result with crawler data
 *
 * @example
 * ```tsx
 * // API-backed crawler
 * const { data: crawler } = useCrawler('uuid-from-database')
 *
 * // Cache-only crawler (no API calls, cleared on refresh)
 * const { data: localCrawler } = useCrawler(LOCAL_ID)
 * ```
 */
export function useCrawler(id: string | undefined) {
  const isLocal = isLocalId(id)

  return useQuery({
    queryKey: crawlersKeys.byId(id!),
    queryFn: isLocal
      ? // Cache-only: Return undefined, data comes from cache
        async () => undefined as Crawler | undefined
      : // API-backed: Fetch from Supabase
        () => fetchEntity<Crawler>('crawlers', id!),
    enabled: !!id, // Only run query if id is provided
    // For local data, initialize with undefined
    initialData: isLocal ? undefined : undefined,
  })
}

/**
 * Hook to create a new crawler
 *
 * Supports both API-backed and cache-only (local) data:
 * - API-backed: Creates in Supabase, returns database row
 * - Cache-only: Adds to cache only, uses LOCAL_ID
 *
 * Automatically invalidates the crawler cache on success.
 *
 * @returns Mutation object with mutate/mutateAsync functions
 *
 * @example
 * ```tsx
 * const createCrawler = useCreateCrawler()
 *
 * // API-backed crawler
 * await createCrawler.mutate({
 *   name: 'The Wanderer',
 *   crawler_type_id: 'hauler',
 * })
 *
 * // Cache-only crawler
 * await createCrawler.mutate({
 *   id: LOCAL_ID,
 *   name: 'The Wanderer',
 *   crawler_type_id: 'hauler',
 * })
 * ```
 */
export function useCreateCrawler() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: TablesInsert<'crawlers'>) => {
      const crawlerId = data.id

      // Cache-only mode: Add to cache without API call
      if (crawlerId && isLocalId(crawlerId)) {
        const localCrawler: Crawler = {
          id: crawlerId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          user_id: 'local',
          name: data.name || '',
          crawler_type_id: data.crawler_type_id || null,
          tech_level: data.tech_level || null,
          upgrade: data.upgrade || null,
          current_damage: data.current_damage || null,
          notes: data.notes || null,
          choices: data.choices || null,
          active: data.active ?? false,
          bays: data.bays || null,
          cargo: data.cargo || null,
          description: data.description || null,
          game_id: data.game_id || null,
          npc: data.npc || null,
          scrap_tl_one: data.scrap_tl_one || null,
          scrap_tl_two: data.scrap_tl_two || null,
          scrap_tl_three: data.scrap_tl_three || null,
          scrap_tl_four: data.scrap_tl_four || null,
          scrap_tl_five: data.scrap_tl_five || null,
          scrap_tl_six: data.scrap_tl_six || null,
        }

        // Set in cache
        queryClient.setQueryData(crawlersKeys.byId(crawlerId), localCrawler)

        return localCrawler
      }

      // API-backed mode: Create in Supabase
      return createEntity<Crawler>('crawlers', data as Crawler)
    },
    onSuccess: (newCrawler) => {
      // Invalidate crawler cache to trigger refetch
      queryClient.invalidateQueries({
        queryKey: crawlersKeys.byId(newCrawler.id),
      })
    },
  })
}

/**
 * Hook to update a crawler
 *
 * Supports both API-backed and cache-only (local) data.
 * Automatically invalidates the crawler cache on success.
 *
 * @returns Mutation object with mutate/mutateAsync functions
 *
 * @example
 * ```tsx
 * const updateCrawler = useUpdateCrawler()
 *
 * await updateCrawler.mutate({
 *   id: crawlerId,
 *   updates: { current_sp: 10 },
 * })
 * ```
 */
export function useUpdateCrawler() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: TablesUpdate<'crawlers'> }) => {
      // Cache-only mode: Update cache without API call
      if (isLocalId(id)) {
        const currentCrawler = queryClient.getQueryData<Crawler>(crawlersKeys.byId(id))
        if (!currentCrawler) {
          throw new Error('Crawler not found in cache')
        }

        const updatedCrawler: Crawler = {
          ...currentCrawler,
          ...updates,
          updated_at: new Date().toISOString(),
        }

        queryClient.setQueryData(crawlersKeys.byId(id), updatedCrawler)
        return updatedCrawler
      }

      // API-backed mode: Update in Supabase
      await updateEntity<Crawler>('crawlers', id, updates)
      // Fetch updated entity
      return fetchEntity<Crawler>('crawlers', id)
    },
    // Optimistic update for API-backed mode
    onMutate: async ({ id, updates }) => {
      if (isLocalId(id)) return

      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: crawlersKeys.byId(id) })

      // Snapshot previous value
      const previousCrawler = queryClient.getQueryData<Crawler>(crawlersKeys.byId(id))

      // Optimistically update cache
      if (previousCrawler) {
        queryClient.setQueryData<Crawler>(crawlersKeys.byId(id), {
          ...previousCrawler,
          ...updates,
          updated_at: new Date().toISOString(),
        })
      }

      return { previousCrawler, id }
    },
    // Rollback on error
    onError: (_err, _variables, context) => {
      if (context?.previousCrawler) {
        queryClient.setQueryData(crawlersKeys.byId(context.id), context.previousCrawler)
      }
    },
    // Refetch on success
    onSuccess: (_updatedCrawler, variables) => {
      queryClient.invalidateQueries({
        queryKey: crawlersKeys.byId(variables.id),
      })
    },
  })
}

/**
 * Hook to delete a crawler
 *
 * Automatically invalidates the crawler cache on success.
 *
 * @returns Mutation object with mutate/mutateAsync functions
 *
 * @example
 * ```tsx
 * const deleteCrawler = useDeleteCrawler()
 *
 * await deleteCrawler.mutate(crawlerId)
 * ```
 */
export function useDeleteCrawler() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      // Cache-only mode: Remove from cache
      if (isLocalId(id)) {
        queryClient.removeQueries({ queryKey: crawlersKeys.byId(id) })
        return
      }

      // API-backed mode: Delete from Supabase
      await deleteEntity('crawlers', id)
    },
    onSuccess: (_, id) => {
      // Invalidate crawler cache
      queryClient.invalidateQueries({
        queryKey: crawlersKeys.byId(id),
      })
    },
  })
}
