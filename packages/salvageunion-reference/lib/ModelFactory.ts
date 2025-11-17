/**
 * Model Factory - Auto-generates models from schema catalog
 * Uses static imports for synchronous data loading
 *
 * Note: Current implementation loads all data at import time for synchronous access.
 * Future optimization: Consider lazy loading schemas on first access for better
 * code splitting and initial bundle size reduction.
 */
import { BaseModel } from './BaseModel.js'
import schemaIndex from '../schemas/index.json' with { type: 'json' }

// Import all data files
import abilitiesData from '../data/abilities.json' with { type: 'json' }
import abilityTreeRequirementsData from '../data/ability-tree-requirements.json' with { type: 'json' }
import bioTitansData from '../data/bio-titans.json' with { type: 'json' }
import chassisData from '../data/chassis.json' with { type: 'json' }
import classesAdvancedData from '../data/classes.advanced.json' with { type: 'json' }
import classesCoreData from '../data/classes.core.json' with { type: 'json' }
import crawlerBaysData from '../data/crawler-bays.json' with { type: 'json' }
import crawlerTechLevelsData from '../data/crawler-tech-levels.json' with { type: 'json' }
import crawlersData from '../data/crawlers.json' with { type: 'json' }
import creaturesData from '../data/creatures.json' with { type: 'json' }
import distancesData from '../data/distances.json' with { type: 'json' }
import dronesData from '../data/drones.json' with { type: 'json' }
import equipmentData from '../data/equipment.json' with { type: 'json' }
import keywordsData from '../data/keywords.json' with { type: 'json' }
import meldData from '../data/meld.json' with { type: 'json' }
import modulesData from '../data/modules.json' with { type: 'json' }
import npcsData from '../data/npcs.json' with { type: 'json' }
import rollTablesData from '../data/roll-tables.json' with { type: 'json' }
import squadsData from '../data/squads.json' with { type: 'json' }
import systemsData from '../data/systems.json' with { type: 'json' }
import traitsData from '../data/traits.json' with { type: 'json' }
import vehiclesData from '../data/vehicles.json' with { type: 'json' }

// Import all schema files
import abilitiesSchema from '../schemas/abilities.schema.json' with { type: 'json' }
import abilityTreeRequirementsSchema from '../schemas/ability-tree-requirements.schema.json' with { type: 'json' }
import bioTitansSchema from '../schemas/bio-titans.schema.json' with { type: 'json' }
import chassisSchema from '../schemas/chassis.schema.json' with { type: 'json' }
import classesAdvancedSchema from '../schemas/classes.advanced.schema.json' with { type: 'json' }
import classesCoreSchema from '../schemas/classes.core.schema.json' with { type: 'json' }
import crawlerBaysSchema from '../schemas/crawler-bays.schema.json' with { type: 'json' }
import crawlerTechLevelsSchema from '../schemas/crawler-tech-levels.schema.json' with { type: 'json' }
import crawlersSchema from '../schemas/crawlers.schema.json' with { type: 'json' }
import creaturesSchema from '../schemas/creatures.schema.json' with { type: 'json' }
import distancesSchema from '../schemas/distances.schema.json' with { type: 'json' }
import dronesSchema from '../schemas/drones.schema.json' with { type: 'json' }
import equipmentSchema from '../schemas/equipment.schema.json' with { type: 'json' }
import keywordsSchema from '../schemas/keywords.schema.json' with { type: 'json' }
import meldSchema from '../schemas/meld.schema.json' with { type: 'json' }
import modulesSchema from '../schemas/modules.schema.json' with { type: 'json' }
import npcsSchema from '../schemas/npcs.schema.json' with { type: 'json' }
import rollTablesSchema from '../schemas/roll-tables.schema.json' with { type: 'json' }
import squadsSchema from '../schemas/squads.schema.json' with { type: 'json' }
import systemsSchema from '../schemas/systems.schema.json' with { type: 'json' }
import traitsSchema from '../schemas/traits.schema.json' with { type: 'json' }
import vehiclesSchema from '../schemas/vehicles.schema.json' with { type: 'json' }

/**
 * Static data map - all data files indexed by schema ID
 */
const dataMap: Record<string, unknown[]> = {
  abilities: abilitiesData,
  'ability-tree-requirements': abilityTreeRequirementsData,
  'bio-titans': bioTitansData,
  chassis: chassisData,
  'classes.advanced': classesAdvancedData,
  'classes.core': classesCoreData,
  'crawler-bays': crawlerBaysData,
  'crawler-tech-levels': crawlerTechLevelsData,
  crawlers: crawlersData,
  creatures: creaturesData,
  distances: distancesData,
  drones: dronesData,
  equipment: equipmentData,
  keywords: keywordsData,
  meld: meldData,
  modules: modulesData,
  npcs: npcsData,
  'roll-tables': rollTablesData,
  squads: squadsData,
  systems: systemsData,
  traits: traitsData,
  vehicles: vehiclesData,
}

/**
 * Static schema map - all schemas indexed by schema ID
 */
const schemaMap: Record<string, Record<string, unknown>> = {
  abilities: abilitiesSchema,
  'ability-tree-requirements': abilityTreeRequirementsSchema,
  'bio-titans': bioTitansSchema,
  chassis: chassisSchema,
  'classes.advanced': classesAdvancedSchema,
  'classes.core': classesCoreSchema,
  'crawler-bays': crawlerBaysSchema,
  'crawler-tech-levels': crawlerTechLevelsSchema,
  crawlers: crawlersSchema,
  creatures: creaturesSchema,
  distances: distancesSchema,
  drones: dronesSchema,
  equipment: equipmentSchema,
  keywords: keywordsSchema,
  meld: meldSchema,
  modules: modulesSchema,
  npcs: npcsSchema,
  'roll-tables': rollTablesSchema,
  squads: squadsSchema,
  systems: systemsSchema,
  traits: traitsSchema,
  vehicles: vehiclesSchema,
}

