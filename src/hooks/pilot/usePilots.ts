/**
 * TanStack Query hooks for pilot management
 *
 * Provides hooks for fetching and mutating pilots with:
 * - Automatic caching and background refetching
 * - Optimistic updates for better UX
 * - Cache invalidation on mutations
 * - Loading and error states
 * - Support for both API-backed and cache-only (local) data
 *
 * Use LOCAL_ID as the pilot ID to work with cache-only data that doesn't
 * persist to the database.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { TablesInsert, TablesUpdate } from '../../types/database-generated.types'
import { fetchEntity, createEntity, updateEntity, deleteEntity } from '../../lib/api'
import { LOCAL_ID, isLocalId } from '../../lib/cacheHelpers'
import type { Tables } from '../../types/database-generated.types'

export { LOCAL_ID }

type Pilot = Tables<'pilots'>

/**
 * Query key factory for pilots
 * Ensures consistent cache keys across the app
 */
export const pilotsKeys = {
  all: ['pilots'] as const,
  byId: (id: string) => [...pilotsKeys.all, id] as const,
}

/**
 * Hook to fetch a single pilot by ID
 *
 * Supports both API-backed and cache-only (local) data:
 * - API-backed: Pass a database ID, fetches from Supabase
 * - Cache-only: Pass LOCAL_ID, returns cached data only (no API call)
 *
 * @param id - Pilot ID, or LOCAL_ID for cache-only
 * @returns Query result with pilot data
 *
 * @example
 * ```tsx
 * // API-backed pilot
 * const { data: pilot } = usePilot('uuid-from-database')
 *
 * // Cache-only pilot (no API calls, cleared on refresh)
 * const { data: localPilot } = usePilot(LOCAL_ID)
 * ```
 */
export function usePilot(id: string | undefined) {
  const isLocal = isLocalId(id)

  return useQuery({
    queryKey: pilotsKeys.byId(id!),
    queryFn: isLocal
      ? // Cache-only: Return undefined, data comes from cache
        async () => undefined as Pilot | undefined
      : // API-backed: Fetch from Supabase
        () => fetchEntity<Pilot>('pilots', id!),
    enabled: !!id, // Only run query if id is provided
    // For local data, initialize with undefined
    initialData: isLocal ? undefined : undefined,
  })
}

/**
 * Hook to create a new pilot
 *
 * Supports both API-backed and cache-only (local) data:
 * - API-backed: Creates in Supabase, returns database row
 * - Cache-only: Adds to cache only, generates local ID
 *
 * Automatically invalidates the pilot cache on success.
 *
 * @returns Mutation object with mutate/mutateAsync functions
 *
 * @example
 * ```tsx
 * const createPilot = useCreatePilot()
 *
 * // API-backed pilot
 * await createPilot.mutate({
 *   name: 'Alex',
 *   class_id: 'hauler',
 * })
 *
 * // Cache-only pilot
 * await createPilot.mutate({
 *   id: LOCAL_ID,
 *   name: 'Alex',
 *   class_id: 'hauler',
 * })
 * ```
 */
export function useCreatePilot() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: TablesInsert<'pilots'>) => {
      const pilotId = data.id

      // Cache-only mode: Add to cache without API call
      if (pilotId && isLocalId(pilotId)) {
        const localPilot: Pilot = {
          id: pilotId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          user_id: 'local',
          callsign: data.callsign || '',
          class_id: data.class_id || null,
          background: data.background || null,
          appearance: data.appearance || null,
          current_ap: data.current_ap || null,
          current_damage: data.current_damage || null,
          current_tp: data.current_tp || null,
          notes: data.notes || null,
          choices: data.choices || null,
          active: data.active ?? false,
          abilities: data.abilities || null,
          advanced_class_id: data.advanced_class_id || null,
          background_used: data.background_used || null,
          crawler_id: data.crawler_id || null,
          equipment: data.equipment || null,
          keepsake: data.keepsake || null,
          keepsake_used: data.keepsake_used || null,
          max_ap: data.max_ap || null,
          max_hp: data.max_hp || null,
          motto: data.motto || null,
          motto_used: data.motto_used || null,
        }

        // Set in cache
        queryClient.setQueryData(pilotsKeys.byId(pilotId), localPilot)

        return localPilot
      }

      // API-backed mode: Create in Supabase
      return createEntity<Pilot>('pilots', data as Pilot)
    },
    onSuccess: (newPilot) => {
      // Invalidate pilot cache to trigger refetch
      queryClient.invalidateQueries({
        queryKey: pilotsKeys.byId(newPilot.id),
      })
    },
  })
}

/**
 * Hook to update a pilot
 *
 * Supports both API-backed and cache-only (local) data.
 * Automatically invalidates the pilot cache on success.
 *
 * @returns Mutation object with mutate/mutateAsync functions
 *
 * @example
 * ```tsx
 * const updatePilot = useUpdatePilot()
 *
 * await updatePilot.mutate({
 *   id: pilotId,
 *   updates: { current_hp: 8 },
 * })
 * ```
 */
export function useUpdatePilot() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: TablesUpdate<'pilots'> }) => {
      // Cache-only mode: Update cache without API call
      if (isLocalId(id)) {
        const currentPilot = queryClient.getQueryData<Pilot>(pilotsKeys.byId(id))
        if (!currentPilot) {
          throw new Error('Pilot not found in cache')
        }

        const updatedPilot: Pilot = {
          ...currentPilot,
          ...updates,
          updated_at: new Date().toISOString(),
        }

        queryClient.setQueryData(pilotsKeys.byId(id), updatedPilot)
        return updatedPilot
      }

      // API-backed mode: Update in Supabase
      await updateEntity<Pilot>('pilots', id, updates)
      // Fetch updated entity
      return fetchEntity<Pilot>('pilots', id)
    },
    // Optimistic update for API-backed mode
    onMutate: async ({ id, updates }) => {
      if (isLocalId(id)) return

      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: pilotsKeys.byId(id) })

      // Snapshot previous value
      const previousPilot = queryClient.getQueryData<Pilot>(pilotsKeys.byId(id))

      // Optimistically update cache
      if (previousPilot) {
        queryClient.setQueryData<Pilot>(pilotsKeys.byId(id), {
          ...previousPilot,
          ...updates,
          updated_at: new Date().toISOString(),
        })
      }

      return { previousPilot, id }
    },
    // Rollback on error
    onError: (_err, _variables, context) => {
      if (context?.previousPilot) {
        queryClient.setQueryData(pilotsKeys.byId(context.id), context.previousPilot)
      }
    },
    // Refetch on success
    onSuccess: (_updatedPilot, variables) => {
      queryClient.invalidateQueries({
        queryKey: pilotsKeys.byId(variables.id),
      })
    },
  })
}

/**
 * Hook to delete a pilot
 *
 * Automatically invalidates the pilot cache on success.
 *
 * @returns Mutation object with mutate/mutateAsync functions
 *
 * @example
 * ```tsx
 * const deletePilot = useDeletePilot()
 *
 * deletePilot.mutate(pilotId)
 * ```
 */
export function useDeletePilot() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      // Cache-only mode: Remove from cache
      if (isLocalId(id)) {
        queryClient.removeQueries({ queryKey: pilotsKeys.byId(id) })
        return
      }

      // API-backed mode: Delete from Supabase
      await deleteEntity('pilots', id)
    },
    onSuccess: (_, id) => {
      // Invalidate pilot cache
      queryClient.invalidateQueries({
        queryKey: pilotsKeys.byId(id),
      })
    },
  })
}
