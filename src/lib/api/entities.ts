import { supabase } from '../supabase'
import type { ValidTable } from '../../types/database'

/**
 * Fetch a single entity by ID from any table
 */
export async function fetchEntity<T>(table: ValidTable, id: string): Promise<T> {
  const { data, error } = await supabase.from(table).select('*').eq('id', id).single()

  if (error) throw error
  if (!data) throw new Error(`${table} not found`)
  return data as T
}

/**
 * Fetch all entities for a user from any table
 */
export async function fetchUserEntities<T extends { id: string }>(
  table: ValidTable,
  userId: string,
  options?: {
    orderBy?: string
    orderAscending?: boolean
    filterField?: string
    filterValue?: string
  }
): Promise<T[]> {
  let query = supabase.from(table).select('*').eq('user_id', userId)

  if (options?.filterField && options?.filterValue) {
    query = query.eq(options.filterField, options.filterValue)
  }

  if (options?.orderBy) {
    query = query.order(options.orderBy, {
      ascending: options.orderAscending ?? false,
    })
  }

  const { data, error } = await query

  if (error) throw error
  return (data || []) as T[]
}

/**
 * Update an entity in any table
 */
export async function updateEntity<T>(
  table: ValidTable,
  id: string,
  updates: Partial<T>
): Promise<void> {
  const { error } = await supabase.from(table).update(updates).eq('id', id)

  if (error) throw error
}

/**
 * Create an entity in any table
 */
export async function createEntity<T>(table: ValidTable, data: T): Promise<T> {
  const { data: result, error } = await supabase
    .from(table)
    .insert(data as never)
    .select()
    .single()

  if (error) throw error
  if (!result) throw new Error(`Failed to create ${table}`)
  return result as T
}

/**
 * Delete an entity from any table
 */
export async function deleteEntity(table: ValidTable, id: string): Promise<void> {
  const { error } = await supabase.from(table).delete().eq('id', id)

  if (error) throw error
}
