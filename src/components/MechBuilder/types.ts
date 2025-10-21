import type { TablesInsert, SelectedItem, CargoItem } from '../../types/database'

// Re-export the centralized types for convenience
export type { SelectedItem, CargoItem }

// Use database Insert type, omitting only fields managed by the database
// The JSON fields (systems, modules, cargo) are already properly typed in the centralized database types
export type MechState = Omit<
  TablesInsert<'mechs'>,
  'id' | 'user_id' | 'crawler_id' | 'pilot_id' | 'created_at' | 'updated_at'
>
