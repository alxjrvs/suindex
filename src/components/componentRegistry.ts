import type { ComponentType } from 'react'
import { lazy } from 'react'
import { createEntityDisplay } from './schema/entities/createEntityDisplay'
import type { SURefEntity } from 'salvageunion-reference'

export interface DisplayComponentProps {
  data: SURefEntity
  hideActions?: boolean
  compact?: boolean
  collapsible?: boolean
  defaultExpanded?: boolean
  onClick?: () => void
}

type DisplayComponentType = ComponentType<DisplayComponentProps>

// Complex components with custom logic/children - keep as separate files
const AbilityDisplay = lazy(() =>
  import('./schema/entities/AbilityDisplay').then((m) => ({ default: m.AbilityDisplay }))
)
const AbilityTreeRequirementDisplay = lazy(() =>
  import('./schema/entities/AbilityTreeRequirementDisplay').then((m) => ({
    default: m.AbilityTreeRequirementDisplay,
  }))
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
  classes: ClassDisplay as unknown as DisplayComponentType,
  'classes.core': ClassDisplay as unknown as DisplayComponentType,
  'classes.advanced': ClassDisplay as unknown as DisplayComponentType,
  'classes.hybrid': ClassDisplay as unknown as DisplayComponentType,
  'crawler-bays': CrawlerBayDisplay as unknown as DisplayComponentType,
  'crawler-tech-levels': CrawlerTechLevelDisplay as unknown as DisplayComponentType,

  // Simple displays created via factory pattern
  'bio-titans': createEntityDisplay('bio-titans'),
  chassis: createEntityDisplay('chassis'),
  crawlers: createEntityDisplay('crawlers'),
  creatures: createEntityDisplay('creatures'),
  drones: createEntityDisplay('drones'),
  equipment: createEntityDisplay('equipment'),
  keywords: createEntityDisplay('keywords'),
  meld: createEntityDisplay('meld'),
  modules: createEntityDisplay('modules'),
  npcs: createEntityDisplay('npcs'),
  squads: createEntityDisplay('squads'),
  systems: createEntityDisplay('systems'),
  'roll-tables': createEntityDisplay('roll-tables'),
  traits: createEntityDisplay('traits'),
  vehicles: createEntityDisplay('vehicles'),
}

export function getDisplayComponent(schemaId: string): DisplayComponentType | null {
  return componentRegistry[schemaId] || null
}
