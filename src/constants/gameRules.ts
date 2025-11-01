/**
 * Game Rules Constants
 *
 * Centralized constants for Salvage Union game rules and mechanics.
 * These values should be used throughout the application instead of hardcoded magic numbers.
 */

/**
 * Tech Level Constants
 */
export const TECH_LEVELS = [1, 2, 3, 4, 5, 6] as const
export const MIN_TECH_LEVEL = 1
export const MAX_TECH_LEVEL = 6

export type TechLevel = (typeof TECH_LEVELS)[number]

/**
 * Cargo Grid Configuration
 * Defines grid dimensions based on maximum capacity
 */
export const CARGO_GRID_CONFIGS = {
  /** Up to 6 slots: 3x2 grid */
  small: { maxCapacity: 6, cols: 3, rows: 2 },
  /** Up to 16 slots: 4x4 grid */
  medium: { maxCapacity: 16, cols: 4, rows: 4 },
  /** Up to 30 slots: 5x6 grid */
  large: { maxCapacity: 30, cols: 5, rows: 6 },
  /** Up to 36 slots: 6x6 grid */
  xlarge: { maxCapacity: 36, cols: 6, rows: 6 },
} as const

/**
 * Get grid configuration for a given capacity
 */
export function getCargoGridConfig(maxCapacity: number): {
  cols: number
  rows: number
} {
  if (maxCapacity <= CARGO_GRID_CONFIGS.small.maxCapacity) {
    return { cols: CARGO_GRID_CONFIGS.small.cols, rows: CARGO_GRID_CONFIGS.small.rows }
  }
  if (maxCapacity <= CARGO_GRID_CONFIGS.medium.maxCapacity) {
    return { cols: CARGO_GRID_CONFIGS.medium.cols, rows: CARGO_GRID_CONFIGS.medium.rows }
  }
  if (maxCapacity <= CARGO_GRID_CONFIGS.large.maxCapacity) {
    return { cols: CARGO_GRID_CONFIGS.large.cols, rows: CARGO_GRID_CONFIGS.large.rows }
  }
  return { cols: CARGO_GRID_CONFIGS.xlarge.cols, rows: CARGO_GRID_CONFIGS.xlarge.rows }
}

/**
 * Pilot Default Values
 */
export const PILOT_DEFAULTS = {
  maxHP: 10,
  maxAP: 5,
  startingTP: 0,
} as const

/**
 * Crawler Default Values
 */
export const CRAWLER_DEFAULTS = {
  initialTechLevel: 1,
  baseStructurePoints: 20,
  baseUpgrade: 0,
} as const

/**
 * Mech Default Values
 */
export const MECH_DEFAULTS = {
  startingDamage: 0,
  startingHeat: 0,
} as const

/**
 * Debounce Timings (in milliseconds)
 */
export const DEBOUNCE_TIMINGS = {
  /** Auto-save delay for live sheet updates */
  autoSave: 1000,
  /** Search input delay */
  search: 300,
  /** Filter input delay */
  filter: 300,
} as const

/**
 * Modal Sizes
 */
export const MODAL_SIZES = {
  sm: '400px',
  md: '600px',
  lg: '800px',
  xl: '1200px',
  full: '90vw',
} as const

/**
 * Activation Cost Types
 */
export const ACTIVATION_CURRENCIES = {
  actionPoints: 'AP',
  energyPoints: 'EP',
  variable: 'XP',
} as const

/**
 * Scrap Conversion Rates
 * Each tech level is worth this many TL1 scrap
 */
export const SCRAP_CONVERSION_RATES: Record<TechLevel, number> = {
  1: 1,
  2: 2,
  3: 3,
  4: 4,
  5: 5,
  6: 6,
} as const

/**
 * Legendary Ability Cost
 */
export const LEGENDARY_ABILITY_COST = 3

/**
 * Advanced/Hybrid Tree Ability Cost
 */
export const ADVANCED_ABILITY_COST = 2

/**
 * Core Tree Ability Cost
 */
export const CORE_ABILITY_COST = 1

/**
 * Default Ability Cost (fallback)
 */
export const DEFAULT_ABILITY_COST = 1

export const UPKEEP_STEP = 5

export const MAX_UPGRADE = 25
