/**
 * Salvage Union Data ORM
 *
 * Type-safe query interface for Salvage Union game data
 * Models are auto-generated from the schema catalog
 *
 * DO NOT EDIT MANUALLY - This file is generated from lib/index.template.ts
 * Run 'npm run generate:index' to regenerate
 */

import { BaseModel, type ModelWithMetadata } from './BaseModel.js'
import { generateModels } from './ModelFactory.js'
import type {
  SURefAbility,
  SURefBioTitan,
  SURefChassis,
  SURefAdvancedClass,
  SURefCoreClass,
  SURefCrawlerBay,
  SURefCrawler,
  SURefCreature,
  SURefDistance,
  SURefDrone,
  SURefEquipment,
  SURefKeyword,
  SURefMeld,
  SURefModule,
  SURefNPC,
  SURefRollTable,
  SURefSquad,
  SURefSystem,
  SURefTrait,
  SURefVehicle,
  SURefMetaAbilityTreeRequirement,
  SURefMetaCrawlerTechLevel,
  SURefEntity,
  SURefSchemaName,
} from './types/index.js'

export { BaseModel, type ModelWithMetadata } from './BaseModel.js'

export { getDataMaps, getSchemaCatalog, type EnhancedSchemaMetadata } from './ModelFactory.js'

export { resultForTable, type TableRollResult } from './utils/resultForTable.js'

// Export utility functions (type guards and property extractors)
export * from './utilities.js'

// Export helper functions for common operations
export * from './helpers.js'

export {
  search,
  searchIn,
  getSuggestions,
  type SearchOptions,
  type SearchResult,
} from './search.js'

// Import search functions for use in class methods
import {
  search as searchFn,
  searchIn as searchInFn,
  getSuggestions as getSuggestionsFn,
  type SearchOptions,
  type SearchResult,
} from './search.js'

export type * from './types/index.js'

// Type mapping from schema names to entity types (includes entity schemas and meta schemas)
export type SchemaToEntityMap = {
  abilities: SURefAbility
  'ability-tree-requirements': SURefMetaAbilityTreeRequirement
  'bio-titans': SURefBioTitan
  chassis: SURefChassis
  'classes.advanced': SURefAdvancedClass
  'classes.core': SURefCoreClass
  'crawler-bays': SURefCrawlerBay
  'crawler-tech-levels': SURefMetaCrawlerTechLevel
  crawlers: SURefCrawler
  creatures: SURefCreature
  distances: SURefDistance
  drones: SURefDrone
  equipment: SURefEquipment
  keywords: SURefKeyword
  meld: SURefMeld
  modules: SURefModule
  npcs: SURefNPC
  'roll-tables': SURefRollTable
  squads: SURefSquad
  systems: SURefSystem
  traits: SURefTrait
  vehicles: SURefVehicle
}

// Type for entity schema names (includes entity schemas and meta schemas, excludes non-entity schemas)
export type EntitySchemaName = keyof SchemaToEntityMap

// Runtime set of entity schema names (for runtime checks)
export const EntitySchemaNames = new Set<EntitySchemaName>([
  'abilities',
  'ability-tree-requirements',
  'bio-titans',
  'chassis',
  'classes.advanced',
  'classes.core',
  'crawler-bays',
  'crawler-tech-levels',
  'crawlers',
  'creatures',
  'distances',
  'drones',
  'equipment',
  'keywords',
  'meld',
  'modules',
  'npcs',
  'roll-tables',
  'squads',
  'systems',
  'traits',
  'vehicles',
])

// Runtime mapping from schema names to model property names
export const SchemaToModelMap = {
  abilities: 'Abilities',
  'ability-tree-requirements': 'AbilityTreeRequirements',
  'bio-titans': 'BioTitans',
  'chassis-abilities': 'ChassisAbilities',
  actions: 'Actions',
  chassis: 'Chassis',
  'classes.advanced': 'AdvancedClasses',
  'classes.core': 'CoreClasses',
  'crawler-bays': 'CrawlerBays',
  'crawler-tech-levels': 'CrawlerTechLevels',
  crawlers: 'Crawlers',
  creatures: 'Creatures',
  distances: 'Distances',
  drones: 'Drones',
  equipment: 'Equipment',
  keywords: 'Keywords',
  meld: 'Meld',
  modules: 'Modules',
  npcs: 'NPCs',
  'roll-tables': 'RollTables',
  squads: 'Squads',
  systems: 'Systems',
  traits: 'Traits',
  vehicles: 'Vehicles',
} as const

