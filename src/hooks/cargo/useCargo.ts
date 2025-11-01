/**
 * TanStack Query hooks for cargo management
 *
 * Provides hooks for fetching and mutating cargo with:
 * - Automatic caching and background refetching
 * - Optimistic updates for better UX
 * - Cache invalidation on mutations
 * - Loading and error states
 * - Support for both API-backed and cache-only (local) data
 *
 * Use LOCAL_ID as the parent ID to work with cache-only data that doesn't
 * persist to the database.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { TablesInsert, TablesUpdate } from '../../types/database-generated.types'
import { fetchCargoForParent, createCargo, updateCargo, deleteCargo } from '../../lib/api/cargo'
import { LOCAL_ID, isLocalId, generateLocalId, addToCache } from '../../lib/cacheHelpers'
import type { HydratedCargo } from '../../types/hydrated'

export { LOCAL_ID }

/**
 * Query key factory for cargo
 * Ensures consistent cache keys across the app
 */
export const cargoKeys = {
  all: ['cargo'] as const,
  forParent: (parentType: 'mech' | 'crawler', parentId: string) =>
    [...cargoKeys.all, parentType, parentId] as const,
}

/**
 * Hook to fetch cargo for a parent (mech or crawler)
 *
 * Supports both API-backed and cache-only (local) data:
 * - API-backed: Pass a database ID, fetches from Supabase
 * - Cache-only: Pass LOCAL_ID, returns cached data only (no API call)
 *
 * @param parentType - Type of parent entity
 * @param parentId - ID of parent entity, or LOCAL_ID for cache-only
 * @returns Query result with hydrated cargo
 *
 * @example
 * ```tsx
 * // API-backed cargo
 * const { data: cargo } = useCargo('mech', mechId)
 *
 * // Cache-only cargo (no API calls, cleared on refresh)
 * const { data: localCargo } = useCargo('mech', LOCAL_ID)
 * ```
 */
export function useCargo(parentType: 'mech' | 'crawler', parentId: string | undefined) {
  const isLocal = isLocalId(parentId)

  return useQuery({
    queryKey: cargoKeys.forParent(parentType, parentId!),
    queryFn: isLocal
      ? // Cache-only: Return empty array, data comes from cache
        async () => [] as HydratedCargo[]
      : // API-backed: Fetch from Supabase
        () => fetchCargoForParent(parentType, parentId!),
    enabled: !!parentId, // Only run query if parentId is provided
    // For local data, initialize with empty array
    initialData: isLocal ? [] : undefined,
  })
}

/**
 * Hook to create a new cargo item
 *
 * Automatically invalidates the parent's cargo cache on success.
 *
 * @returns Mutation object with mutate/mutateAsync functions
 *
 * @example
 * ```tsx
 * const createCargoItem = useCreateCargo()
 *
 * // Schema-based cargo
 * await createCargoItem.mutate({
 *   mech_id: mechId,
 *   schema_name: 'equipment',
 *   schema_ref_id: 'pistol',
 * })
 *
 * // Custom cargo
 * await createCargoItem.mutate({
 *   mech_id: mechId,
 *   name: 'Spare Parts',
 *   amount: 5,
 * })
 * ```
 */
export function useCreateCargo() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: TablesInsert<'cargo'>) => {
      // Determine parent type and ID
      const parentType = data.mech_id ? 'mech' : 'crawler'
      const parentId = data.mech_id || data.crawler_id

      if (!parentId) {
        throw new Error('Parent ID is required')
      }

      // Cache-only mode: Add to cache without API call
      if (isLocalId(parentId)) {
        const localCargo: HydratedCargo = {
          id: generateLocalId(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          mech_id: data.mech_id || null,
          crawler_id: data.crawler_id || null,
          name: data.name || '',
          amount: data.amount || null,
          schema_name: data.schema_name || null,
          schema_ref_id: data.schema_ref_id || null,
          metadata: data.metadata || null,
        }

        // Add to cache
        const queryKey = [...cargoKeys.forParent(parentType, parentId)]
        addToCache(queryClient, queryKey, localCargo)

        return localCargo
      }

      // API-backed mode: Create in Supabase
      return createCargo(data)
    },
    // Optimistic update for API-backed mode
    onMutate: async (data) => {
      const parentType = data.mech_id ? 'mech' : 'crawler'
      const parentId = data.mech_id || data.crawler_id

      if (!parentId || isLocalId(parentId)) return

      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: cargoKeys.forParent(parentType, parentId) })

      // Snapshot previous value
      const previousCargo = queryClient.getQueryData(cargoKeys.forParent(parentType, parentId))

      // Optimistically update cache
      const optimisticCargo: HydratedCargo = {
        id: generateLocalId(), // Temporary ID
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        mech_id: data.mech_id || null,
        crawler_id: data.crawler_id || null,
        name: data.name || '',
        amount: data.amount || null,
        schema_name: data.schema_name || null,
        schema_ref_id: data.schema_ref_id || null,
        metadata: data.metadata || null,
      }

      const queryKey = [...cargoKeys.forParent(parentType, parentId)]
      addToCache(queryClient, queryKey, optimisticCargo)

      return { previousCargo, parentType, parentId }
    },
    // Rollback on error
    onError: (_err, _data, context) => {
      if (context) {
        queryClient.setQueryData(
          cargoKeys.forParent(context.parentType as 'mech' | 'crawler', context.parentId),
          context.previousCargo
        )
      }
    },
    // Refetch on success
    onSuccess: (newCargo) => {
      const parentType = newCargo.mech_id ? 'mech' : 'crawler'
      const parentId = newCargo.mech_id || newCargo.crawler_id

      if (!parentId) return

      // Invalidate parent's cargo cache to trigger refetch
      queryClient.invalidateQueries({
        queryKey: cargoKeys.forParent(parentType, parentId),
      })
    },
  })
}

/**
 * Hook to update a cargo item
 *
 * Automatically invalidates the parent's cargo cache on success.
 *
 * @returns Mutation object with mutate/mutateAsync functions
 *
 * @example
 * ```tsx
 * const updateCargoItem = useUpdateCargo()
 *
 * await updateCargoItem.mutate({
 *   id: cargoId,
 *   updates: { amount: 10, name: 'Updated Name' },
 * })
 * ```
 */
export function useUpdateCargo() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: TablesUpdate<'cargo'> }) =>
      updateCargo(id, updates),
    onSuccess: (updatedCargo) => {
      // Determine parent type and ID
      const parentType = updatedCargo.mech_id ? 'mech' : 'crawler'
      const parentId = updatedCargo.mech_id || updatedCargo.crawler_id

      if (!parentId) return

      // Invalidate parent's cargo cache to trigger refetch
      queryClient.invalidateQueries({
        queryKey: cargoKeys.forParent(parentType, parentId),
      })
    },
  })
}

/**
 * Hook to delete a cargo item
 *
 * Automatically invalidates the parent's cargo cache on success.
 *
 * @returns Mutation object with mutate/mutateAsync functions
 *
 * @example
 * ```tsx
 * const deleteCargoItem = useDeleteCargo()
 *
 * await deleteCargoItem.mutate({
 *   id: cargoId,
 *   parentType: 'mech',
 *   parentId: mechId,
 * })
 * ```
 */
export function useDeleteCargo() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id }: { id: string; parentType: string; parentId: string }) => deleteCargo(id),
    onSuccess: (_, variables) => {
      // Invalidate parent's cargo cache to trigger refetch
      queryClient.invalidateQueries({
        queryKey: cargoKeys.forParent(
          variables.parentType as 'mech' | 'crawler',
          variables.parentId
        ),
      })
    },
  })
}
