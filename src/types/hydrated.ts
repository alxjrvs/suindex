/**
 * Hydrated entity types
 *
 * These types extend database rows with reference data from salvageunion-reference.
 * This allows direct access to entity properties without manual lookups.
 *
 * Example:
 *   entity.ref.name // Direct access to ability/equipment/system name
 *   entity.ref.description // Direct access to description
 */

import type { Tables } from './database-generated.types'
import type { SURefEntity } from 'salvageunion-reference'

/**
 * Entity with hydrated reference data and associated choices
 */
export type HydratedEntity = Tables<'suentities'> & {
  /**
   * Reference data from salvageunion-reference
   * Populated via SalvageUnionReference.get(schema_name, schema_ref_id)
   */
  ref: SURefEntity

  /**
   * Player choices associated with this entity
   * Populated from player_choices table
   */
  choices: Tables<'player_choices'>[]
}

/**
 * Cargo with optional hydrated reference data
 *
 * Cargo can be:
 * 1. Schema-based (has schema_name/schema_ref_id) - ref is populated
 * 2. Custom (no schema reference) - ref is undefined
 */
export type HydratedCargo = Tables<'cargo'> & {
  /**
   * Reference data from salvageunion-reference (if schema-based)
   * Populated via SalvageUnionReference.get(schema_name, schema_ref_id)
   * undefined for custom cargo items
   */
  ref?: SURefEntity

  /**
   * Position in cargo grid (extracted from metadata)
   * Used to preserve visual placement across renders
   */
  position?: { row: number; col: number }
}
