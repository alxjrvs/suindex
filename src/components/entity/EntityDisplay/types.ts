import type { SURefMetaEntity, SURefMetaSchemaName } from 'salvageunion-reference'

export interface EntityDisplaySubProps {
  data: SURefMetaEntity
  schemaName: SURefMetaSchemaName
  compact: boolean
}
