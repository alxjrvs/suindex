/**
 * Test Helper: Reference Data
 *
 * Re-exports reference data helper functions from the production utilities.
 * This file exists to maintain backward compatibility with existing tests.
 *
 * All functions are now centralized in src/utils/referenceDataHelpers.ts
 */

export {
  // Class helpers
  getCoreClasses,
  getHybridClasses,
  getAdvancedClasses,
  getAllClasses,
  findCoreClass,
  findHybridClass,
  findAdvancedClass,
  findClass,
  findClassById,
  getClassNameById,
  // Chassis helpers
  getChassis,
  getChassisWithPatterns,
  findChassisById,
  getChassisNameById,
  // Crawler helpers
  getCrawlers,
  getCrawlerBays,
  findCrawlerById,
  getCrawlerNameById,
  findCrawlerTechLevel,
  getStructurePointsForTechLevel,
  // Ability helpers
  getAbilities,
  getAbilitiesForClass,
  getAbilitiesByLevel,
  // Equipment helpers
  getEquipment,
} from '../../utils/referenceDataHelpers'
