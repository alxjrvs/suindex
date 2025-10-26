import type { Tables } from '../types/database'
import type { User } from '@supabase/supabase-js'

/**
 * Mock factory functions for creating test data
 * These provide comprehensive, type-safe mock objects for testing
 */

// ============================================================================
// User Mocks
// ============================================================================

export function createMockUser(overrides?: Partial<User>): User {
  return {
    id: 'test-user-id',
    email: 'test@example.com',
    user_metadata: {
      full_name: 'Test User',
    },
    app_metadata: {},
    aud: 'authenticated',
    created_at: new Date().toISOString(),
    role: 'authenticated',
    updated_at: new Date().toISOString(),
    ...overrides,
  } as User
}

// ============================================================================
// Mech Mocks
// ============================================================================

export function createMockMech(overrides?: Partial<Tables<'mechs'>>): Tables<'mechs'> {
  return {
    id: 'mech-1',
    user_id: 'test-user-id',
    pattern: 'Test Mech',
    chassis_id: null,
    chassis_ability: null,
    current_damage: 0,
    current_heat: 0,
    current_ep: 0,
    appearance: null,
    quirk: null,
    notes: null,
    cargo: null,
    systems: null,
    modules: null,
    pilot_id: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...overrides,
  }
}

export function createMockMechs(count: number = 2): Tables<'mechs'>[] {
  return Array.from({ length: count }, (_, i) =>
    createMockMech({
      id: `mech-${i + 1}`,
      pattern: `Test Mech ${i + 1}`,
      current_damage: i * 2,
      current_heat: i,
      current_ep: i,
      created_at: new Date(Date.now() + i * 1000).toISOString(),
      updated_at: new Date(Date.now() + i * 1000).toISOString(),
    })
  )
}

// ============================================================================
// Pilot Mocks
// ============================================================================

export function createMockPilot(overrides?: Partial<Tables<'pilots'>>): Tables<'pilots'> {
  return {
    id: 'pilot-1',
    user_id: 'test-user-id',
    callsign: 'Test Pilot',
    class_id: null,
    advanced_class_id: null,
    legendary_ability_id: null,
    max_hp: 10,
    max_ap: 3,
    current_damage: 0,
    current_ap: 3,
    current_tp: null,
    abilities: null,
    equipment: null,
    appearance: null,
    background: null,
    background_used: null,
    keepsake: null,
    keepsake_used: null,
    motto: null,
    motto_used: null,
    notes: null,
    crawler_id: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...overrides,
  }
}

export function createMockPilots(count: number = 2): Tables<'pilots'>[] {
  return Array.from({ length: count }, (_, i) =>
    createMockPilot({
      id: `pilot-${i + 1}`,
      callsign: `Test Pilot ${i + 1}`,
      current_damage: i * 2,
      current_ap: 3 - i,
      created_at: new Date(Date.now() + i * 1000).toISOString(),
      updated_at: new Date(Date.now() + i * 1000).toISOString(),
    })
  )
}

// ============================================================================
// Crawler Mocks
// ============================================================================

export function createMockCrawler(overrides?: Partial<Tables<'crawlers'>>): Tables<'crawlers'> {
  return {
    id: 'crawler-1',
    user_id: 'test-user-id',
    name: 'Test Crawler',
    crawler_type_id: null,
    tech_level: 1,
    current_damage: 0,
    current_scrap: 0,
    description: null,
    notes: null,
    bays: null,
    cargo: null,
    npc: null,
    upgrade: null,
    game_id: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...overrides,
  }
}

export function createMockCrawlers(count: number = 2): Tables<'crawlers'>[] {
  return Array.from({ length: count }, (_, i) =>
    createMockCrawler({
      id: `crawler-${i + 1}`,
      name: `Test Crawler ${i + 1}`,
      tech_level: i + 1,
      current_damage: i * 5,
      current_scrap: i * 10,
      created_at: new Date(Date.now() + i * 1000).toISOString(),
      updated_at: new Date(Date.now() + i * 1000).toISOString(),
    })
  )
}

// ============================================================================
// Game Mocks
// ============================================================================

export function createMockGame(overrides?: Partial<Tables<'games'>>): Tables<'games'> {
  return {
    id: 'game-1',
    name: 'Test Game',
    description: 'A test game',
    created_by: 'test-user-id',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...overrides,
  }
}

export function createMockGames(count: number = 2): Tables<'games'>[] {
  return Array.from({ length: count }, (_, i) =>
    createMockGame({
      id: `game-${i + 1}`,
      name: `Test Game ${i + 1}`,
      description: `Test game ${i + 1} description`,
      created_at: new Date(Date.now() + i * 1000).toISOString(),
      updated_at: new Date(Date.now() + i * 1000).toISOString(),
    })
  )
}

// ============================================================================
// Cargo Item Mocks
// ============================================================================

export function createMockCargoItem(overrides?: {
  id?: string
  amount?: number
  description?: string
}) {
  return {
    id: 'cargo-1',
    amount: 1,
    description: 'Test Cargo Item',
    ...overrides,
  }
}

// ============================================================================
// Crawler NPC Mocks
// ============================================================================

export function createMockCrawlerNPC(overrides?: {
  name?: string
  notes?: string
  hitPoints?: number
  damage?: number
}) {
  return {
    name: 'Test NPC',
    notes: 'Test notes',
    hitPoints: 10,
    damage: 5,
    ...overrides,
  }
}

// ============================================================================
// Crawler Bay Mocks
// ============================================================================

export function createMockCrawlerBay(overrides?: {
  id?: string
  bayId?: string
  name?: string
  npc?: ReturnType<typeof createMockCrawlerNPC>
  damaged?: boolean
  description?: string
}) {
  return {
    id: 'bay-1',
    bayId: 'bay-id-1',
    name: 'Test Bay',
    npc: createMockCrawlerNPC(),
    damaged: false,
    description: 'Test bay description',
    ...overrides,
  }
}
