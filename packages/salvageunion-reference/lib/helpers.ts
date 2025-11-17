/**
 * Helper functions for common operations on Salvage Union reference data
 * These functions provide convenient access patterns used by consuming applications
 */

import { SalvageUnionReference, SchemaToDisplayName, SchemaToModelMap } from './index.js'
import type {
  SURefAbility,
  SURefAdvancedClass,
  SURefChassis,
  SURefCoreClass,
  SURefCrawler,
  SURefCrawlerBay,
  SURefCrawlerTechLevel,
  SURefEquipment,
  SURefEntity,
  SURefSchemaName,
} from './types/index.js'
import type { ModelWithMetadata } from './BaseModel.js'

/**
 * Get the display name for a schema
 * @param schemaName - The schema name
 * @returns The display name or the schema name if not found
 */
export function getDisplayName(schemaName: SURefSchemaName): string {
  return SchemaToDisplayName[schemaName] || schemaName
}

/**
 * Normalize a schema name to the canonical form
 * Handles aliases like 'classes-core' -> 'classes.core', 'classes-hybrid' -> 'classes.advanced'
 * @param schemaName - The schema name (may be an alias)
 * @returns The normalized schema name
 */
export function normalizeSchemaName(schemaName: string): SURefSchemaName {
  // Handle class schema aliases
  if (schemaName === 'classes-core') return 'classes.core'
  if (schemaName === 'classes-advanced') return 'classes.advanced'
  if (schemaName === 'classes-hybrid' || schemaName === 'classes.hybrid') {
    return 'classes.advanced'
  }

  // Return as-is if it's already a valid schema name
  return schemaName as SURefSchemaName
}

/**
 * Get a model by schema name
 * Automatically normalizes schema name aliases (e.g., 'classes-core' -> 'classes.core')
 * @param schemaName - The schema name (may be an alias)
 * @returns The model instance or undefined if not found
 */
export function getModel(
  schemaName: string | SURefSchemaName
): ModelWithMetadata<SURefEntity> | undefined {
  const normalized = normalizeSchemaName(schemaName)
  const modelName = SchemaToModelMap[normalized]
  if (!modelName) return undefined
  return (SalvageUnionReference as unknown as Record<string, ModelWithMetadata<SURefEntity>>)[
    modelName
  ]
}

/**
 * Get a map of all schema names to their models
 * Useful for dynamic model access
 */
export function getModelMap(): Record<SURefSchemaName, ModelWithMetadata<SURefEntity>> {
  const map = {} as Record<SURefSchemaName, ModelWithMetadata<SURefEntity>>
  for (const schemaName in SchemaToModelMap) {
    const model = getModel(schemaName as SURefSchemaName)
    if (model) {
      map[schemaName as SURefSchemaName] = model
    }
  }
  return map
}

/**
 * Find an entity by ID in any schema
 * @param schemaName - The schema to search in
 * @param id - The entity ID
 * @returns The entity or undefined if not found
 */
export function findById<T extends SURefEntity>(
  schemaName: SURefSchemaName,
  id: string
): T | undefined {
  return SalvageUnionReference.get(schemaName, id) as T | undefined
}

/**
 * Get the name of an entity by ID with fallback
 * @param schemaName - The schema to search in
 * @param id - The entity ID
 * @param fallback - Fallback string if entity not found (default: 'Unknown')
 * @returns The entity name or fallback
 */
export function getNameById(
  schemaName: SURefSchemaName,
  id: string | null,
  fallback = 'Unknown'
): string {
  if (!id) return fallback
  const entity = SalvageUnionReference.get(schemaName, id)
  return (
    entity && 'name' in entity && typeof entity.name === 'string' ? entity.name : fallback
  ) as string
}

// ============================================================================
// CLASS HELPERS
// ============================================================================

/**
 * Get all core classes
 * @returns Array of core classes
 */
export function getCoreClasses(): SURefCoreClass[] {
  return SalvageUnionReference.findAllIn('classes.core', () => true)
}