/**
 * Get the data and schema maps (synchronous)
 * Exposed for client use
 */
export function getDataMaps(): {
  dataMap: Record<string, unknown[]>
  schemaMap: Record<string, Record<string, unknown>>
} {
  return { dataMap, schemaMap }
}

/**
 * Convert schema ID to PascalCase property name
 * Examples:
 *   abilities -> Abilities
 *   ability-tree-requirements -> AbilityTreeRequirements
 *   classes.core -> CoreClasses
 *
 * Exposed for client use
 */
export function toPascalCase(id: string): string {
  // Handle special cases for classes
  if (id === 'classes.core') return 'CoreClasses'
  if (id === 'classes.advanced') return 'AdvancedClasses'

  // Handle special case for NPCs (all caps)
  if (id === 'npcs') return 'NPCs'

  // Handle hyphenated and dotted names
  return id
    .split(/[-.]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('')
}

/**
 * Create a model instance for a given schema entry (synchronous)
 * Returns an object with instance methods and readonly metadata properties
 */
function createModel<T>(schemaId: string): BaseModel<T> & {
  readonly schemaName: string
  readonly displayName: string
} {
  const data = dataMap[schemaId]
  const schema = schemaMap[schemaId]

  if (!data || !schema) {
    throw new Error(`No data or schema found for schema ID: ${schemaId}`)
  }

  const displayNameValue = schemaDisplayNames[schemaId]?.plural || schemaId

  const model = new BaseModel<T>(data as T[], schema, schemaId, displayNameValue)

  // Add readonly metadata properties directly to the instance
  Object.defineProperties(model, {
    schemaName: {
      value: schemaId,
      writable: false,
      enumerable: true,
      configurable: false,
    },
    displayName: {
      value: displayNameValue,
      writable: false,
      enumerable: true,
      configurable: false,
    },
  })

  return model as BaseModel<T> & {
    readonly schemaName: string
    readonly displayName: string
  }
}

/**
 * Auto-generate all models from the schema catalog (synchronous)
 */
export function generateModels(): Record<string, BaseModel<unknown>> {
  const models: Record<string, BaseModel<unknown>> = {}

  for (const schemaEntry of schemaIndex.schemas) {
    const propertyName = toPascalCase(schemaEntry.id)
    models[propertyName] = createModel(schemaEntry.id)
  }

  return models
}

/**
 * Schema display name mappings
 */
const schemaDisplayNames: Record<string, { singular: string; plural: string }> = {
  abilities: { singular: 'Ability', plural: 'Abilities' },
  'ability-tree-requirements': {
    singular: 'Ability Tree Requirement',
    plural: 'Ability Tree Requirements',
  },
  'bio-titans': { singular: 'Bio-Titan', plural: 'Bio-Titans' },
  chassis: { singular: 'Chassis', plural: 'Chassis' },
  'classes.advanced': {
    singular: 'Advanced Class',
    plural: 'Advanced Classes',
  },
  'classes.core': { singular: 'Core Class', plural: 'Core Classes' },
  'crawler-bays': { singular: 'Crawler Bay', plural: 'Crawler Bays' },
  'crawler-tech-levels': {
    singular: 'Crawler Tech Level',
    plural: 'Crawler Tech Levels',
  },
  crawlers: { singular: 'Crawler', plural: 'Crawlers' },
  creatures: { singular: 'Creature', plural: 'Creatures' },
  distances: { singular: 'Distance', plural: 'Distances' },
  drones: { singular: 'Drone', plural: 'Drones' },
  equipment: { singular: 'Equipment', plural: 'Equipment' },
  keywords: { singular: 'Keyword', plural: 'Keywords' },
  meld: { singular: 'Meld', plural: 'Meld' },
  modules: { singular: 'Module', plural: 'Modules' },
  npcs: { singular: 'NPC', plural: 'NPCs' },
  'roll-tables': { singular: 'Roll Table', plural: 'Roll Tables' },
  squads: { singular: 'Squad', plural: 'Squads' },
  systems: { singular: 'System', plural: 'Systems' },
  traits: { singular: 'Trait', plural: 'Traits' },
  vehicles: { singular: 'Vehicle', plural: 'Vehicles' },
}

/**
 * Enhanced schema metadata interface
 */
export interface EnhancedSchemaMetadata {
  id: string
  title: string
  description: string
  comment?: string
  dataFile: string
  schemaFile: string
  itemCount: number
  requiredFields: string[]
  displayName: string
  displayNamePlural: string
}

/**
 * Get schema catalog with enhanced metadata
 * Exposed for client use
 */
export function getSchemaCatalog(): {
  $schema: string
  title: string
  description: string
  version: string
  generated: string
  schemas: EnhancedSchemaMetadata[]
} {
  return {
    ...schemaIndex,
    schemas: schemaIndex.schemas.map((schema) => ({
      ...schema,
      displayName: schemaDisplayNames[schema.id]?.singular || schema.title,
      displayNamePlural: schemaDisplayNames[schema.id]?.plural || schema.title,
    })),
  }
}
