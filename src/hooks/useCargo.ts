/**
 * TanStack Query hooks for cargo management
 *
 * Provides hooks for fetching and mutating cargo with:
 * - Automatic caching and background refetching
 * - Optimistic updates for better UX
 * - Cache invalidation on mutations
 * - Loading and error states
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { TablesInsert, TablesUpdate } from '../types/database-generated.types'
import { fetchCargoForParent, createCargo, updateCargo, deleteCargo } from '../lib/api/cargo'

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
 * @param parentType - Type of parent entity
 * @param parentId - ID of parent entity
 * @returns Query result with hydrated cargo
 *
 * @example
 * ```tsx
 * const { data: cargo, isLoading } = useCargo('mech', mechId)
 * const schemaBased = cargo?.filter(c => c.ref)
 * const custom = cargo?.filter(c => !c.ref)
 * ```
 */
export function useCargo(parentType: 'mech' | 'crawler', parentId: string | undefined) {
  return useQuery({
    queryKey: cargoKeys.forParent(parentType, parentId!),
    queryFn: () => fetchCargoForParent(parentType, parentId!),
    enabled: !!parentId, // Only run query if parentId is provided
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
 * await createCargoItem.mutateAsync({
 *   mech_id: mechId,
 *   schema_name: 'equipment',
 *   schema_ref_id: 'pistol',
 * })
 *
 * // Custom cargo
 * await createCargoItem.mutateAsync({
 *   mech_id: mechId,
 *   name: 'Spare Parts',
 *   amount: 5,
 * })
 * ```
 */
export function useCreateCargo() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: TablesInsert<'cargo'>) => createCargo(data),
    onSuccess: (newCargo) => {
      // Determine parent type and ID
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
 * await updateCargoItem.mutateAsync({
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
 * await deleteCargoItem.mutateAsync({
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
