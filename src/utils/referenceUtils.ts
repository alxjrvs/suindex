import { SalvageUnionReference } from 'salvageunion-reference'
import type { SURefEntity, SURefSchemaName } from 'salvageunion-reference'

/**
 * Compose a reference string from schema name and entity ID
 * Format: `{schemaName}||{entityId}`
 */
export function composeReference(schemaName: SURefSchemaName, entityId: string): string {
  return `${schemaName}||${entityId}`
}

/**
 * Decompose a reference string into schema name and entity ID
 * Returns null if the reference is invalid
 */
export function decomposeReference(
  ref: string
): { schemaName: SURefSchemaName; entityId: string } | null {
  const parts = ref.split('||')
  if (parts.length !== 2) return null
  const [schemaName, entityId] = parts
  return { schemaName: schemaName as SURefSchemaName, entityId }
}

/**
 * Look up an entity by reference string
 * Returns the entity if found, null otherwise
 */
export function lookupEntityByRef(ref: string): SURefEntity | null {
  const decomposed = decomposeReference(ref)
  if (!decomposed) return null

  try {
    const entity = SalvageUnionReference.findIn(
      decomposed.schemaName,
      (e) => 'id' in e && e.id === decomposed.entityId
    )
    return entity || null
  } catch {
    return null
  }
}

/**
 * Get the name of an entity by reference string
 * Returns the entity name if found, null otherwise
 */
export function getEntityNameByRef(ref: string): string | null {
  const entity = lookupEntityByRef(ref)
  if (!entity || !('name' in entity)) return null
  return entity.name as string
}

/**
 * Get the salvage value of an entity by reference string
 * Returns the salvage value if found, 0 otherwise
 */
export function getSalvageValueByRef(ref: string): number {
  const entity = lookupEntityByRef(ref)
  if (!entity || !('salvageValue' in entity)) return 0
  return entity.salvageValue as number
}
