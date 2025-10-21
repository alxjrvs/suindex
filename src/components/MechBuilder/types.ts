import type { TablesInsert, CargoItem } from '../../types/database'

// Re-export the centralized types for convenience
export type { CargoItem }

// Use database Insert type, omitting only fields managed by the database
// systems and modules are now string[] (IDs from salvageunion-reference)
// cargo remains CargoItem[] (custom data)
export type MechState = Omit<TablesInsert<'mechs'>, 'created_at' | 'updated_at'>