// Runtime mapping from schema names to display names
export const SchemaToDisplayName = {
  abilities: 'Abilities',
  'ability-tree-requirements': 'Ability Tree Requirements',
  'bio-titans': 'Bio-Titans',
  'chassis-abilities': 'chassis-abilities',
  actions: 'Actions',
  chassis: 'Chassis',
  'classes.advanced': 'Advanced Classes',
  'classes.core': 'Core Classes',
  'crawler-bays': 'Crawler Bays',
  'crawler-tech-levels': 'Crawler Tech Levels',
  crawlers: 'Crawlers',
  creatures: 'Creatures',
  distances: 'Distances',
  drones: 'Drones',
  equipment: 'Equipment',
  keywords: 'Keywords',
  meld: 'Meld',
  modules: 'Modules',
  npcs: 'NPCs',
  'roll-tables': 'Roll Tables',
  squads: 'Squads',
  systems: 'Systems',
  traits: 'Traits',
  vehicles: 'Vehicles',
} as const

// Auto-generate models from schema catalog (synchronous)
const models = generateModels()

/**
 * Main ORM class with static model accessors
 */
export class SalvageUnionReference {
  // Initialize static properties from generated models
  static Abilities = models.Abilities as ModelWithMetadata<SchemaToEntityMap['abilities']>
  static AbilityTreeRequirements =
    models.AbilityTreeRequirements as ModelWithMetadata<SURefMetaAbilityTreeRequirement>
  static BioTitans = models.BioTitans as ModelWithMetadata<SchemaToEntityMap['bio-titans']>
  static Chassis = models.Chassis as ModelWithMetadata<SchemaToEntityMap['chassis']>
  static AdvancedClasses = models.AdvancedClasses as ModelWithMetadata<
    SchemaToEntityMap['classes.advanced']
  >
  static CoreClasses = models.CoreClasses as ModelWithMetadata<SchemaToEntityMap['classes.core']>
  static CrawlerBays = models.CrawlerBays as ModelWithMetadata<SchemaToEntityMap['crawler-bays']>
  static CrawlerTechLevels =
    models.CrawlerTechLevels as ModelWithMetadata<SURefMetaCrawlerTechLevel>
  static Crawlers = models.Crawlers as ModelWithMetadata<SchemaToEntityMap['crawlers']>
  static Creatures = models.Creatures as ModelWithMetadata<SchemaToEntityMap['creatures']>
  static Distances = models.Distances as ModelWithMetadata<SchemaToEntityMap['distances']>
  static Drones = models.Drones as ModelWithMetadata<SchemaToEntityMap['drones']>
  static Equipment = models.Equipment as ModelWithMetadata<SchemaToEntityMap['equipment']>
  static Keywords = models.Keywords as ModelWithMetadata<SchemaToEntityMap['keywords']>
  static Meld = models.Meld as ModelWithMetadata<SchemaToEntityMap['meld']>
  static Modules = models.Modules as ModelWithMetadata<SchemaToEntityMap['modules']>
  static NPCs = models.NPCs as ModelWithMetadata<SchemaToEntityMap['npcs']>
  static RollTables = models.RollTables as ModelWithMetadata<SchemaToEntityMap['roll-tables']>
  static Squads = models.Squads as ModelWithMetadata<SchemaToEntityMap['squads']>
  static Systems = models.Systems as ModelWithMetadata<SchemaToEntityMap['systems']>
  static Traits = models.Traits as ModelWithMetadata<SchemaToEntityMap['traits']>
  static Vehicles = models.Vehicles as ModelWithMetadata<SchemaToEntityMap['vehicles']>

