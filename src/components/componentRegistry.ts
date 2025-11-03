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

// Complex components with custom logic that cannot use createEntityDisplay
const CrawlerTechLevelDisplay = lazy(() =>
  import('./CrawlerTechLevelDisplay').then((m) => ({ default: m.CrawlerTechLevelDisplay }))
)

export const componentRegistry: Record<string, DisplayComponentType> = {
  // EntityDisplay now handles these internally with auto-calculated colors and custom children
  abilities: createEntityDisplay('abilities'),
  'ability-tree-requirements': createEntityDisplay('ability-tree-requirements'),
  classes: createEntityDisplay('classes.core'), // Fallback for generic 'classes'
  'classes.core': createEntityDisplay('classes.core'),
  'classes.advanced': createEntityDisplay('classes.advanced'),
  // Note: 'classes.hybrid' is now merged into 'classes.advanced' in salvageunion-reference v1.54.0
  'classes.hybrid': createEntityDisplay('classes.advanced'), // Backward compatibility
  'crawler-bays': createEntityDisplay('crawler-bays'),

  // Complex components that still need custom wrappers
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
