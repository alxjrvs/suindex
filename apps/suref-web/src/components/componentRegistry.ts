import type { ComponentType } from 'react'
import { createEntityDisplay } from './schema/entities/createEntityDisplay'
import type { SURefEntity } from 'salvageunion-reference'

export interface DisplayComponentProps {
  data: SURefEntity
  hideActions?: boolean
  hideChoices?: boolean
  compact?: boolean
  collapsible?: boolean
  defaultExpanded?: boolean
  onClick?: () => void
}

type DisplayComponentType = ComponentType<DisplayComponentProps>

export const componentRegistry: Record<string, DisplayComponentType> = {
  abilities: createEntityDisplay('abilities'),
  'ability-tree-requirements': createEntityDisplay('ability-tree-requirements'),
  classes: createEntityDisplay('classes.core'),
  'classes.core': createEntityDisplay('classes.core'),
  'classes.advanced': createEntityDisplay('classes.advanced'),

  'classes.hybrid': createEntityDisplay('classes.advanced'),
  'crawler-bays': createEntityDisplay('crawler-bays'),
  'crawler-tech-levels': createEntityDisplay('crawler-tech-levels'),

  'bio-titans': createEntityDisplay('bio-titans'),
  chassis: createEntityDisplay('chassis'),
  crawlers: createEntityDisplay('crawlers'),
  creatures: createEntityDisplay('creatures'),
  distances: createEntityDisplay('distances'),
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
