import type { Tables } from '../../types/database'

export type MechLiveSheetState = Omit<Tables<'mechs'>, 'created_at' | 'updated_at'>
