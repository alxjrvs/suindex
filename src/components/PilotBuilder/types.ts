import type { TablesInsert } from '../../types/database'

export interface AdvancedClassOption {
  id: string
  name: string
  isAdvancedVersion: boolean
}

// Use database Insert type, omitting only fields managed by the database
// abilities and equipment are now string[] (IDs from salvageunion-reference)
export type PilotState = Omit<TablesInsert<'pilots'>, 'created_at' | 'updated_at'>
