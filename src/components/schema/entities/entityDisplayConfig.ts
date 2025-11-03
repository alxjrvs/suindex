import type { SURefMetaSchemaName } from 'salvageunion-reference'

/**
 * Configuration for simple entity display wrappers.
 * These configs are used to create entity display components via factory pattern.
 */
interface EntityDisplayConfig {
  headerColor?: string
  actionHeaderBgColor?: string
}

/**
 * Entity display configurations for simple wrapper components.
 * EntityDisplay now handles most complex logic internally (abilities, classes, etc.)
 */
export const ENTITY_DISPLAY_CONFIGS: Partial<Record<SURefMetaSchemaName, EntityDisplayConfig>> = {
  npcs: {
    actionHeaderBgColor: 'su.green',
  },
  creatures: {
    headerColor: 'su.orange',
    actionHeaderBgColor: 'su.orange',
  },
  'bio-titans': {
    actionHeaderBgColor: 'su.orange',
  },
  keywords: {
    headerColor: 'su.orange',
  },
  traits: {
    headerColor: 'su.orange',
  },
  'roll-tables': {
    headerColor: 'su.orange',
  },
  crawlers: {
    headerColor: 'su.pink',
    actionHeaderBgColor: 'su.pink',
  },
  chassis: {
    headerColor: 'su.green',
  },
  abilities: {
    // Header color auto-calculated in EntityDisplay based on ability type
  },
  'ability-tree-requirements': {
    // Header color auto-calculated in EntityDisplay based on name
  },
  'classes.core': {
    headerColor: 'su.orange',
  },
  'classes.advanced': {
    headerColor: 'su.pink',
  },
  'crawler-bays': {
    headerColor: 'su.pink',
  },
}
