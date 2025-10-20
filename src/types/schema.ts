// Schema catalog types
export interface SchemaInfo {
  id: string
  title: string
  description: string
  dataFile: string
  schemaFile: string
  itemCount: number
  requiredFields: string[]
}

export interface SchemaIndex {
  $schema: string
  title: string
  description: string
  version: string
  generated: string
  schemas: SchemaInfo[]
}

// Generic data item type
export type DataItem = {
  id: string
  name?: string
  description?: string
} & Record<string, unknown>