  /**
   * Find a single entity in a specific schema
   *
   * @param schemaName - The schema to search in
   * @param predicate - Function to test each entity
   * @returns The first matching entity or undefined
   *
   * @example
   * const ability = SalvageUnionReference.findIn('abilities', a => a.name === 'Bionic Senses')
   */
  public static findIn<T extends keyof SchemaToEntityMap>(
    schemaName: T,
    predicate: (entity: SchemaToEntityMap[T]) => boolean
  ): SchemaToEntityMap[T] | undefined {
    const modelName = SchemaToModelMap[schemaName]
    const model = models[modelName] as BaseModel<SchemaToEntityMap[T]>
    return model.find(predicate)
  }

  /**
   * Find all entities matching a predicate in a specific schema
   *
   * @param schemaName - The schema to search in
   * @param predicate - Function to test each entity
   * @returns Array of matching entities
   *
   * @example
   * const level1Abilities = SalvageUnionReference.findAllIn('abilities', a => a.level === 1)
   */
  public static findAllIn<T extends keyof SchemaToEntityMap>(
    schemaName: T,
    predicate: (entity: SchemaToEntityMap[T]) => boolean
  ): SchemaToEntityMap[T][] {
    const modelName = SchemaToModelMap[schemaName]
    const model = models[modelName] as BaseModel<SchemaToEntityMap[T]>
    return model.findAll(predicate)
  }

  // Entity cache for O(1) lookups
  private static entityCache = new Map<string, SURefEntity>()

  /**
   * Get an entity by schema name and ID (O(1) with caching)
   *
   * @param schemaName - The schema to search in
   * @param id - The entity ID
   * @returns The entity or undefined if not found
   *
   * @example
   * const ability = SalvageUnionReference.get('abilities', 'bionic-senses')
   */
  public static get<T extends keyof SchemaToEntityMap>(
    schemaName: T,
    id: string
  ): SchemaToEntityMap[T] | undefined {
    const cacheKey = `${schemaName}::${id}`

    // Check cache first
    if (this.entityCache.has(cacheKey)) {
      return this.entityCache.get(cacheKey) as SchemaToEntityMap[T]
    }

    // Find entity
    const entity = this.findIn(schemaName, (e: SchemaToEntityMap[T]) => e.id === id)

    // Cache if found
    if (entity) {
      this.entityCache.set(cacheKey, entity)
    }

    return entity
  }

  /**
   * Check if an entity exists by schema name and ID
   *
   * @param schemaName - The schema to check
   * @param id - The entity ID
   * @returns True if the entity exists
   *
   * @example
   * if (SalvageUnionReference.exists('abilities', 'bionic-senses')) { ... }
   */
  public static exists<T extends keyof SchemaToEntityMap>(schemaName: T, id: string): boolean {
    return this.get(schemaName, id) !== undefined
  }

  /**
   * Get multiple entities by schema name and IDs
   *
   * @param requests - Array of {schemaName, id} objects
   * @returns Array of entities (undefined for IDs not found)
   *
   * @example
   * const entities = SalvageUnionReference.getMany([
   *   { schemaName: 'abilities', id: 'bionic-senses' },
   *   { schemaName: 'systems', id: 'energy-shield' }
   * ])
   */
  public static getMany(
    requests: Array<{ schemaName: keyof SchemaToEntityMap; id: string }>
  ): (SURefEntity | undefined)[] {
    return requests.map((req) => this.get(req.schemaName, req.id))
  }

  /**
   * Compose a reference string from schema name and ID
   *
   * @param schemaName - The schema name
   * @param id - The entity ID
   * @returns Reference string in format "schemaName::id"
   *
   * @example
   * const ref = SalvageUnionReference.composeRef('abilities', 'bionic-senses')
   * // => 'abilities::bionic-senses'
   */
  public static composeRef<T extends keyof SchemaToEntityMap>(schemaName: T, id: string): string {
    return `${schemaName}::${id}`
  }

  /**
   * Parse a reference string into schema name and ID
   *
   * @param ref - Reference string in format "schemaName::id"
   * @returns Object with schemaName and id, or null if invalid
   *
   * @example
   * const parsed = SalvageUnionReference.parseRef('abilities::bionic-senses')
   * // => { schemaName: 'abilities', id: 'bionic-senses' }
   */
  public static parseRef(ref: string): {
    schemaName: SURefSchemaName
    id: string
  } | null {
    const parts = ref.split('::')
    if (parts.length !== 2) return null

    const [schemaName, id] = parts
    if (!SchemaToModelMap[schemaName as SURefSchemaName]) return null

    return { schemaName: schemaName as SURefSchemaName, id }
  }

