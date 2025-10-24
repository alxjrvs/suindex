import type { SURefEntityName } from 'salvageunion-reference'

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
export const ENTITY_DISPLAY_CONFIGS: Partial<Record<SURefEntityName, EntityDisplayConfig>> = {
  NPC: {
    actionHeaderBgColor: 'su.green',
    actionHeaderTextColor: 'white',
  },
  Creature: {
    headerColor: 'su.orange',
  },
  BioTitan: {
    actionHeaderBgColor: 'su.orange',
    actionHeaderTextColor: 'su.white',
  },
  Drone: {},
  Vehicle: {},
  Squad: {},
  Meld: {},
  System: {},
  Module: {},
  Equipment: {},
  Keyword: {
    headerColor: 'su.orange',
  },
  Trait: {
    headerColor: 'su.orange',
  },
  RollTable: {
    headerColor: 'su.orange',
  },
  Crawler: {
    headerColor: 'su.pink',
    actionHeaderBgColor: 'su.pink',
    actionHeaderTextColor: 'white',
  },
}

