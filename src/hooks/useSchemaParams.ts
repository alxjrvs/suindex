import { useParams } from 'react-router-dom'

/**
 * Typed route parameters for schema routes
 */
export interface SchemaRouteParams {
  schemaId: string
  itemId?: string
}

/**
 * Custom hook for accessing typed schema route parameters
 * Provides type-safe access to schemaId and itemId from the URL
 * @returns Typed route parameters
 * @example
 * const { schemaId, itemId } = useSchemaParams();
 */
export function useSchemaParams(): SchemaRouteParams {
  const params = useParams<{ schemaId: string; itemId?: string }>()
  return {
    schemaId: params.schemaId || '',
    itemId: params.itemId,
  }
}

/**
 * Custom hook for accessing only the schema ID from route parameters
 * @returns The schema ID from the URL
 * @example
 * const schemaId = useSchemaId();
 */
export function useSchemaId(): string {
  const { schemaId } = useSchemaParams()
  return schemaId
}

/**
 * Custom hook for accessing only the item ID from route parameters
 * @returns The item ID from the URL, or undefined if not present
 * @example
 * const itemId = useItemId();
 */
export function useItemId(): string | undefined {
  const { itemId } = useSchemaParams()
  return itemId
}
