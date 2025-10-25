import type { SURefClass, SURefAbility, SURefEquipment } from 'salvageunion-reference'

/**
 * Factory functions for creating mock data
 * These eliminate duplicate mock data definitions across test files
 *
 * Note: Only the most commonly used types are included here.
 * For other types (Crawler, CrawlerBay, CrawlerTechLevel, Chassis, System, Module),
 * define mock data directly in test files as their types are complex and vary significantly.
 */

export function createMockClass(overrides?: Partial<SURefClass>): SURefClass {
  return {
    id: 'class-hacker',
    name: 'Hacker',
    type: 'core',
    source: 'core',
    page: 10,
    description: 'A tech specialist',
    coreAbilities: ['Hacking', 'Tech'],
    hybridClasses: [],
    advancedAbilities: 'Advanced Hacking',
    legendaryAbilities: ['Ultimate Hack'],
    ...overrides,
  } as SURefClass
}

export function createMockAbility(overrides?: Partial<SURefAbility>): SURefAbility {
  return {
    id: 'ability-hack-1',
    name: 'Basic Hack',
    tree: 'Hacking',
    level: 1,
    source: 'core',
    page: 30,
    description: 'A basic hacking ability',
    effect: 'Hack things',
    actionType: 'Turn',
    activationCost: 1,
    ...overrides,
  } as SURefAbility
}

export function createMockEquipment(overrides?: Partial<SURefEquipment>): SURefEquipment {
  return {
    id: 'equipment-tool-1',
    name: 'Hacking Tool',
    source: 'core',
    page: 50,
    description: 'A tool for hacking',
    ...overrides,
  } as SURefEquipment
}
