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

import { useQuery, useMutation, useQueryClient, type QueryClient } from '@tanstack/react-query'
import type { TablesInsert, TablesUpdate } from '../../types/database-generated.types'
import { fetchEntity, createEntity, updateEntity, deleteEntity } from '../../lib/api'
import type { Tables } from '../../types/database-generated.types'
import { isLocalId, LOCAL_ID, generateLocalId } from '../../lib/cacheHelpers'
import { SalvageUnionReference } from 'salvageunion-reference'
import { createNormalizedEntity } from '../../lib/api/normalizedEntities'
import { entitiesKeys } from '../suentity/useSUEntities'
import type { HydratedEntity } from '../../types/hydrated'

type Crawler = Tables<'crawlers'>

/**
 * Create bay entities for a crawler
 * Creates one entity for each crawler bay type from salvageunion-reference
 *
 * @param crawlerId - ID of the crawler
 * @param queryClient - TanStack Query client for cache updates
 */
async function createCrawlerBays(crawlerId: string, queryClient: QueryClient): Promise<void> {
  const allBays = SalvageUnionReference.CrawlerBays.all()
  const isLocal = isLocalId(crawlerId)

  if (isLocal) {
    const bayEntities: HydratedEntity[] = allBays.map((bay) => {
      const now = new Date().toISOString()
      return {
        id: generateLocalId(),
        created_at: now,
        updated_at: now,
        pilot_id: null,
        mech_id: null,
        crawler_id: crawlerId,
        parent_entity_id: null,
        schema_name: 'crawler-bays',
        schema_ref_id: bay.id,
        metadata: {
          damaged: false,
          npc: {
            name: '',
            notes: '',
            hitPoints: bay.npc.hitPoints,
            damage: 0,
          },
        },
        ref: bay,
        choices: [],
      }
    })

    queryClient.setQueryData(entitiesKeys.forParent('crawler', crawlerId), bayEntities)
  } else {
    await Promise.all(
      allBays.map((bay) =>
        createNormalizedEntity({
          crawler_id: crawlerId,
          schema_name: 'crawler-bays',
          schema_ref_id: bay.id,
          metadata: {
            damaged: false,
            npc: {
              name: '',
              notes: '',
              hitPoints: bay.npc.hitPoints,
              damage: 0,
            },
          },
        })
      )
    )
  }
}

/**
 * Query key factory for crawlers
 * Ensures consistent cache keys across the app
 */
export const crawlersKeys = {
  all: ['crawlers'] as const,
  byId: (id: string) => [...crawlersKeys.all, id] as const,
}

const defaultCrawler: Crawler = {
  id: LOCAL_ID,
  name: 'New Crawler',
  current_damage: 0,
  tech_level: 1,
  upgrade: 0,
  active: false,
  private: true,
  user_id: 'local',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  description: null,
  game_id: null,
  notes: null,
  npc: null,
  scrap_tl_one: 0,
  scrap_tl_two: 0,
  scrap_tl_three: 0,
  scrap_tl_four: 0,
  scrap_tl_five: 0,
  scrap_tl_six: 0,
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
    queryFn: isLocal ? async () => defaultCrawler : () => fetchEntity<Crawler>('crawlers', id!),
    enabled: !!id,

    initialData: isLocal ? defaultCrawler : undefined,
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
 * })
 *
 * // Cache-only crawler
 * await createCrawler.mutate({
 *   id: LOCAL_ID,
 *   name: 'The Wanderer',
 * })
 * ```
 */
export function useCreateCrawler() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: TablesInsert<'crawlers'>) => {
      const crawlerId = data.id

      if (crawlerId && isLocalId(crawlerId)) {
        const localCrawler: Crawler = {
          id: crawlerId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          user_id: 'local',
          name: data.name || '',
          tech_level: data.tech_level || null,
          upgrade: data.upgrade || null,
          current_damage: data.current_damage || null,
          notes: data.notes || null,
          active: data.active ?? false,
          private: data.private ?? true,
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

        queryClient.setQueryData(crawlersKeys.byId(crawlerId), localCrawler)

        return localCrawler
      }

      return createEntity<Crawler>('crawlers', data as Crawler)
    },
    onSuccess: async (newCrawler) => {
      await createCrawlerBays(newCrawler.id, queryClient)

      if (isLocalId(newCrawler.id)) return

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

      await updateEntity<Crawler>('crawlers', id, updates)

      return fetchEntity<Crawler>('crawlers', id)
    },

    onMutate: async ({ id, updates }) => {
      if (isLocalId(id)) return

      await queryClient.cancelQueries({ queryKey: crawlersKeys.byId(id) })

      const previousCrawler = queryClient.getQueryData<Crawler>(crawlersKeys.byId(id))

      if (previousCrawler) {
        queryClient.setQueryData<Crawler>(crawlersKeys.byId(id), {
          ...previousCrawler,
          ...updates,
          updated_at: new Date().toISOString(),
        })
      }

      return { previousCrawler, id }
    },

    onError: (_err, _variables, context) => {
      if (context?.previousCrawler) {
        queryClient.setQueryData(crawlersKeys.byId(context.id), context.previousCrawler)
      }
    },

    onSuccess: (_updatedCrawler, variables) => {
      if (isLocalId(variables.id)) return

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
      if (isLocalId(id)) {
        queryClient.removeQueries({ queryKey: crawlersKeys.byId(id) })
        return
      }

      await deleteEntity('crawlers', id)
    },
    onSuccess: (_, id) => {
      if (isLocalId(id)) return

      queryClient.invalidateQueries({
        queryKey: crawlersKeys.byId(id),
      })
    },
  })
}
