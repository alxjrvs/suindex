import type { MergeDeep } from 'type-fest'
import type { System, Module, Ability, Equipment } from 'salvageunion-reference'
import type { Database as DatabaseGenerated } from './database-generated.types'

// Re-export the Json type
export type { Json } from './database-generated.types'

// ============================================================================
// Custom JSON Type Definitions
// ============================================================================

// Crawler Types
export interface CrawlerBay {
  id: string
  bayId: string
  name: string
  operator: string
  operatorPosition: string
  description: string
}

export interface CargoItem {
  id: string
  amount: number
  description: string
}

// Mech Types
export interface SelectedItem {
  id: string
  name: string
  slotsRequired: number
  type: 'system' | 'module'
  data: System | Module
}

// Pilot Types
export interface PilotAbility {
  id: string
  ability: Ability
}

export interface PilotEquipment {
  id: string
  equipment: Equipment
}

// ============================================================================
// Database Type Overrides
// ============================================================================

export type Database = MergeDeep<
  DatabaseGenerated,
  {
    public: {
      Tables: {
        crawlers: {
          Row: {
            bays: CrawlerBay[] | null
            cargo: CargoItem[] | null
          }
          Insert: {
            bays?: CrawlerBay[] | null
            cargo?: CargoItem[] | null
          }
          Update: {
            bays?: CrawlerBay[] | null
            cargo?: CargoItem[] | null
          }
        }
        mechs: {
          Row: {
            systems: SelectedItem[] | null
            modules: SelectedItem[] | null
            cargo: CargoItem[] | null
          }
          Insert: {
            systems?: SelectedItem[] | null
            modules?: SelectedItem[] | null
            cargo?: CargoItem[] | null
          }
          Update: {
            systems?: SelectedItem[] | null
            modules?: SelectedItem[] | null
            cargo?: CargoItem[] | null
          }
        }
        pilots: {
          Row: {
            abilities: PilotAbility[] | null
            equipment: PilotEquipment[] | null
          }
          Insert: {
            abilities?: PilotAbility[] | null
            equipment?: PilotEquipment[] | null
          }
          Update: {
            abilities?: PilotAbility[] | null
            equipment?: PilotEquipment[] | null
          }
        }
      }
    }
  }
>

// ============================================================================
// Helper Types
// ============================================================================

export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row']

export type TablesInsert<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert']

export type TablesUpdate<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update']
