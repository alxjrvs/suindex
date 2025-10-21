import type { TablesInsert, PilotAbility, PilotEquipment } from '../../types/database'

// Re-export the centralized types for convenience
export type { PilotAbility, PilotEquipment }

export interface AdvancedClassOption {
  id: string
  name: string
  isAdvancedVersion: boolean
}

// Use database Insert type, omitting only fields managed by the database
// The JSON fields (abilities, equipment) are already properly typed in the centralized database types
export type PilotState = Omit<
  TablesInsert<'pilots'>,
  'id' | 'user_id' | 'crawler_id' | 'created_at' | 'updated_at'
>
