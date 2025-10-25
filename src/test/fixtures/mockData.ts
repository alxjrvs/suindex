import type {
  SURefClass,
  SURefAbility,
  SURefEquipment,
  SURefAbilityTreeRequirement,
  SURefCrawler,
  SURefCrawlerBay,
  SURefCrawlerTechLevel,
  SURefChassis,
  SURefSystem,
  SURefModule,
} from 'salvageunion-reference'

/**
 * Factory functions for creating mock data
 * These eliminate duplicate mock data definitions across test files
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
  }
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
  }
}

export function createMockEquipment(overrides?: Partial<SURefEquipment>): SURefEquipment {
  return {
    id: 'equipment-tool-1',
    name: 'Hacking Tool',
    source: 'core',
    page: 50,
    description: 'A tool for hacking',
    salvageValue: 100,
    ...overrides,
  }
}

export function createMockAbilityTreeRequirement(
  overrides?: Partial<SURefAbilityTreeRequirement>
): SURefAbilityTreeRequirement {
  return {
    id: 'req-1',
    abilityId: 'ability-hack-1',
    requiredAbilityId: 'ability-hack-2',
    ...overrides,
  }
}

export function createMockCrawler(overrides?: Partial<SURefCrawler>): SURefCrawler {
  return {
    id: 'crawler-1',
    name: 'Test Crawler',
    source: 'Test Source',
    page: 1,
    description: 'A test crawler',
    techLevel: 1,
    structurePoints: 20,
    salvageValue: 500,
    ...overrides,
  }
}

export function createMockCrawlerBay(overrides?: Partial<SURefCrawlerBay>): SURefCrawlerBay {
  return {
    id: 'bay-1',
    name: 'Crew Quarters',
    source: 'Test Source',
    page: 1,
    description: 'A crew quarters bay',
    ...overrides,
  }
}

export function createMockCrawlerTechLevel(
  overrides?: Partial<SURefCrawlerTechLevel>
): SURefCrawlerTechLevel {
  return {
    id: 'tech-level-1',
    name: 'Tech Level 1',
    techLevel: 1,
    structurePoints: 20,
    populationMin: 10,
    populationMax: 50,
    source: 'Test Source',
    page: 1,
    ...overrides,
  }
}

export function createMockChassis(overrides?: Partial<SURefChassis>): SURefChassis {
  return {
    id: 'chassis-1',
    name: 'Test Chassis',
    source: 'Test Source',
    page: 1,
    description: 'A test chassis',
    techLevel: 1,
    structurePoints: 10,
    salvageValue: 300,
    ...overrides,
  }
}

export function createMockSystem(overrides?: Partial<SURefSystem>): SURefSystem {
  return {
    id: 'system-1',
    name: 'Test System',
    source: 'Test Source',
    page: 1,
    description: 'A test system',
    techLevel: 1,
    salvageValue: 100,
    ...overrides,
  }
}

export function createMockModule(overrides?: Partial<SURefModule>): SURefModule {
  return {
    id: 'module-1',
    name: 'Test Module',
    source: 'Test Source',
    page: 1,
    description: 'A test module',
    slotsRequired: 1,
    techLevel: 1,
    salvageValue: 50,
    traits: [],
    recommended: false,
    actionType: 'Free',
    range: 'Self',
    actions: [],
    ...overrides,
  }
}

