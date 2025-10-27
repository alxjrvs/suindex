import type { SURefSchemaName } from 'salvageunion-reference'

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
 * Complex components with custom logic/children are not included here.
 */
export const ENTITY_DISPLAY_CONFIGS: Partial<Record<SURefSchemaName, EntityDisplayConfig>> = {
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
}
