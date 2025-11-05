import type { ComponentType } from 'react'
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

export const componentRegistry: Record<string, DisplayComponentType> = {
  // EntityDisplay now handles all schema-specific logic internally
  abilities: createEntityDisplay('abilities'),
  'ability-tree-requirements': createEntityDisplay('ability-tree-requirements'),
  classes: createEntityDisplay('classes.core'), // Fallback for generic 'classes'
  'classes.core': createEntityDisplay('classes.core'),
  'classes.advanced': createEntityDisplay('classes.advanced'),
  // Note: 'classes.hybrid' is now merged into 'classes.advanced' in salvageunion-reference v1.54.0
  'classes.hybrid': createEntityDisplay('classes.advanced'), // Backward compatibility
  'crawler-bays': createEntityDisplay('crawler-bays'),
  'crawler-tech-levels': createEntityDisplay('crawler-tech-levels'),

  // All other schemas use factory pattern
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
