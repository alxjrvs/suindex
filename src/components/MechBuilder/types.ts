import type { System, Module } from 'salvageunion-reference'

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

export interface MechState {
  chassisId: string | null
  pattern: string
  quirk: string
  appearance: string
  chassisAbility: string
  systems: SelectedItem[]
  modules: SelectedItem[]
  cargo: CargoItem[]
  currentSP: number
  currentEP: number
  currentHeat: number
}
