import { vi } from 'vitest'

/**
 * Centralized mock setup for SalvageUnionReference
 * This eliminates duplicate mock setup across all test files
 */
export function setupSalvageUnionReferenceMock() {
  vi.mock('salvageunion-reference', () => ({
    SalvageUnionReference: {
      Classes: {
        all: vi.fn(),
      },
      Abilities: {
        all: vi.fn(),
      },
      Equipment: {
        all: vi.fn(),
      },
      AbilityTreeRequirements: {
        all: vi.fn(),
      },
      Crawlers: {
        all: vi.fn(),
      },
      CrawlerBays: {
        all: vi.fn(),
      },
      CrawlerTechLevels: {
        all: vi.fn(),
      },
      Chassis: {
        all: vi.fn(),
      },
      Systems: {
        all: vi.fn(),
      },
      Modules: {
        all: vi.fn(),
      },
    },
  }))
}

/**
 * Get mocked SalvageUnionReference for use in tests
 */
export function getMockedSalvageUnionReference() {
  const { SalvageUnionReference } = require('salvageunion-reference')
  return SalvageUnionReference
}

