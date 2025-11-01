/**
 * TanStack Query hooks for mech management
 *
 * Provides hooks for fetching and mutating mechs with:
 * - Automatic caching and background refetching
 * - Optimistic updates for better UX
 * - Cache invalidation on mutations
 * - Loading and error states
 * - Support for both API-backed and cache-only (local) data
 *
 * Use LOCAL_ID as the mech ID to work with cache-only data that doesn't
 * persist to the database.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { TablesInsert, TablesUpdate } from '../../types/database-generated.types'
import { fetchEntity, createEntity, updateEntity, deleteEntity } from '../../lib/api'
import { LOCAL_ID, isLocalId } from '../../lib/cacheHelpers'
import type { Tables } from '../../types/database-generated.types'

export { LOCAL_ID }

type Mech = Tables<'mechs'>

/**
 * Query key factory for mechs
 * Ensures consistent cache keys across the app
 */
export const mechsKeys = {
  all: ['mechs'] as const,
  byId: (id: string) => [...mechsKeys.all, id] as const,
}

/**
 * Hook to fetch a single mech by ID
 *
 * Supports both API-backed and cache-only (local) data:
 * - API-backed: Pass a database ID, fetches from Supabase
 * - Cache-only: Pass LOCAL_ID, returns cached data only (no API call)
 *
 * @param id - Mech ID, or LOCAL_ID for cache-only
 * @returns Query result with mech data
 *
 * @example
 * ```tsx
 * // API-backed mech
 * const { data: mech } = useMech('uuid-from-database')
 *
 * // Cache-only mech (no API calls, cleared on refresh)
 * const { data: localMech } = useMech(LOCAL_ID)
 * ```
 */
export function useMech(id: string | undefined) {
  const isLocal = isLocalId(id)

  return useQuery({
    queryKey: mechsKeys.byId(id!),
    queryFn: isLocal
      ? // Cache-only: Return undefined, data comes from cache
        async () => undefined as Mech | undefined
      : // API-backed: Fetch from Supabase
        () => fetchEntity<Mech>('mechs', id!),
    enabled: !!id, // Only run query if id is provided
    // For local data, initialize with undefined
    initialData: isLocal ? undefined : undefined,
  })
}

/**
 * Hook to create a new mech
 *
 * Supports both API-backed and cache-only (local) data:
 * - API-backed: Creates in Supabase, returns database row
 * - Cache-only: Adds to cache only, generates local ID
 *
 * Automatically invalidates the mech cache on success.
 *
 * @returns Mutation object with mutate/mutateAsync functions
 *
 * @example
 * ```tsx
 * const createMech = useCreateMech()
 *
 * // API-backed mech
 * await createMech.mutate({
 *   pilot_id: 'uuid-from-db',
 *   chassis_id: 'mule',
 * })
 *
 * // Cache-only mech
 * await createMech.mutate({
 *   id: LOCAL_ID,
 *   pilot_id: null,
 *   chassis_id: 'mule',
 * })
 * ```
 */
export function useCreateMech() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: TablesInsert<'mechs'>) => {
      const mechId = data.id

      // Cache-only mode: Add to cache without API call
      if (mechId && isLocalId(mechId)) {
        const localMech: Mech = {
          id: mechId,
          cargo: [],
          systems: [],
          modules: [],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          user_id: 'local',
          pilot_id: data.pilot_id || null,
          chassis_id: data.chassis_id || null,
          pattern: data.pattern || null,
          quirk: data.quirk || null,
          appearance: data.appearance || null,
          current_damage: data.current_damage || 0,
          current_ep: data.current_ep || 0,
          current_heat: data.current_heat || 0,
          notes: data.notes || null,
          choices: data.choices || null,
          active: data.active ?? false,
        }

        // Set in cache
        queryClient.setQueryData(mechsKeys.byId(mechId), localMech)

        return localMech
      }

      // API-backed mode: Create in Supabase
      return createEntity<Mech>('mechs', data as Mech)
    },
    onSuccess: (newMech) => {
      // Don't invalidate for local IDs - cache is already set and there's no API to refetch from
      if (isLocalId(newMech.id)) return

      // Invalidate mech cache to trigger refetch
      queryClient.invalidateQueries({
        queryKey: mechsKeys.byId(newMech.id),
      })
    },
  })
}

/**
 * Hook to update a mech
 *
 * Supports both API-backed and cache-only (local) data.
 * Automatically invalidates the mech cache on success.
 *
 * @returns Mutation object with mutate/mutateAsync functions
 *
 * @example
 * ```tsx
 * const updateMech = useUpdateMech()
 *
 * await updateMech.mutate({
 *   id: mechId,
 *   updates: { current_damage: 5 },
 * })
 * ```
 */
export function useUpdateMech() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: TablesUpdate<'mechs'> }) => {
      // Cache-only mode: Update cache without API call
      if (isLocalId(id)) {
        const currentMech = queryClient.getQueryData<Mech>(mechsKeys.byId(id))
        if (!currentMech) {
          throw new Error('Mech not found in cache')
        }

        const updatedMech: Mech = {
          ...currentMech,
          ...updates,
          updated_at: new Date().toISOString(),
        }

        queryClient.setQueryData(mechsKeys.byId(id), updatedMech)
        return updatedMech
      }

      // API-backed mode: Update in Supabase
      await updateEntity<Mech>('mechs', id, updates)
      // Fetch updated entity
      return fetchEntity<Mech>('mechs', id)
    },
    // Optimistic update for API-backed mode
    onMutate: async ({ id, updates }) => {
      if (isLocalId(id)) return

      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: mechsKeys.byId(id) })

      // Snapshot previous value
      const previousMech = queryClient.getQueryData<Mech>(mechsKeys.byId(id))

      // Optimistically update cache
      if (previousMech) {
        queryClient.setQueryData<Mech>(mechsKeys.byId(id), {
          ...previousMech,
          ...updates,
          updated_at: new Date().toISOString(),
        })
      }

      return { previousMech, id }
    },
    // Rollback on error
    onError: (_err, _variables, context) => {
      if (context?.previousMech) {
        queryClient.setQueryData(mechsKeys.byId(context.id), context.previousMech)
      }
    },
    // Refetch on success (API-backed only)
    onSuccess: (_updatedMech, variables) => {
      // Don't invalidate for local IDs - cache is already updated and there's no API to refetch from
      if (isLocalId(variables.id)) return

      queryClient.invalidateQueries({
        queryKey: mechsKeys.byId(variables.id),
      })
    },
  })
}

/**
 * Hook to delete a mech
 *
 * Automatically invalidates the mech cache on success.
 *
 * @returns Mutation object with mutate/mutateAsync functions
 *
 * @example
 * ```tsx
 * const deleteMech = useDeleteMech()
 *
 * await deleteMech.mutate(mechId)
 * ```
 */
export function useDeleteMech() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      // Cache-only mode: Remove from cache
      if (isLocalId(id)) {
        queryClient.removeQueries({ queryKey: mechsKeys.byId(id) })
        return
      }

      // API-backed mode: Delete from Supabase
      await deleteEntity('mechs', id)
    },
    onSuccess: (_, id) => {
      // Don't invalidate for local IDs - cache is already removed
      if (isLocalId(id)) return

      // Invalidate mech cache
      queryClient.invalidateQueries({
        queryKey: mechsKeys.byId(id),
      })
    },
  })
}
