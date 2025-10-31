/**
 * TanStack Query hooks for entity management
 *
 * Provides hooks for fetching and mutating entities with:
 * - Automatic caching and background refetching
 * - Optimistic updates for better UX
 * - Cache invalidation on mutations
 * - Loading and error states
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { TablesInsert, TablesUpdate } from '../types/database-generated.types'
import {
  fetchEntitiesForParent,
  createNormalizedEntity,
  updateNormalizedEntity,
  deleteNormalizedEntity,
} from '../lib/api/normalizedEntities'

/**
 * Query key factory for entities
 * Ensures consistent cache keys across the app
 */
export const entitiesKeys = {
  all: ['entities'] as const,
  forParent: (parentType: 'pilot' | 'mech' | 'crawler', parentId: string) =>
    [...entitiesKeys.all, parentType, parentId] as const,
}

/**
 * Hook to fetch entities for a parent (pilot, mech, or crawler)
 *
 * @param parentType - Type of parent entity
 * @param parentId - ID of parent entity
 * @returns Query result with hydrated entities
 *
 * @example
 * ```tsx
 * const { data: entities, isLoading } = useEntities('pilot', pilotId)
 * const abilities = entities?.filter(e => e.schema_name === 'abilities')
 * ```
 */
export function useEntities(
  parentType: 'pilot' | 'mech' | 'crawler',
  parentId: string | undefined
) {
  return useQuery({
    queryKey: entitiesKeys.forParent(parentType, parentId!),
    queryFn: () => fetchEntitiesForParent(parentType, parentId!),
    enabled: !!parentId, // Only run query if parentId is provided
  })
}

/**
 * Hook to create a new entity
 *
 * Automatically invalidates the parent's entity cache on success.
 *
 * @returns Mutation object with mutate/mutateAsync functions
 *
 * @example
 * ```tsx
 * const createEntity = useCreateEntity()
 *
 * await createEntity.mutateAsync({
 *   pilot_id: pilotId,
 *   schema_name: 'abilities',
 *   schema_ref_id: 'bionic-senses',
 * })
 * ```
 */
export function useCreateEntity() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: TablesInsert<'entities'>) => createNormalizedEntity(data),
    onSuccess: (newEntity) => {
      // Determine parent type and ID
      const parentType = newEntity.pilot_id ? 'pilot' : newEntity.mech_id ? 'mech' : 'crawler'
      const parentId = newEntity.pilot_id || newEntity.mech_id || newEntity.crawler_id

      if (!parentId) return

      // Invalidate parent's entity cache to trigger refetch
      queryClient.invalidateQueries({
        queryKey: entitiesKeys.forParent(parentType, parentId),
      })
    },
  })
}

/**
 * Hook to update an entity's metadata
 *
 * Automatically invalidates the parent's entity cache on success.
 *
 * @returns Mutation object with mutate/mutateAsync functions
 *
 * @example
 * ```tsx
 * const updateEntity = useUpdateEntity()
 *
 * await updateEntity.mutateAsync({
 *   id: entityId,
 *   updates: { metadata: { customName: 'My Custom Name' } },
 * })
 * ```
 */
export function useUpdateEntity() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: TablesUpdate<'entities'> }) =>
      updateNormalizedEntity(id, updates),
    onSuccess: (updatedEntity) => {
      // Determine parent type and ID
      const parentType = updatedEntity.pilot_id
        ? 'pilot'
        : updatedEntity.mech_id
          ? 'mech'
          : 'crawler'
      const parentId = updatedEntity.pilot_id || updatedEntity.mech_id || updatedEntity.crawler_id

      if (!parentId) return

      // Invalidate parent's entity cache to trigger refetch
      queryClient.invalidateQueries({
        queryKey: entitiesKeys.forParent(parentType, parentId),
      })
    },
  })
}

/**
 * Hook to delete an entity
 *
 * Automatically invalidates the parent's entity cache on success.
 * Cascade delete will automatically remove associated player_choices.
 *
 * @returns Mutation object with mutate/mutateAsync functions
 *
 * @example
 * ```tsx
 * const deleteEntity = useDeleteEntity()
 *
 * await deleteEntity.mutateAsync({
 *   id: entityId,
 *   parentType: 'pilot',
 *   parentId: pilotId,
 * })
 * ```
 */
export function useDeleteEntity() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id }: { id: string; parentType: string; parentId: string }) =>
      deleteNormalizedEntity(id),
    onSuccess: (_, variables) => {
      // Invalidate parent's entity cache to trigger refetch
      queryClient.invalidateQueries({
        queryKey: entitiesKeys.forParent(
          variables.parentType as 'pilot' | 'mech' | 'crawler',
          variables.parentId
        ),
      })
    },
  })
}
