import { SalvageUnionReference } from 'salvageunion-reference'
import type {
  SURefCoreClass,
  SURefAdvancedClass,
  SURefHybridClass,
  SURefChassis,
  SURefCrawler,
  SURefCrawlerTechLevel,
} from 'salvageunion-reference'

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
  // Try to find in each class type using findIn
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
