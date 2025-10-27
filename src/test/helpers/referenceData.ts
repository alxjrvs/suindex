import { SalvageUnionReference } from 'salvageunion-reference'
import type {
  SURefAbility,
  SURefCoreClass,
  SURefAdvancedClass,
  SURefHybridClass,
  SURefChassis,
  SURefCrawler,
  SURefCrawlerBay,
  SURefEquipment,
} from 'salvageunion-reference'

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
 * Find a specific class by name (legacy function for backward compatibility)
 * @param className - Name of the class to find
 * @param classType - Type of class: 'core', 'hybrid', or 'advanced'
 * @throws Error if class not found
 * @returns The class object
 */
export function findClass(
  className: string,
  classType: 'core' | 'hybrid' | 'advanced' = 'core'
): SURefCoreClass | SURefHybridClass | SURefAdvancedClass {
  switch (classType) {
    case 'hybrid':
      return findHybridClass(className)
    case 'advanced':
      return findAdvancedClass(className)
    default:
      return findCoreClass(className)
  }
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
  const allCrawlers = SalvageUnionReference.findAllIn('crawlers', () => true)

  if (allCrawlers.length === 0) {
    throw new Error('No crawlers found in salvageunion-reference')
  }

  return allCrawlers
}

/**
 * Fetch and validate crawler bays from reference data
 * @throws Error if no bays found
 * @returns Array of crawler bays
 */
export function getCrawlerBays(): SURefCrawlerBay[] {
  const allBays = SalvageUnionReference.findAllIn('crawler-bays', () => true)

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
  const allAbilities = SalvageUnionReference.findAllIn('abilities', () => true)

  if (allAbilities.length === 0) {
    throw new Error('No abilities found in salvageunion-reference')
  }

  return allAbilities
}

/**
 * Get abilities for a specific class
 * @param classObj - The class object with coreTrees property
 * @returns Array of abilities from the class's core trees
 */
export function getAbilitiesForClass(classObj: { coreTrees: string[] }): SURefAbility[] {
  return SalvageUnionReference.findAllIn('abilities', (a) => classObj.coreTrees.includes(a.tree))
}

/**
 * Get abilities filtered by level
 * @param abilities - Array of abilities to filter
 * @param level - The ability level to filter by
 * @returns Array of abilities at the specified level
 */
export function getAbilitiesByLevel(abilities: SURefAbility[], level: number): SURefAbility[] {
  return abilities.filter((a) => a.level === level)
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

/**
 * Get all classes (Core, Advanced, and Hybrid) combined
 * @returns Array of all classes
 */
export function getAllClasses(): (SURefCoreClass | SURefAdvancedClass | SURefHybridClass)[] {
  return [
    ...SalvageUnionReference.findAllIn('classes.core', () => true),
    ...SalvageUnionReference.findAllIn('classes.advanced', () => true),
    ...SalvageUnionReference.findAllIn('classes.hybrid', () => true),
  ]
}

/**
 * Find a class by ID across all class types
 * @param classId - The ID of the class to find
 * @returns The class object or undefined if not found
 */
export function findClassById(
  classId: string
): SURefCoreClass | SURefAdvancedClass | SURefHybridClass | undefined {
  return (
    SalvageUnionReference.findIn('classes.core', (c) => c.id === classId) ||
    SalvageUnionReference.findIn('classes.advanced', (c) => c.id === classId) ||
    SalvageUnionReference.findIn('classes.hybrid', (c) => c.id === classId)
  )
}

/**
 * Get class name by ID with fallback
 * @param classId - The ID of the class to find
 * @param fallback - Fallback string if class not found (default: 'Unknown')
 * @returns The class name or fallback
 */
export function getClassNameById(classId: string | null, fallback = 'Unknown'): string {
  if (!classId) return fallback
  return findClassById(classId)?.name ?? fallback
}
