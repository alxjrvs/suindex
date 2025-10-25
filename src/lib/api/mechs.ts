import { supabase } from '../supabase'
import type { Tables, TablesInsert } from '../../types/database'

export type MechRow = Tables<'mechs'>

/**
 * Fetch a single mech by ID
 */
export async function fetchMech(mechId: string): Promise<MechRow> {
  const { data, error } = await supabase
    .from('mechs')
    .select('*')
    .eq('id', mechId)
    .single()

  if (error) throw error
  if (!data) throw new Error('Mech not found')
  return data as MechRow
}

/**
 * Fetch all mechs for the current user
 */
export async function fetchUserMechs(userId: string): Promise<MechRow[]> {
  const { data, error } = await supabase
    .from('mechs')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data || []) as MechRow[]
}

/**
 * Fetch mech for a specific pilot
 */
export async function fetchPilotMech(pilotId: string): Promise<MechRow | null> {
  const { data, error } = await supabase
    .from('mechs')
    .select('*')
    .eq('pilot_id', pilotId)
    .maybeSingle()

  if (error) throw error
  return (data || null) as MechRow | null
}

/**
 * Fetch mechs for multiple pilots
 */
export async function fetchPilotsMechs(pilotIds: string[]): Promise<MechRow[]> {
  if (pilotIds.length === 0) return []

  const { data, error } = await supabase
    .from('mechs')
    .select('*')
    .in('pilot_id', pilotIds)

  if (error) throw error
  return (data || []) as MechRow[]
}

/**
 * Create a new mech
 */
export async function createMech(userId: string): Promise<MechRow> {
  const mechData: TablesInsert<'mechs'> = {
    pattern: 'New Mech',
    current_damage: 0,
    current_heat: 0,
    current_ep: 0,
    user_id: userId,
  }

  const { data, error } = await supabase
    .from('mechs')
    .insert(mechData)
    .select()
    .single()

  if (error) throw error
  if (!data) throw new Error('Failed to create mech')
  return data as MechRow
}

/**
 * Update a mech
 */
export async function updateMech(
  mechId: string,
  updates: Partial<MechRow>
): Promise<void> {
  const { error } = await supabase
    .from('mechs')
    .update(updates)
    .eq('id', mechId)

  if (error) throw error
}

