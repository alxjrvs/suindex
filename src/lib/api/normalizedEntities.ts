/**
 * Normalized Entity API - CRUD operations for the suentities table with hydration
 *
 * This is the new API for the normalized entity system (Phase 2 of migration).
 * All functions validate input with Zod schemas and return hydrated entities.
 *
 * Note: This is separate from the legacy entities.ts which handles generic table operations.
 */

import { supabase } from '../supabase'
import type { Tables, TablesInsert, TablesUpdate } from '../../types/database-generated.types'
import type { HydratedEntity } from '../../types/hydrated'
import { hydrateEntity, hydrateEntities } from './hydration'
import { createEntitySchema, updateEntitySchema } from '../validation/entity'

/**
 * Fetch all entities for a parent (pilot, mech, or crawler)
 *
 * @param parentType - Type of parent entity
 * @param parentId - ID of parent entity
 * @returns Array of hydrated entities with choices
 * @throws Error if database query fails
 */
export async function fetchEntitiesForParent(
  parentType: 'pilot' | 'mech' | 'crawler',
  parentId: string
): Promise<HydratedEntity[]> {
  // Build query based on parent type
  const column = `${parentType}_id` as const

  // Fetch entities from suentities table
  const { data: entities, error: entitiesError } = await supabase
    .from('suentities')
    .select('*')
    .eq(column, parentId)
    .order('created_at', { ascending: true })

  if (entitiesError) {
    throw new Error(`Failed to fetch entities: ${entitiesError.message}`)
  }

  if (!entities || entities.length === 0) {
    return []
  }

  // Fetch all player choices for these entities
  const entityIds = entities.map((e) => e.id)
  const { data: choices, error: choicesError } = await supabase
    .from('player_choices')
    .select('*')
    .in('entity_id', entityIds)

  if (choicesError) {
    throw new Error(`Failed to fetch player choices: ${choicesError.message}`)
  }

  // Group choices by entity ID (skip nested choices that don't have entity_id)
  const choicesByEntityId = new Map<string, Tables<'player_choices'>[]>()
  for (const choice of choices || []) {
    if (choice.entity_id) {
      // Only include choices directly on entities (not nested choices)
      const existing = choicesByEntityId.get(choice.entity_id) || []
      choicesByEntityId.set(choice.entity_id, [...existing, choice])
    }
  }

  // Hydrate entities with reference data and choices
  return hydrateEntities(entities, choicesByEntityId)
}

/**
 * Create a new entity
 *
 * @param data - Entity data to insert
 * @returns Hydrated entity
 * @throws Error if validation fails or database insert fails
 */
export async function createNormalizedEntity(
  data: TablesInsert<'suentities'>
): Promise<HydratedEntity> {
  // Validate input
  const validated = createEntitySchema.parse(data)

  // Insert entity into suentities table
  const { data: entity, error } = await supabase
    .from('suentities')
    .insert(validated)
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to create entity: ${error.message}`)
  }

  // Hydrate and return (no choices yet)
  return hydrateEntity(entity, [])
}

/**
 * Update entity metadata
 *
 * Note: Only metadata can be updated. Schema reference and parent are immutable.
 *
 * @param id - Entity ID
 * @param updates - Partial entity updates
 * @returns Updated hydrated entity
 * @throws Error if validation fails or database update fails
 */
export async function updateNormalizedEntity(
  id: string,
  updates: TablesUpdate<'suentities'>
): Promise<HydratedEntity> {
  // Validate input
  const validated = updateEntitySchema.parse(updates)

  // Update entity in suentities table
  const { data: entity, error: updateError } = await supabase
    .from('suentities')
    .update(validated)
    .eq('id', id)
    .select()
    .single()

  if (updateError) {
    throw new Error(`Failed to update entity: ${updateError.message}`)
  }

  // Fetch associated choices
  const { data: choices, error: choicesError } = await supabase
    .from('player_choices')
    .select('*')
    .eq('entity_id', id)

  if (choicesError) {
    throw new Error(`Failed to fetch player choices: ${choicesError.message}`)
  }

  // Hydrate and return
  return hydrateEntity(entity, choices || [])
}

/**
 * Delete an entity
 *
 * Note: Cascade delete will automatically remove associated player_choices.
 *
 * @param id - Entity ID
 * @throws Error if database delete fails
 */
export async function deleteNormalizedEntity(id: string): Promise<void> {
  const { error } = await supabase.from('suentities').delete().eq('id', id)

  if (error) {
    throw new Error(`Failed to delete entity: ${error.message}`)
  }
}