/**
 * Get all hybrid classes (advanced classes with type='Hybrid')
 * @returns Array of hybrid classes
 */
export function getHybridClasses(): SURefAdvancedClass[] {
  return SalvageUnionReference.AdvancedClasses.all().filter((c) => c.type === 'Hybrid')
}

/**
 * Get all advanced classes (type='Advanced', excluding hybrids)
 * @returns Array of advanced classes
 */
export function getAdvancedClasses(): SURefAdvancedClass[] {
  return SalvageUnionReference.AdvancedClasses.all().filter((c) => c.type === 'Advanced')
}

/**
 * Find a core class by name
 * @param className - Name of the class to find
 * @returns The core class or undefined if not found
 */
export function findCoreClass(className: string): SURefCoreClass | undefined {
  return SalvageUnionReference.findIn('classes.core', (c) => c.name === className)
}

/**
 * Find a hybrid class by name
 * @param className - Name of the class to find
 * @returns The hybrid class or undefined if not found
 */
export function findHybridClass(className: string): SURefAdvancedClass | undefined {
  return SalvageUnionReference.findIn(
    'classes.advanced',
    (c) => c.name === className && c.type === 'Hybrid'
  )
}

/**
 * Find an advanced class by name
 * @param className - Name of the class to find
 * @returns The advanced class or undefined if not found
 */
export function findAdvancedClass(className: string): SURefAdvancedClass | undefined {
  return SalvageUnionReference.findIn(
    'classes.advanced',
    (c) => c.name === className && c.type === 'Advanced'
  )
}

/**
 * Find a class by name across all class types (core, advanced, hybrid)
 * @param className - Name of the class to find
 * @returns The class or undefined if not found
 */
export function findClass(className: string): SURefCoreClass | SURefAdvancedClass | undefined {
  return (
    SalvageUnionReference.findIn('classes.core', (c) => c.name === className) ||
    SalvageUnionReference.findIn('classes.advanced', (c) => c.name === className)
  )
}

// ============================================================================
// CHASSIS HELPERS
// ============================================================================

/**
 * Get all chassis
 * @returns Array of chassis
 */
export function getChassis(): SURefChassis[] {
  return SalvageUnionReference.findAllIn('chassis', () => true)
}

/**
 * Get chassis that have patterns
 * @returns Array of chassis with patterns
 */
export function getChassisWithPatterns(): SURefChassis[] {
  return SalvageUnionReference.findAllIn('chassis', (c) => c.patterns && c.patterns.length > 0)
}

/**
 * Find a chassis by ID
 * @param chassisId - The ID of the chassis to find
 * @returns The chassis or undefined if not found
 */
export function findChassisById(chassisId: string): SURefChassis | undefined {
  return SalvageUnionReference.findIn('chassis', (c) => c.id === chassisId)
}

/**
 * Get chassis name by ID with fallback
 * @param chassisId - The ID of the chassis to find
 * @param fallback - Fallback string if chassis not found (default: 'Unknown')
 * @returns The chassis name or fallback
 */
export function getChassisNameById(chassisId: string | null, fallback = 'Unknown'): string {
  if (!chassisId) return fallback
  return findChassisById(chassisId)?.name ?? fallback
}

// ============================================================================
// CRAWLER HELPERS
// ============================================================================

/**
 * Get all crawlers
 * @returns Array of crawlers
 */
export function getCrawlers(): SURefCrawler[] {
  return SalvageUnionReference.Crawlers.all()
}

/**
 * Get all crawler bays
 * @returns Array of crawler bays
 */
export function getCrawlerBays(): SURefCrawlerBay[] {
  return SalvageUnionReference.CrawlerBays.all()
}

/**
 * Find a crawler by ID
 * @param crawlerId - The ID of the crawler to find
 * @returns The crawler or undefined if not found
 */
export function findCrawlerById(crawlerId: string): SURefCrawler | undefined {
  return SalvageUnionReference.findIn('crawlers', (c) => c.id === crawlerId)
}

