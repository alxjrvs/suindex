import { useCallback } from 'react'
import { useUpsertPlayerChoice, useDeletePlayerChoice, playerChoicesKeys } from './usePlayerChoices'
import type { Tables } from '../../types/database-generated.types'
import { useQueryClient } from '@tanstack/react-query'

/**
 * Hook to manage player choices for an entity with a simplified interface
 *
 * Provides a single callback that handles both creating and deleting choices:
 * - When value is provided: creates/updates the choice (upsert)
 * - When value is undefined: deletes the choice
 *
 * @param entityId - ID of the entity that owns the choices
 * @returns Callback function to update choices
 *
 * @example
 * ```tsx
 * const handleUpdateChoice = useManageEntityChoices(entityId)
 *
 * // Create/update a choice
 * handleUpdateChoice('weapon-choice', 'systems::laser-rifle')
 *
 * // Delete a choice
 * handleUpdateChoice('weapon-choice', undefined)
 * ```
 */
export function useManageEntityChoices(entityId: string | undefined) {
  const queryClient = useQueryClient()
  const upsertChoice = useUpsertPlayerChoice()
  const deleteChoice = useDeletePlayerChoice()

  return useCallback(
    (choiceRefId: string, value: string | undefined) => {
      if (!entityId) return

      if (value === undefined) {
        const choices = queryClient.getQueryData<Tables<'player_choices'>[]>(
          playerChoicesKeys.forEntity(entityId)
        )
        const existingChoice = choices?.find((c) => c.choice_ref_id === choiceRefId)

        if (existingChoice) {
          deleteChoice.mutate({ id: existingChoice.id, entityId })
        }
      } else {
        upsertChoice.mutate({
          entity_id: entityId,
          choice_ref_id: choiceRefId,
          value,
        })
      }
    },
    [entityId, queryClient, upsertChoice, deleteChoice]
  )
}
