import type { Ability, Equipment } from 'salvageunion-reference'

export interface CharacterAbility {
  id: string
  ability: Ability
}

export interface CharacterEquipment {
  id: string
  equipment: Equipment
}

export interface AdvancedClassOption {
  id: string
  name: string
  isAdvancedVersion: boolean
}

export interface CharacterState {
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
  abilities: CharacterAbility[]
  equipment: CharacterEquipment[]
  legendaryAbilityId: string | null
  maxHP: number
  currentHP: number
  maxAP: number
  currentAP: number
  currentTP: number
  notes: string
}
