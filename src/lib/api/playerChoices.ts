/**
 * Player Choice API - CRUD operations for player choices
 *
 * Player choices are associated with entities OR other player choices (nested).
 * This supports chains like: Ability → System choice → Module choice
 */

import { supabase } from '../supabase'
import type { Tables, TablesInsert } from '../../types/database-generated.types'
import { upsertPlayerChoiceSchema } from '../validation/playerChoice'

/**
 * Fetch all choices for an entity
 *
 * @param entityId - Entity ID
 * @returns Array of player choices
 * @throws Error if database query fails
 */
export async function fetchChoicesForEntity(entityId: string): Promise<Tables<'player_choices'>[]> {
  const { data, error } = await supabase
    .from('player_choices')
    .select('*')
    .eq('entity_id', entityId)
    .order('created_at', { ascending: true })

  if (error) {
    throw new Error(`Failed to fetch player choices: ${error.message}`)
  }

  return data || []
}

/**
 * Fetch all nested choices for a player choice
 *
 * @param choiceId - Player choice ID
 * @returns Array of nested player choices
 * @throws Error if database query fails
 */
export async function fetchChoicesForChoice(choiceId: string): Promise<Tables<'player_choices'>[]> {
  const { data, error } = await supabase
    .from('player_choices')
    .select('*')
    .eq('player_choice_id', choiceId)
    .order('created_at', { ascending: true })

  if (error) {
    throw new Error(`Failed to fetch nested choices: ${error.message}`)
  }

  return data || []
}

/**
 * Create or update a player choice (upsert)
 *
 * Uses unique constraint on (entity_id, choice_ref_id) to handle upserts.
 *
 * @param data - Player choice data
 * @returns Created or updated player choice
 * @throws Error if validation fails or database operation fails
 */
export async function upsertPlayerChoice(
  data: TablesInsert<'player_choices'>
): Promise<Tables<'player_choices'>> {
  // Validate input
  const validated = upsertPlayerChoiceSchema.parse(data)

  // Upsert player choice
  const { data: choice, error } = await supabase
    .from('player_choices')
    .upsert(validated, {
      onConflict: 'entity_id,choice_ref_id',
    })
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to upsert player choice: ${error.message}`)
  }

  return choice
}

/**
 * Delete a player choice
 *
 * @param id - Player choice ID
 * @throws Error if database delete fails
 */
export async function deletePlayerChoice(id: string): Promise<void> {
  const { error } = await supabase.from('player_choices').delete().eq('id', id)

  if (error) {
    throw new Error(`Failed to delete player choice: ${error.message}`)
  }
}

/**
 * Delete all choices for an entity
 *
 * Useful when removing an entity or resetting choices.
 * Cascade delete will automatically remove nested choices.
 *
 * @param entityId - Entity ID
 * @throws Error if database delete fails
 */
export async function deleteChoicesForEntity(entityId: string): Promise<void> {
  const { error } = await supabase.from('player_choices').delete().eq('entity_id', entityId)

  if (error) {
    throw new Error(`Failed to delete player choices: ${error.message}`)
  }
}

/**
 * Delete all nested choices for a player choice
 *
 * Useful when changing a choice value that had nested choices.
 * Cascade delete will automatically remove deeply nested choices.
 *
 * @param choiceId - Player choice ID
 * @throws Error if database delete fails
 */
export async function deleteChoicesForChoice(choiceId: string): Promise<void> {
  const { error } = await supabase.from('player_choices').delete().eq('player_choice_id', choiceId)

  if (error) {
    throw new Error(`Failed to delete nested choices: ${error.message}`)
  }
}
