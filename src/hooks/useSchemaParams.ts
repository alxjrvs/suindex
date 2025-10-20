import { useParams } from 'react-router-dom'

export interface SchemaRouteParams {
  schemaId: string
  itemId?: string
}

export function useSchemaParams(): SchemaRouteParams {
  const params = useParams<{ schemaId: string; itemId?: string }>()
  return {
    schemaId: params.schemaId || '',
    itemId: params.itemId,
  }
}

export function useSchemaId(): string {
  const { schemaId } = useSchemaParams()
  return schemaId
}

export function useItemId(): string | undefined {
  const { itemId } = useSchemaParams()
  return itemId
}
