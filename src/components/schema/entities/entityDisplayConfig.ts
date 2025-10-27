import type { SURefSchemaName } from 'salvageunion-reference'

/**
 * Configuration for simple entity display wrappers.
 * These configs are used to create entity display components via factory pattern.
 */
interface EntityDisplayConfig {
  headerColor?: string
  actionHeaderBgColor?: string
  actionHeaderTextColor?: string
}

/**
 * Entity display configurations for simple wrapper components.
 * Complex components with custom logic/children are not included here.
 */
export const ENTITY_DISPLAY_CONFIGS: Partial<Record<SURefSchemaName, EntityDisplayConfig>> = {
  npcs: {
    actionHeaderBgColor: 'su.green',
    actionHeaderTextColor: 'white',
  },
  creatures: {
    headerColor: 'su.orange',
    actionHeaderBgColor: 'su.orange',
  },
  'bio-titans': {
    actionHeaderBgColor: 'su.orange',
    actionHeaderTextColor: 'su.white',
  },
  drones: {},
  vehicles: {},
  squads: {},
  meld: {},
  systems: {},
  modules: {},
  equipment: {},
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
    actionHeaderTextColor: 'white',
  },
  chassis: {
    headerColor: 'su.green',
  },
}
