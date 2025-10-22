import type { Tables } from '../../types/database'

export interface AdvancedClassOption {
  id: string
  name: string
  isAdvancedVersion: boolean
}

export type PilotLiveSheetState = Omit<Tables<'pilots'>, 'created_at' | 'updated_at'>
