import type { Ability, Equipment } from 'salvageunion-reference'

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

export interface PilotState {
  classId: string | null
  advancedClassId: string | null
  callsign: string
  motto: string
  mottoUsed: boolean
  keepsake: string
  keepsakeUsed: boolean
  background: string
  backgroundUsed: boolean
  appearance: string
  abilities: PilotAbility[]
  equipment: PilotEquipment[]
  legendaryAbilityId: string | null
  maxHP: number
  currentHP: number
  maxAP: number
  currentAP: number
  currentTP: number
  notes: string
}
