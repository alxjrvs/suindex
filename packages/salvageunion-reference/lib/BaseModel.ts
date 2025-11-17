/**
 * Type for models with metadata properties
 */
export type ModelWithMetadata<T> = BaseModel<T> & {
  readonly schemaName: string
  readonly displayName: string
}

/**
 * Simplified Base Model class for querying JSON data with type safety
 * Provides only the essential query methods
 */
export class BaseModel<T> {
  protected data: T[]
  protected schema: Record<string, unknown>
  protected _schemaName: string
  protected _displayName: string

  constructor(
    data: T[],
    schema: Record<string, unknown>,
    schemaName: string,
    displayName: string
  ) {
    this.data = data
    this.schema = schema
    this._schemaName = schemaName
    this._displayName = displayName
  }

  /**
   * Get all items
   */
  all(): T[] {
    return this.data
  }

  /**
   * Find a single item by predicate (same interface as Array.find)
   */
  find(predicate: (item: T) => boolean): T | undefined {
    return this.data.find(predicate)
  }

  /**
   * Find all items matching predicate (same interface as Array.filter)
   */
  findAll(predicate: (item: T) => boolean): T[] {
    return this.data.filter(predicate)
  }
}
