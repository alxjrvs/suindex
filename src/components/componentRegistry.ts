import type { ComponentType } from 'react'
import { lazy } from 'react'
import { createEntityDisplay } from './schema/entities/createEntityDisplay'
import type { SURefEntity } from 'salvageunion-reference'

type DisplayComponentType = ComponentType<{ data: SURefEntity }>

// Complex components with custom logic/children - keep as separate files
const AbilityDisplay = lazy(() =>
  import('./schema/entities/AbilityDisplay').then((m) => ({ default: m.AbilityDisplay }))
)
const AbilityTreeRequirementDisplay = lazy(() =>
  import('./schema/entities/AbilityTreeRequirementDisplay').then((m) => ({
    default: m.AbilityTreeRequirementDisplay,
  }))
)
const ChassisDisplay = lazy(() =>
  import('./schema/entities/ChassisDisplay').then((m) => ({ default: m.ChassisDisplay }))
)
const ClassDisplay = lazy(() =>
  import('./schema/entities/ClassDisplay').then((m) => ({ default: m.ClassDisplay }))
)
const CrawlerBayDisplay = lazy(() =>
  import('./schema/entities/CrawlerBayDisplay').then((m) => ({ default: m.CrawlerBayDisplay }))
)
const CrawlerTechLevelDisplay = lazy(() =>
  import('./CrawlerTechLevelDisplay').then((m) => ({ default: m.CrawlerTechLevelDisplay }))
)

export const componentRegistry: Record<string, DisplayComponentType> = {
  // Complex components with custom logic/children
  abilities: AbilityDisplay as unknown as DisplayComponentType,
  'ability-tree-requirements': AbilityTreeRequirementDisplay as unknown as DisplayComponentType,
  chassis: ChassisDisplay as unknown as DisplayComponentType,
  classes: ClassDisplay as unknown as DisplayComponentType,
  'crawler-bays': CrawlerBayDisplay as unknown as DisplayComponentType,
  'crawler-tech-levels': CrawlerTechLevelDisplay as unknown as DisplayComponentType,

  // Simple displays created via factory pattern
  'bio-titans': createEntityDisplay('BioTitan'),
  crawlers: createEntityDisplay('Crawler'),
  creatures: createEntityDisplay('Creature'),
  drones: createEntityDisplay('Drone'),
  equipment: createEntityDisplay('Equipment'),
  keywords: createEntityDisplay('Keyword'),
  meld: createEntityDisplay('Meld'),
  modules: createEntityDisplay('Module'),
  npcs: createEntityDisplay('NPC'),
  squads: createEntityDisplay('Squad'),
  systems: createEntityDisplay('System'),
  'roll-tables': createEntityDisplay('RollTable'),
  traits: createEntityDisplay('Trait'),
  vehicles: createEntityDisplay('Vehicle'),
}

export function getDisplayComponent(schemaId: string): DisplayComponentType | null {
  return componentRegistry[schemaId] || null
}
