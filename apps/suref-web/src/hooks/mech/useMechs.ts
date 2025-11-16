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

const defaultMech: Mech = {
  id: LOCAL_ID,
  systems: [],
  modules: [],
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  user_id: 'local',
  pilot_id: null,
  pattern: null,
  quirk: null,
  appearance: null,
  current_damage: 0,
  current_ep: 0,
  current_heat: 0,
  notes: null,
  active: false,
  private: true,
  image_url: null,
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
    queryFn: isLocal ? async () => defaultMech : () => fetchEntity<Mech>('mechs', id!),
    enabled: !!id,

    initialData: isLocal ? defaultMech : undefined,
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
 *   name: 'Iron Giant',
 * })
 *
 * // Cache-only mech
 * await createMech.mutate({
 *   id: LOCAL_ID,
 *   pilot_id: null,
 *   name: 'Iron Giant',
 * })
 * ```
 */
export function useCreateMech() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: TablesInsert<'mechs'>) => {
      const mechId = data.id

      if (mechId && isLocalId(mechId)) {
        queryClient.setQueryData(mechsKeys.byId(mechId), defaultMech)

        return defaultMech
      }

      return createEntity<Mech>('mechs', data as Mech)
    },
    onSuccess: (newMech) => {
      if (isLocalId(newMech.id)) return

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

      await updateEntity<Mech>('mechs', id, updates)

      return fetchEntity<Mech>('mechs', id)
    },

    onMutate: async ({ id, updates }) => {
      if (isLocalId(id)) return

      await queryClient.cancelQueries({ queryKey: mechsKeys.byId(id) })

      const previousMech = queryClient.getQueryData<Mech>(mechsKeys.byId(id))

      if (previousMech) {
        queryClient.setQueryData<Mech>(mechsKeys.byId(id), {
          ...previousMech,
          ...updates,
          updated_at: new Date().toISOString(),
        })
      }

      return { previousMech, id }
    },

    onError: (_err, _variables, context) => {
      if (context?.previousMech) {
        queryClient.setQueryData(mechsKeys.byId(context.id), context.previousMech)
      }
    },

    onSuccess: (_updatedMech, variables) => {
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
      if (isLocalId(id)) {
        queryClient.removeQueries({ queryKey: mechsKeys.byId(id) })
        return
      }

      await deleteEntity('mechs', id)
    },
    onSuccess: (_, id) => {
      if (isLocalId(id)) return

      queryClient.invalidateQueries({
        queryKey: mechsKeys.byId(id),
      })
    },
  })
}
