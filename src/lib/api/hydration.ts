/**
 * Hydration functions for entities and cargo
 *
 * These functions enrich database rows with reference data from salvageunion-reference.
 * Uses the new v1.50 direct lookup methods (get, getMany) for efficient batch operations.
 */

import { SalvageUnionReference } from 'salvageunion-reference'
import type { SURefEntity, SURefSchemaName } from 'salvageunion-reference'
import type { Tables } from '../../types/database-generated.types'
import type { HydratedEntity, HydratedCargo } from '../../types/hydrated'

/**
 * Hydrate a single entity with reference data
 *
 * @param entity - Entity row from suentities table
 * @param choices - Associated player choices (optional, defaults to empty array)
 * @returns Hydrated entity with ref data
 * @throws Error if reference data not found
 */
export function hydrateEntity(
  entity: Tables<'suentities'>,
  choices: Tables<'player_choices'>[] = []
): HydratedEntity {
  const ref = SalvageUnionReference.get(entity.schema_name as SURefSchemaName, entity.schema_ref_id)

  if (!ref) {
    throw new Error(`Reference not found: ${entity.schema_name}/${entity.schema_ref_id}`)
  }

  return {
    ...entity,
    ref,
    choices,
  }
}

/**
 * Hydrate multiple entities with reference data (batch operation)
 *
 * Uses SalvageUnionReference.getMany() for efficient batch lookups.
 *
 * @param entities - Entity rows from suentities table
 * @param choicesByEntityId - Map of entity ID to player choices
 * @returns Array of hydrated entities
 * @throws Error if any reference data not found
 */
export function hydrateEntities(
  entities: Tables<'suentities'>[],
  choicesByEntityId: Map<string, Tables<'player_choices'>[]> = new Map()
): HydratedEntity[] {
  // Build requests array for getMany
  const requests = entities.map((entity) => ({
    schemaName: entity.schema_name as SURefSchemaName,
    id: entity.schema_ref_id,
  }))

  // Batch fetch all reference data
  const refs = SalvageUnionReference.getMany(requests)

  // Build map of refs by schema:id key
  const refsByKey = new Map<string, SURefEntity>()
  refs.forEach((ref, index) => {
    if (ref) {
      const request = requests[index]
      refsByKey.set(`${request.schemaName}:${request.id}`, ref)
    }
  })

  // Hydrate all entities
  return entities.map((entity) => {
    const key = `${entity.schema_name}:${entity.schema_ref_id}`
    const ref = refsByKey.get(key)

    if (!ref) {
      throw new Error(`Reference not found: ${entity.schema_name}/${entity.schema_ref_id}`)
    }

    const choices = choicesByEntityId.get(entity.id) || []

    return {
      ...entity,
      ref,
      choices,
    }
  })
}

/**
 * Extract position from cargo metadata
 *
 * @param metadata - JSONB metadata from database
 * @returns Position object or undefined
 */
function extractPosition(metadata: unknown): { row: number; col: number } | undefined {
  if (!metadata || typeof metadata !== 'object') {
    return undefined
  }

  const meta = metadata as Record<string, unknown>
  if (
    typeof meta.position === 'object' &&
    meta.position !== null &&
    'row' in meta.position &&
    'col' in meta.position &&
    typeof meta.position.row === 'number' &&
    typeof meta.position.col === 'number'
  ) {
    return { row: meta.position.row, col: meta.position.col }
  }

  return undefined
}

/**
 * Hydrate a single cargo item with optional reference data
 *
 * @param cargo - Cargo row from database
 * @returns Hydrated cargo with optional ref data and position
 */
export function hydrateCargo(cargo: Tables<'cargo'>): HydratedCargo {
  // Extract position from metadata
  const position = extractPosition(cargo.metadata)

  // If cargo has schema reference, hydrate it
  if (cargo.schema_name && cargo.schema_ref_id) {
    const ref = SalvageUnionReference.get(cargo.schema_name as SURefSchemaName, cargo.schema_ref_id)

    if (!ref) {
      throw new Error(`Reference not found for cargo: ${cargo.schema_name}/${cargo.schema_ref_id}`)
    }

    return {
      ...cargo,
      ref,
      position,
    }
  }

  // Custom cargo - no reference data
  return {
    ...cargo,
    ref: undefined,
    position,
  }
}

/**
 * Hydrate multiple cargo items with optional reference data (batch operation)
 *
 * @param cargoItems - Cargo rows from database
 * @returns Array of hydrated cargo items
 */
export function hydrateCargoItems(cargoItems: Tables<'cargo'>[]): HydratedCargo[] {
  // Separate schema-based and custom cargo
  const schemaBased = cargoItems.filter((c) => c.schema_name && c.schema_ref_id)
  const custom = cargoItems.filter((c) => !c.schema_name || !c.schema_ref_id)

  // Build requests array for getMany
  const requests = schemaBased.map((cargo) => ({
    schemaName: cargo.schema_name as SURefSchemaName,
    id: cargo.schema_ref_id!,
  }))

  // Batch fetch all reference data
  const refs = SalvageUnionReference.getMany(requests)

  // Build map of refs by schema:id key
  const refsByKey = new Map<string, SURefEntity>()
  refs.forEach((ref, index) => {
    if (ref) {
      const request = requests[index]
      refsByKey.set(`${request.schemaName}:${request.id}`, ref)
    }
  })

  // Hydrate schema-based cargo
  const hydratedSchemaBased: HydratedCargo[] = schemaBased.map((cargo) => {
    const key = `${cargo.schema_name}:${cargo.schema_ref_id}`
    const ref = refsByKey.get(key)

    if (!ref) {
      throw new Error(`Reference not found for cargo: ${cargo.schema_name}/${cargo.schema_ref_id}`)
    }

    return {
      ...cargo,
      ref,
      position: extractPosition(cargo.metadata),
    }
  })

  // Hydrate custom cargo (no ref)
  const hydratedCustom: HydratedCargo[] = custom.map((cargo) => ({
    ...cargo,
    ref: undefined,
    position: extractPosition(cargo.metadata),
  }))

  // Combine and return in original order
  const result: HydratedCargo[] = []
  for (const cargo of cargoItems) {
    const hydrated =
      hydratedSchemaBased.find((h) => h.id === cargo.id) ||
      hydratedCustom.find((h) => h.id === cargo.id)

    if (hydrated) {
      result.push(hydrated)
    }
  }

  return result
}
