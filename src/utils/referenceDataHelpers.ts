import { SalvageUnionReference } from 'salvageunion-reference'
import type {
  SURefAbility,
  SURefCoreClass,
  SURefAdvancedClass,
  SURefHybridClass,
  SURefChassis,
  SURefCrawler,
  SURefCrawlerBay,
  SURefCrawlerTechLevel,
  SURefEquipment,
} from 'salvageunion-reference'

/**
 * Find a chassis by ID
 * @param chassisId - The ID of the chassis to find
 * @returns The chassis object or undefined if not found
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

/**
 * Find a crawler by ID
 * @param crawlerId - The ID of the crawler to find
 * @returns The crawler object or undefined if not found
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
 * @returns The tech level object or undefined if not found
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

/**
 * Fetch and validate core classes from reference data
 * @throws Error if no core classes found
 * @returns Array of core classes
 */
export function getCoreClasses(): SURefCoreClass[] {
  const allCoreClasses = SalvageUnionReference.findAllIn('classes.core', () => true)

  if (allCoreClasses.length === 0) {
    throw new Error('No core classes found in salvageunion-reference')
  }

  return allCoreClasses
}

/**
 * Fetch and validate hybrid classes from reference data
 * @throws Error if no hybrid classes found
 * @returns Array of hybrid classes
 */
export function getHybridClasses(): SURefHybridClass[] {
  const allHybridClasses = SalvageUnionReference.findAllIn('classes.hybrid', () => true)

  if (allHybridClasses.length === 0) {
    throw new Error('No hybrid classes found in salvageunion-reference')
  }

  return allHybridClasses
}

/**
 * Fetch and validate advanced classes from reference data
 * @throws Error if no advanced classes found
 * @returns Array of advanced classes
 */
export function getAdvancedClasses(): SURefAdvancedClass[] {
  const allAdvancedClasses = SalvageUnionReference.findAllIn('classes.advanced', () => true)

  if (allAdvancedClasses.length === 0) {
    throw new Error('No advanced classes found in salvageunion-reference')
  }

  return allAdvancedClasses
}

/**
 * Find a specific core class by name
 * @param className - Name of the class to find
 * @throws Error if class not found
 * @returns The core class object
 */
export function findCoreClass(className: string): SURefCoreClass {
  const foundClass = SalvageUnionReference.findIn('classes.core', (c) => c.name === className)

  if (!foundClass) {
    throw new Error(`${className} core class not found in salvageunion-reference`)
  }

  return foundClass
}

/**
 * Find a specific hybrid class by name
 * @param className - Name of the class to find
 * @throws Error if class not found
 * @returns The hybrid class object
 */
export function findHybridClass(className: string): SURefHybridClass {
  const foundClass = SalvageUnionReference.findIn('classes.hybrid', (c) => c.name === className)

  if (!foundClass) {
    throw new Error(`${className} hybrid class not found in salvageunion-reference`)
  }

  return foundClass
}

/**
 * Find a specific advanced class by name
 * @param className - Name of the class to find
 * @throws Error if class not found
 * @returns The advanced class object
 */
export function findAdvancedClass(className: string): SURefAdvancedClass {
  const foundClass = SalvageUnionReference.findIn('classes.advanced', (c) => c.name === className)

  if (!foundClass) {
    throw new Error(`${className} advanced class not found in salvageunion-reference`)
  }

  return foundClass
}

/**
 * Find a class by name across all class types
 * @param className - Name of the class to find
 * @throws Error if class not found
 * @returns The class object
 */
export function findClass(
  className: string
): SURefCoreClass | SURefAdvancedClass | SURefHybridClass {
  const foundClass =
    SalvageUnionReference.findIn('classes.core', (c) => c.name === className) ||
    SalvageUnionReference.findIn('classes.advanced', (c) => c.name === className) ||
    SalvageUnionReference.findIn('classes.hybrid', (c) => c.name === className)

  if (!foundClass) {
    throw new Error(`${className} class not found in salvageunion-reference`)
  }

  return foundClass
}

/**
 * Fetch and validate chassis from reference data
 * @throws Error if no chassis found
 * @returns Array of chassis
 */
export function getChassis(): SURefChassis[] {
  const allChassis = SalvageUnionReference.findAllIn('chassis', () => true)

  if (allChassis.length === 0) {
    throw new Error('No chassis found in salvageunion-reference')
  }

  return allChassis
}

/**
 * Get chassis with patterns for pattern tests
 * @returns Array of chassis that have patterns
 */
export function getChassisWithPatterns(): SURefChassis[] {
  return SalvageUnionReference.findAllIn('chassis', (c) => c.patterns && c.patterns.length > 0)
}

/**
 * Fetch and validate crawlers from reference data
 * @throws Error if no crawlers found
 * @returns Array of crawlers
 */
export function getCrawlers(): SURefCrawler[] {
  const allCrawlers = SalvageUnionReference.Crawlers.all()

  if (allCrawlers.length === 0) {
    throw new Error('No crawlers found in salvageunion-reference')
  }

  return allCrawlers
}

/**
 * Fetch and validate crawler bays from reference data
 * @throws Error if no crawler bays found
 * @returns Array of crawler bays
 */
export function getCrawlerBays(): SURefCrawlerBay[] {
  const allBays = SalvageUnionReference.CrawlerBays.all()

  if (allBays.length === 0) {
    throw new Error('No crawler bays found in salvageunion-reference')
  }

  return allBays
}

/**
 * Fetch and validate abilities from reference data
 * @throws Error if no abilities found
 * @returns Array of abilities
 */
export function getAbilities(): SURefAbility[] {
  const allAbilities = SalvageUnionReference.Abilities.all()

  if (allAbilities.length === 0) {
    throw new Error('No abilities found in salvageunion-reference')
  }

  return allAbilities
}

/**
 * Get abilities by level
 * @param abilitiesOrLevel - Either an array of abilities to filter or a level number
 * @param level - Optional level number when first param is abilities array
 * @returns Array of abilities at that level
 */
export function getAbilitiesByLevel(
  abilitiesOrLevel: SURefAbility[] | number,
  level?: number
): SURefAbility[] {
  // If first param is a number, get all abilities at that level
  if (typeof abilitiesOrLevel === 'number') {
    return SalvageUnionReference.Abilities.all().filter((a) => a.level === abilitiesOrLevel)
  }
  // If first param is an array and level is provided, filter that array
  if (level !== undefined) {
    return abilitiesOrLevel.filter((a) => a.level === level)
  }
  // Otherwise return empty array
  return []
}

/**
 * Fetch and validate equipment from reference data
 * @throws Error if no equipment found
 * @returns Array of equipment
 */
export function getEquipment(): SURefEquipment[] {
  const allEquipment = SalvageUnionReference.findAllIn('equipment', () => true)

  if (allEquipment.length === 0) {
    throw new Error('No equipment found in salvageunion-reference')
  }

  return allEquipment
}
