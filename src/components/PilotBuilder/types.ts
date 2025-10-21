import type { Ability, Equipment } from 'salvageunion-reference'
import type { TablesInsert } from '../../types/database'

export interface PilotAbility {
  id: string
  ability: Ability
}

export interface PilotEquipment {
  id: string
  equipment: Equipment
}

export interface AdvancedClassOption {
  id: string
  name: string
  isAdvancedVersion: boolean
}

// Use database Insert type, omitting fields managed by the database and fields we'll override
export type PilotState = Omit<
  TablesInsert<'pilots'>,
  'id' | 'user_id' | 'crawler_id' | 'created_at' | 'updated_at' | 'abilities' | 'equipment'
> & {
  // Override abilities and equipment to use typed arrays instead of Json
  abilities: PilotAbility[]
  equipment: PilotEquipment[]
}
