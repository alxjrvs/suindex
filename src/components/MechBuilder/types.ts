import type { System, Module } from 'salvageunion-reference'
import type { TablesInsert } from '../../types/database'

export interface SelectedItem {
  id: string
  name: string
  slotsRequired: number
  type: 'system' | 'module'
  data: System | Module
}

export interface CargoItem {
  id: string
  amount: number
  description: string
}

// Use database Insert type, omitting fields managed by the database and fields we'll override
export type MechState = Omit<
  TablesInsert<'mechs'>,
  | 'id'
  | 'user_id'
  | 'crawler_id'
  | 'pilot_id'
  | 'created_at'
  | 'updated_at'
  | 'systems'
  | 'modules'
  | 'cargo'
> & {
  // Override systems, modules, and cargo to use typed arrays instead of Json
  systems: SelectedItem[]
  modules: SelectedItem[]
  cargo: CargoItem[]
}