/**
 * Get crawler name by ID with fallback
 * @param crawlerId - The ID of the crawler to find
 * @param fallback - Fallback string if crawler not found (default: 'Unknown')
 * @returns The crawler name or fallback
 */
export function getCrawlerNameById(crawlerId: string | null, fallback = 'Unknown'): string {
  if (!crawlerId) return fallback
  return findCrawlerById(crawlerId)?.name ?? fallback
}

/**
 * Find a crawler tech level by level number
 * @param techLevel - The tech level number to find
 * @returns The tech level or undefined if not found
 */
export function findCrawlerTechLevel(techLevel: number): SURefCrawlerTechLevel | undefined {
  return SalvageUnionReference.CrawlerTechLevels.find((tl) => tl.techLevel === techLevel)
}

/**
 * Get structure points for a tech level with fallback
 * @param techLevel - The tech level number
 * @param fallback - Fallback number if tech level not found (default: 20)
 * @returns The structure points or fallback
 */
export function getStructurePointsForTechLevel(techLevel: number | null, fallback = 20): number {
  if (techLevel === null) return fallback
  return findCrawlerTechLevel(techLevel)?.structurePoints ?? fallback
}

// ============================================================================
// ABILITY HELPERS
// ============================================================================

/**
 * Get all abilities
 * @returns Array of abilities
 */
export function getAbilities(): SURefAbility[] {
  return SalvageUnionReference.Abilities.all()
}

/**
 * Get abilities by level
 * @param level - The ability level
 * @returns Array of abilities at that level
 */
export function getAbilitiesByLevel(level: number): SURefAbility[] {
  return SalvageUnionReference.Abilities.all().filter((a) => a.level === level)
}

// ============================================================================
// EQUIPMENT HELPERS
// ============================================================================

/**
 * Get all equipment
 * @returns Array of equipment
 */
export function getEquipment(): SURefEquipment[] {
  return SalvageUnionReference.findAllIn('equipment', () => true)
}

// ============================================================================
// TECH LEVEL HELPERS
// ============================================================================

/**
 * Get all tech levels as an array of numbers
 * Derived from crawler-tech-levels data
 * @returns Array of tech level numbers (1-6)
 */
export function getTechLevels(): readonly number[] {
  const techLevels = SalvageUnionReference.CrawlerTechLevels.all()
    .map((tl) => tl.techLevel)
    .sort((a, b) => a - b)
  return techLevels as readonly number[]
}

/**
 * Minimum tech level (always 1)
 */
export const MIN_TECH_LEVEL = 1

/**
 * Maximum tech level
 * Derived from crawler-tech-levels data
 */
export function getMaxTechLevel(): number {
  const techLevels = getTechLevels()
  return techLevels[techLevels.length - 1] || 6
}

/**
 * Get scrap conversion rate for a tech level
 * Each tech level is worth its numeric value in TL1 scrap
 * @param techLevel - The tech level (1-6)
 * @returns The conversion rate (tech level value)
 */
export function getScrapConversionRate(techLevel: number): number {
  return techLevel
}

/**
 * Get all scrap conversion rates as a record
 * @returns Record mapping tech level to conversion rate
 */
export function getScrapConversionRates(): Record<number, number> {
  const techLevels = getTechLevels()
  const rates: Record<number, number> = {}
  for (const tl of techLevels) {
    rates[tl] = getScrapConversionRate(tl)
  }
  return rates
}

// ============================================================================
// GAME RULE CONSTANTS
// ============================================================================

/**
 * Pilot default values
 * These are standard starting values for pilots
 */
export const PILOT_DEFAULTS = {
  maxHP: 10,
  maxAP: 5,
  startingTP: 0,
} as const

/**
 * Crawler default values
 * Derived from crawler-tech-levels data (TL1 defaults)
 */
export const CRAWLER_DEFAULTS = {
  initialTechLevel: 1,
  baseStructurePoints: 20, // TL1 structure points
  baseUpgrade: 0,
} as const

/**
 * Mech default values
 * Standard starting values for mechs
 */
export const MECH_DEFAULTS = {
  startingDamage: 0,
  startingHeat: 0,
} as const
