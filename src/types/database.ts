// Database types based on Supabase schema

export interface Database {
  public: {
    Tables: {
      crawlers: {
        Row: Crawler
        Insert: CrawlerInsert
        Update: CrawlerUpdate
      }
      pilots: {
        Row: Pilot
        Insert: PilotInsert
        Update: PilotUpdate
      }
      mechs: {
        Row: Mech
        Insert: MechInsert
        Update: MechUpdate
      }
    }
  }
}

// Crawler types
export interface Crawler {
  id: string
  user_id: string
  name: string
  crawler_type_id: string | null
  description: string | null
  current_sp: number
  tech_level: number
  upgrade: number
  current_scrap: number
  bays: CrawlerBay[]
  storage_bay_operator: string | null
  storage_bay_description: string | null
  cargo: CargoItem[]
  notes: string | null
  created_at: string
  updated_at: string
}

export interface CrawlerBay {
  id: string
  bayId: string
  name: string
  operator: string
  operatorPosition: string
  description: string
}

export interface CargoItem {
  id: string
  amount: number
  description: string
}

export type CrawlerInsert = Omit<Crawler, 'id' | 'created_at' | 'updated_at'>
export type CrawlerUpdate = Partial<CrawlerInsert>

// Pilot types
export interface Pilot {
  id: string
  user_id: string
  crawler_id: string | null
  class_id: string | null
  advanced_class_id: string | null
  callsign: string
  motto: string | null
  motto_used: boolean
  keepsake: string | null
  keepsake_used: boolean
  background: string | null
  background_used: boolean
  appearance: string | null
  legendary_ability_id: string | null
  abilities: PilotAbility[]
  equipment: PilotEquipment[]
  max_hp: number
  current_hp: number
  max_ap: number
  current_ap: number
  current_tp: number
  notes: string | null
  created_at: string
  updated_at: string
}

export interface PilotAbility {
  id: string
  ability: unknown // Reference to Ability from salvageunion-reference
}

export interface PilotEquipment {
  id: string
  equipment: unknown // Reference to Equipment from salvageunion-reference
}

export type PilotInsert = Omit<Pilot, 'id' | 'created_at' | 'updated_at'>
export type PilotUpdate = Partial<PilotInsert>

// Mech types
export interface Mech {
  id: string
  user_id: string
  pilot_id: string | null
  crawler_id: string | null
  chassis_id: string | null
  pattern: string | null
  quirk: string | null
  appearance: string | null
  chassis_ability: string | null
  systems: MechSystem[]
  modules: MechModule[]
  cargo: CargoItem[]
  current_sp: number
  current_ep: number
  current_heat: number
  notes: string | null
  created_at: string
  updated_at: string
}

export interface MechSystem {
  id: string
  name: string
  slotsRequired: number
  type: 'system'
  data: unknown // Reference to System from salvageunion-reference
}

export interface MechModule {
  id: string
  name: string
  slotsRequired: number
  type: 'module'
  data: unknown // Reference to Module from salvageunion-reference
}

export type MechInsert = Omit<Mech, 'id' | 'created_at' | 'updated_at'>
export type MechUpdate = Partial<MechInsert>

