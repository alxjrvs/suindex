import type { Tables, CargoItem } from '../../types/database'

// Re-export the centralized types for convenience
export type { CargoItem }

export type MechLiveSheetState = Omit<Tables<'mechs'>, 'created_at' | 'updated_at'>
