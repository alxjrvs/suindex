import type { SURefEntity } from 'salvageunion-reference'

export interface SchemaInfo {
  id: string
  title: string
  description: string
  dataFile: string
  schemaFile: string
  itemCount: number
  requiredFields: string[]
}

export type DataItem = SURefEntity & Record<string, unknown>
