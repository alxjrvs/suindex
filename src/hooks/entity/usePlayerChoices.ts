/**
 * TanStack Query hooks for player choice management
 *
 * Provides hooks for fetching and mutating player choices with:
 * - Automatic caching and background refetching
 * - Optimistic updates for better UX
 * - Cache invalidation on mutations
 * - Loading and error states
 *
 * NESTED CHOICES:
 * - Supports choices that belong to entities OR other choices
 * - Use usePlayerChoices(entityId) for entity choices
 * - Use useNestedChoices(choiceId) for nested choices
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { TablesInsert } from '../../types/database-generated.types'
import {
  fetchChoicesForEntity,
  fetchChoicesForChoice,
  upsertPlayerChoice,
  deletePlayerChoice,
  deleteChoicesForEntity,
  deleteChoicesForChoice,
} from '../../lib/api/playerChoices'
import { entitiesKeys } from './useEntities'

/**
 * Query key factory for player choices
 * Ensures consistent cache keys across the app
 */
export const playerChoicesKeys = {
  all: ['player_choices'] as const,
  forEntity: (entityId: string) => [...playerChoicesKeys.all, 'entity', entityId] as const,
  forChoice: (choiceId: string) => [...playerChoicesKeys.all, 'choice', choiceId] as const,
}

/**
 * Hook to fetch player choices for an entity
 *
 * @param entityId - ID of entity
 * @returns Query result with player choices
 *
 * @example
 * ```tsx
 * const { data: choices, isLoading } = usePlayerChoices(entityId)
 * const weaponChoice = choices?.find(c => c.choice_ref_id === 'weapon')
 * ```
 */
export function usePlayerChoices(entityId: string | undefined) {
  return useQuery({
    queryKey: playerChoicesKeys.forEntity(entityId!),
    queryFn: () => fetchChoicesForEntity(entityId!),
    enabled: !!entityId, // Only run query if entityId is provided
  })
}

/**
 * Hook to fetch nested choices for a player choice
 *
 * @param choiceId - ID of parent choice
 * @returns Query result with nested player choices
 *
 * @example
 * ```tsx
 * const { data: nestedChoices, isLoading } = useNestedChoices(choiceId)
 * ```
 */
export function useNestedChoices(choiceId: string | undefined) {
  return useQuery({
    queryKey: playerChoicesKeys.forChoice(choiceId!),
    queryFn: () => fetchChoicesForChoice(choiceId!),
    enabled: !!choiceId, // Only run query if choiceId is provided
  })
}

/**
 * Hook to upsert a player choice
 *
 * Automatically invalidates the appropriate choice cache on success.
 * Also invalidates the parent's entity cache to update the hydrated entity.
 *
 * @returns Mutation object with mutate/mutateAsync functions
 *
 * @example
 * ```tsx
 * const upsertChoice = useUpsertPlayerChoice()
 *
 * // Entity choice
 * await upsertChoice.mutate({
 *   entity_id: entityId,
 *   choice_ref_id: 'weapon',
 *   value: 'systems::laser-rifle',
 * })
 *
 * // Nested choice
 * await upsertChoice.mutate({
 *   player_choice_id: parentChoiceId,
 *   choice_ref_id: 'module',
 *   value: 'modules::targeting-computer',
 * })
 * ```
 */
export function useUpsertPlayerChoice() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: TablesInsert<'player_choices'>) => upsertPlayerChoice(data),
    onSuccess: (choice) => {
      // Invalidate choice cache for parent (entity or choice)
      if (choice.entity_id) {
        queryClient.invalidateQueries({
          queryKey: playerChoicesKeys.forEntity(choice.entity_id),
        })
      }
      if ((choice as { player_choice_id?: string }).player_choice_id) {
        queryClient.invalidateQueries({
          queryKey: playerChoicesKeys.forChoice(
            (choice as { player_choice_id: string }).player_choice_id
          ),
        })
      }

      // Invalidate all entity caches (since we don't know the root parent)
      // This ensures hydrated entities get updated choices
      queryClient.invalidateQueries({
        queryKey: entitiesKeys.all,
      })
    },
  })
}

/**
 * Hook to delete a player choice
 *
 * Automatically invalidates the appropriate choice cache on success.
 * Also invalidates the parent's entity cache to update the hydrated entity.
 * Cascade delete will automatically remove nested choices.
 *
 * @returns Mutation object with mutate/mutateAsync functions
 *
 * @example
 * ```tsx
 * const deleteChoice = useDeletePlayerChoice()
 *
 * deleteChoice.mutate({
 *   id: choiceId,
 *   entityId: entityId,  // For entity choices
 *   choiceId: parentChoiceId,  // For nested choices
 * })
 * ```
 */
export function useDeletePlayerChoice() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id }: { id: string; entityId?: string; choiceId?: string }) =>
      deletePlayerChoice(id),
    onSuccess: (_, variables) => {
      // Invalidate choice cache for parent (entity or choice)
      if (variables.entityId) {
        queryClient.invalidateQueries({
          queryKey: playerChoicesKeys.forEntity(variables.entityId),
        })
      }
      if (variables.choiceId) {
        queryClient.invalidateQueries({
          queryKey: playerChoicesKeys.forChoice(variables.choiceId),
        })
      }

      // Invalidate all entity caches (since we don't know the root parent)
      // This ensures hydrated entities get updated choices
      queryClient.invalidateQueries({
        queryKey: entitiesKeys.all,
      })
    },
  })
}

/**
 * Hook to delete all choices for an entity
 *
 * Automatically invalidates the entity's choice cache on success.
 * Also invalidates the parent's entity cache to update the hydrated entity.
 * Cascade delete will automatically remove nested choices.
 *
 * @returns Mutation object with mutate/mutateAsync functions
 *
 * @example
 * ```tsx
 * const deleteAllChoices = useDeleteChoicesForEntity()
 *
 * await deleteAllChoices.mutate({ entityId })
 * ```
 */
export function useDeleteChoicesForEntity() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ entityId }: { entityId: string }) => deleteChoicesForEntity(entityId),
    onSuccess: (_, variables) => {
      // Invalidate choice cache for this entity
      queryClient.invalidateQueries({
        queryKey: playerChoicesKeys.forEntity(variables.entityId),
      })

      // Invalidate all entity caches (since we don't know the parent)
      // This ensures hydrated entities get updated choices
      queryClient.invalidateQueries({
        queryKey: entitiesKeys.all,
      })
    },
  })
}

/**
 * Hook to delete all nested choices for a player choice
 *
 * Automatically invalidates the choice's cache on success.
 * Also invalidates the parent's entity cache to update the hydrated entity.
 * Cascade delete will automatically remove deeply nested choices.
 *
 * @returns Mutation object with mutate/mutateAsync functions
 *
 * @example
 * ```tsx
 * const deleteNestedChoices = useDeleteChoicesForChoice()
 *
 * await deleteNestedChoices.mutate({ choiceId })
 * ```
 */
export function useDeleteChoicesForChoice() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ choiceId }: { choiceId: string }) => deleteChoicesForChoice(choiceId),
    onSuccess: (_, variables) => {
      // Invalidate choice cache for this choice
      queryClient.invalidateQueries({
        queryKey: playerChoicesKeys.forChoice(variables.choiceId),
      })

      // Invalidate all entity caches (since we don't know the root parent)
      // This ensures hydrated entities get updated choices
      queryClient.invalidateQueries({
        queryKey: entitiesKeys.all,
      })
    },
  })
}