  /**
   * Get an entity by reference string
   *
   * @param ref - Reference string in format "schemaName::id"
   * @returns The entity or undefined if not found
   *
   * @example
   * const ability = SalvageUnionReference.getByRef('abilities::bionic-senses')
   */
  public static getByRef(ref: string): SURefEntity | undefined {
    const parsed = this.parseRef(ref)
    if (!parsed) return undefined
    // Only work with entity schemas (not meta schemas)
    if (EntitySchemaNames.has(parsed.schemaName as EntitySchemaName)) {
      return this.get(parsed.schemaName as EntitySchemaName, parsed.id)
    }
    return undefined
  }

  /**
   * Batch fetch entities by reference strings
   *
   * @param refs - Array of reference strings
   * @returns Map of reference strings to entities (undefined for invalid refs)
   *
   * @example
   * const entities = SalvageUnionReference.getManyByRef([
   *   'abilities::bionic-senses',
   *   'systems::energy-shield'
   * ])
   */
  public static getManyByRef(refs: string[]): Map<string, SURefEntity | undefined> {
    const result = new Map<string, SURefEntity | undefined>()
    for (const ref of refs) {
      result.set(ref, this.getByRef(ref))
    }
    return result
  }

  /**
   * Get tech level from an entity
   *
   * @param entity - Any Salvage Union entity
   * @returns Tech level or undefined if not present
   *
   * @example
   * const techLevel = SalvageUnionReference.getTechLevel(chassis)
   */
  public static getTechLevel(entity: SURefEntity): number | undefined {
    // Check if entity has top-level techLevel (Chassis, Systems, Modules, Drones, Vehicles)
    if ('techLevel' in entity && typeof entity.techLevel === 'number') {
      return entity.techLevel
    }
    return undefined
  }

  /**
   * Get salvage value from an entity
   *
   * @param entity - Any Salvage Union entity
   * @returns Salvage value or undefined if not present
   *
   * @example
   * const salvageValue = SalvageUnionReference.getSalvageValue(system)
   */
  public static getSalvageValue(entity: SURefEntity): number | undefined {
    // Check if entity has top-level salvageValue (Chassis, Systems, Modules, Drones, Vehicles, Meld)
    if ('salvageValue' in entity && typeof entity.salvageValue === 'number') {
      return entity.salvageValue
    }
    return undefined
  }

  /**
   * Search across all or specific schemas
   *
   * @param options - Search options including query, schemas filter, limit, and case sensitivity
   * @returns Array of search results sorted by relevance
   *
   * @example
   * const results = SalvageUnionReference.search({ query: 'laser' })
   * const systemResults = SalvageUnionReference.search({ query: 'laser', schemas: ['systems'] })
   */
  public static search(options: SearchOptions): SearchResult[] {
    return searchFn(options)
  }

  /**
   * Search within a specific schema
   *
   * @param schemaName - The schema to search in
   * @param query - Search query string
   * @param options - Optional search options (limit, case sensitivity)
   * @returns Array of matching entities
   *
   * @example
   * const systems = SalvageUnionReference.searchIn('systems', 'laser')
   */
  public static searchIn<T extends SURefEntity>(
    schemaName: SURefSchemaName,
    query: string,
    options?: { limit?: number; caseSensitive?: boolean }
  ): T[] {
    return searchInFn(schemaName, query, options)
  }

  /**
   * Get search suggestions based on partial query
   *
   * @param query - Partial search query
   * @param options - Optional search options (schemas filter, limit, case sensitivity)
   * @returns Array of unique entity names matching the query
   *
   * @example
   * const suggestions = SalvageUnionReference.getSuggestions('las')
   */
  public static getSuggestions(
    query: string,
    options?: {
      schemas?: SURefSchemaName[]
      limit?: number
      caseSensitive?: boolean
    }
  ): string[] {
    return getSuggestionsFn(query, options)
  }
}
