import type { Tables } from '../../types/database'
import type { CargoItem } from '../../types/common'

export type MechLiveSheetState = Omit<Tables<'mechs'>, 'created_at' | 'updated_at' | 'cargo'> & {
  cargo: CargoItem[] | null
}
