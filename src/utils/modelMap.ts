import { SalvageUnionReference } from 'salvageunion-reference'

export const modelMap = {
  abilities: SalvageUnionReference.Abilities,
  'ability-tree-requirements': SalvageUnionReference.AbilityTreeRequirements,
  'bio-titans': SalvageUnionReference.BioTitans,
  chassis: SalvageUnionReference.Chassis,
  'classes-core': SalvageUnionReference.CoreClasses,
  'classes-advanced': SalvageUnionReference.AdvancedClasses,
  'classes-hybrid': SalvageUnionReference.AdvancedClasses, // Now merged into AdvancedClasses
  // Support dot notation for classes (used in schema catalog)
  'classes.core': SalvageUnionReference.CoreClasses,
  'classes.advanced': SalvageUnionReference.AdvancedClasses,
  'classes.hybrid': SalvageUnionReference.AdvancedClasses, // Now merged into AdvancedClasses
  crawlers: SalvageUnionReference.Crawlers,
  'crawler-bays': SalvageUnionReference.CrawlerBays,
  'crawler-tech-levels': SalvageUnionReference.CrawlerTechLevels,
  creatures: SalvageUnionReference.Creatures,
  drones: SalvageUnionReference.Drones,
  equipment: SalvageUnionReference.Equipment,
  keywords: SalvageUnionReference.Keywords,
  meld: SalvageUnionReference.Meld,
  modules: SalvageUnionReference.Modules,
  npcs: SalvageUnionReference.NPCs,
  squads: SalvageUnionReference.Squads,
  systems: SalvageUnionReference.Systems,
  'roll-tables': SalvageUnionReference.RollTables,
  traits: SalvageUnionReference.Traits,
  vehicles: SalvageUnionReference.Vehicles,
} as const

export type SchemaId = keyof typeof modelMap

export function getModel(schemaId: string): (typeof modelMap)[SchemaId] | undefined {
  if (schemaId in modelMap) {
    const model = modelMap[schemaId as SchemaId]
    return model
  }
  return undefined
}
