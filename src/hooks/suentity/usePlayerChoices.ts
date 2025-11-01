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
import type { Tables, TablesInsert } from '../../types/database-generated.types'
import {
  fetchChoicesForEntity,
  fetchChoicesForChoice,
  upsertPlayerChoice,
  deletePlayerChoice,
  deleteChoicesForEntity,
  deleteChoicesForChoice,
} from '../../lib/api/playerChoices'
import { entitiesKeys } from './useSUEntities'
import { isLocalId, generateLocalId } from '../../lib/cacheHelpers'

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
 * For local entities (with local IDs), returns empty array and relies on cache.
 * For API-backed entities, fetches from Supabase.
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
  const isLocal = entityId ? isLocalId(entityId) : false

  return useQuery({
    queryKey: playerChoicesKeys.forEntity(entityId!),
    queryFn: () => fetchChoicesForEntity(entityId!),
    enabled: !!entityId && !isLocal, // Only run query if entityId is provided AND not local
    // For local data, initialize with empty array
    initialData: isLocal ? [] : undefined,
  })
}

/**
 * Hook to fetch nested choices for a player choice
 *
 * For local choices (with local IDs), returns empty array and relies on cache.
 * For API-backed choices, fetches from Supabase.
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
  const isLocal = choiceId ? isLocalId(choiceId) : false

  return useQuery({
    queryKey: playerChoicesKeys.forChoice(choiceId!),
    queryFn: () => fetchChoicesForChoice(choiceId!),
    enabled: !!choiceId && !isLocal, // Only run query if choiceId is provided AND not local
    // For local data, initialize with empty array
    initialData: isLocal ? [] : undefined,
  })
}

/**
 * Hook to upsert a player choice
 *
 * Supports both API-backed and cache-only (local) data:
 * - API-backed: Upserts in Supabase
 * - Cache-only: Upserts in cache only
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
    mutationFn: async (data: TablesInsert<'player_choices'>) => {
      const entityId = data.entity_id
      const choiceId = (data as { player_choice_id?: string }).player_choice_id

      // Cache-only mode: Update cache without API call
      if ((entityId && isLocalId(entityId)) || (choiceId && isLocalId(choiceId))) {
        const queryKey = entityId
          ? playerChoicesKeys.forEntity(entityId)
          : playerChoicesKeys.forChoice(choiceId!)

        const currentChoices = queryClient.getQueryData<Tables<'player_choices'>[]>(queryKey) || []

        // Find existing choice with same choice_ref_id
        const existingIndex = currentChoices.findIndex(
          (c) => c.choice_ref_id === data.choice_ref_id
        )

        const now = new Date().toISOString()
        const upsertedChoice: Tables<'player_choices'> = {
          id: existingIndex >= 0 ? currentChoices[existingIndex].id : generateLocalId(),
          created_at: existingIndex >= 0 ? currentChoices[existingIndex].created_at : now,
          updated_at: now,
          entity_id: data.entity_id || null,
          player_choice_id: (data as { player_choice_id?: string }).player_choice_id || null,
          choice_ref_id: data.choice_ref_id!,
          value: data.value!,
        }

        // Update cache
        const updatedChoices =
          existingIndex >= 0
            ? currentChoices.map((c, i) => (i === existingIndex ? upsertedChoice : c))
            : [...currentChoices, upsertedChoice]

        queryClient.setQueryData(queryKey, updatedChoices)

        return upsertedChoice
      }

      // API-backed mode: Upsert in Supabase
      return upsertPlayerChoice(data)
    },
    onSuccess: (choice) => {
      const entityId = choice.entity_id
      const choiceId = (choice as { player_choice_id?: string }).player_choice_id

      // Don't invalidate for local IDs - cache is already updated
      if ((entityId && isLocalId(entityId)) || (choiceId && isLocalId(choiceId))) {
        return
      }

      // Invalidate choice cache for parent (entity or choice)
      if (entityId) {
        queryClient.invalidateQueries({
          queryKey: playerChoicesKeys.forEntity(entityId),
        })
      }
      if (choiceId) {
        queryClient.invalidateQueries({
          queryKey: playerChoicesKeys.forChoice(choiceId),
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
 * Supports both API-backed and cache-only (local) data:
 * - API-backed: Deletes from Supabase
 * - Cache-only: Removes from cache only
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
    mutationFn: async ({
      id,
      entityId,
      choiceId,
    }: {
      id: string
      entityId?: string
      choiceId?: string
    }) => {
      // Cache-only mode: Remove from cache
      if ((entityId && isLocalId(entityId)) || (choiceId && isLocalId(choiceId)) || isLocalId(id)) {
        const queryKey = entityId
          ? playerChoicesKeys.forEntity(entityId)
          : choiceId
            ? playerChoicesKeys.forChoice(choiceId)
            : null

        if (queryKey) {
          const currentChoices = queryClient.getQueryData<Tables<'player_choices'>[]>(queryKey)
          if (currentChoices) {
            const updatedChoices = currentChoices.filter((c) => c.id !== id)
            queryClient.setQueryData(queryKey, updatedChoices)
          }
        }

        return
      }

      // API-backed mode: Delete from Supabase
      return deletePlayerChoice(id)
    },
    onSuccess: (_, variables) => {
      // Don't invalidate for local IDs - cache is already updated
      if (
        (variables.entityId && isLocalId(variables.entityId)) ||
        (variables.choiceId && isLocalId(variables.choiceId)) ||
        isLocalId(variables.id)
      ) {
        return
      }

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
