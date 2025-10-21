import type { MergeDeep } from 'type-fest'
import type { Database as DatabaseGenerated } from './database-generated.types'

// Re-export the Json type
export type { Json } from './database-generated.types'

// ============================================================================
// Custom JSON Type Definitions
// ============================================================================

// Crawler Types - Custom data not from salvageunion-reference
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

export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row']

export type TablesInsert<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert']

export type TablesUpdate<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update']
