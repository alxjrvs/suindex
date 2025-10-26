import type { Database } from './database'

export interface DataValue {
  value: string | number
  cost?: boolean
  type?: string
}

export interface CargoItem {
  id: string
  amount: number
  description: string
  color: string
}

export interface CrawlerNPC {
  name: string
  notes: string
  hitPoints: number
  damage: number
}

export type ValidTable = keyof Database['public']['Tables']
