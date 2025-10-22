export interface SchemaInfo {
  id: string
  title: string
  description: string
  dataFile: string
  schemaFile: string
  itemCount: number
  requiredFields: string[]
}

export type DataItem = {
  id: string
  name?: string
  description?: string
} & Record<string, unknown>
