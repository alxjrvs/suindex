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

const defaultPilot: Pilot = {
  id: LOCAL_ID,
  image_url: null,
  callsign: 'Unknown Name',
  max_hp: 10,
  max_ap: 5,
  current_damage: 0,
  current_ap: 0,
  abilities: [],
  equipment: [],
  active: false,
  private: true,
  user_id: 'local',
  appearance: null,
  background: null,
  background_used: null,
  crawler_id: null,
  created_at: new Date().toISOString(),
  current_tp: 0,
  notes: null,
  keepsake: null,
  keepsake_used: null,
  motto: null,
  motto_used: null,
  updated_at: new Date().toISOString(),
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
    queryFn: isLocal ? async () => defaultPilot : () => fetchEntity<Pilot>('pilots', id!),
    enabled: !!id,
    initialData: isLocal ? defaultPilot : undefined,
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
 *   callsign: 'Alex',
 * })
 *
 * // Cache-only pilot
 * await createPilot.mutate({
 *   id: LOCAL_ID,
 *   callsign: 'Alex',
 * })
 * ```
 */
export function useCreatePilot() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: TablesInsert<'pilots'>) => {
      const pilotId = data.id

      if (pilotId && isLocalId(pilotId)) {
        queryClient.setQueryData(pilotsKeys.byId(pilotId), defaultPilot)

        return defaultPilot
      }

      return createEntity<Pilot>('pilots', data as Pilot)
    },
    onSuccess: (newPilot) => {
      if (isLocalId(newPilot.id)) return

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

      await updateEntity<Pilot>('pilots', id, updates)

      return fetchEntity<Pilot>('pilots', id)
    },

    onMutate: async ({ id, updates }) => {
      if (isLocalId(id)) return

      await queryClient.cancelQueries({ queryKey: pilotsKeys.byId(id) })

      const previousPilot = queryClient.getQueryData<Pilot>(pilotsKeys.byId(id))

      if (previousPilot) {
        queryClient.setQueryData<Pilot>(pilotsKeys.byId(id), {
          ...previousPilot,
          ...updates,
          updated_at: new Date().toISOString(),
        })
      }

      return { previousPilot, id }
    },

    onError: (_err, _variables, context) => {
      if (context?.previousPilot) {
        queryClient.setQueryData(pilotsKeys.byId(context.id), context.previousPilot)
      }
    },

    onSuccess: (_updatedPilot, variables) => {
      if (isLocalId(variables.id)) return

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
      if (isLocalId(id)) {
        queryClient.removeQueries({ queryKey: pilotsKeys.byId(id) })
        return
      }

      await deleteEntity('pilots', id)
    },
    onSuccess: (_, id) => {
      if (isLocalId(id)) {
        queryClient.invalidateQueries({
          queryKey: pilotsKeys.all,
        })
        return
      }

      queryClient.invalidateQueries({
        queryKey: pilotsKeys.all,
      })
    },
  })
}
