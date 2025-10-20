import { SalvageUnionReference } from 'salvageunion-reference'

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

export type SchemaId = keyof typeof modelMap

export function getModel(schemaId: string): (typeof modelMap)[SchemaId] | undefined {
  if (schemaId in modelMap) {
    return modelMap[schemaId as SchemaId]
  }
  return undefined
}

export function isValidSchemaId(schemaId: string): schemaId is SchemaId {
  return schemaId in modelMap
}

export function getAllSchemaIds(): SchemaId[] {
  return Object.keys(modelMap) as SchemaId[]
}
