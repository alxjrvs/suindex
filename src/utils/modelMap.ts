import { SalvageUnionReference } from 'salvageunion-reference'

/**
 * Mapping of schema IDs to their corresponding data models
 * This is the single source of truth for all available schemas
 */
export const modelMap = {
  abilities: SalvageUnionReference.Abilities,
  'ability-tree-requirements': SalvageUnionReference.AbilityTreeRequirements,
  'bio-titans': SalvageUnionReference.BioTitans,
  chassis: SalvageUnionReference.Chassis,
  classes: SalvageUnionReference.Classes,
  crawlers: SalvageUnionReference.Crawlers,
  creatures: SalvageUnionReference.Creatures,
  drones: SalvageUnionReference.Drones,
  equipment: SalvageUnionReference.Equipment,
  keywords: SalvageUnionReference.Keywords,
  meld: SalvageUnionReference.Meld,
  modules: SalvageUnionReference.Modules,
  npcs: SalvageUnionReference.NPCs,
  squads: SalvageUnionReference.Squads,
  systems: SalvageUnionReference.Systems,
  tables: SalvageUnionReference.Tables,
  traits: SalvageUnionReference.Traits,
  vehicles: SalvageUnionReference.Vehicles,
} as const

/**
 * Type-safe schema ID type derived from modelMap keys
 * Use this for type-safe schema ID parameters
 */
export type SchemaId = keyof typeof modelMap

/**
 * Get a model by schema ID with type safety
 * @param schemaId - The schema ID to look up
 * @returns The model object or undefined if not found
 */
export function getModel(schemaId: string): (typeof modelMap)[SchemaId] | undefined {
  if (schemaId in modelMap) {
    return modelMap[schemaId as SchemaId]
  }
  return undefined
}

/**
 * Check if a schema ID is valid
 * @param schemaId - The schema ID to validate
 * @returns True if the schema ID exists in the model map
 */
export function isValidSchemaId(schemaId: string): schemaId is SchemaId {
  return schemaId in modelMap
}

/**
 * Get all available schema IDs
 * @returns Array of all valid schema IDs
 */
export function getAllSchemaIds(): SchemaId[] {
  return Object.keys(modelMap) as SchemaId[]
}
