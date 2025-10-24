import type { MergeDeep } from 'type-fest'
import type { Database as DatabaseGenerated } from './database-generated.types'

// ============================================================================
// Custom JSON Type Definitions
// ============================================================================

// Standardized NPC structure for crawlers
export interface CrawlerNPC {
  name: string
  notes: string
  hitPoints: number
  damage: number
}

// Crawler Types - Custom data not from salvageunion-reference
export interface CrawlerBay {
  id: string
  bayId: string
  name: string
  npc: CrawlerNPC
  description: string
}

export interface CargoItem {
  id: string
  amount: number
  description: string
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
            npc: CrawlerNPC | null
          }
          Insert: {
            bays?: CrawlerBay[] | null
            cargo?: CargoItem[] | null
            npc?: CrawlerNPC | null
          }
          Update: {
            bays?: CrawlerBay[] | null
            cargo?: CargoItem[] | null
            npc?: CrawlerNPC | null
          }
        }
        mechs: {
          Row: {
            cargo: CargoItem[] | null
          }
          Insert: {
            cargo?: CargoItem[] | null
          }
          Update: {
            cargo?: CargoItem[] | null
          }
        }
      }
    }
  }
>

// ============================================================================
// Helper Types
// ============================================================================

// Derive valid table names from the database schema
export type ValidTable = keyof Database['public']['Tables']

export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row']

export type TablesInsert<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert']
