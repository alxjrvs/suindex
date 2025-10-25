import { supabase } from '../supabase'
import type { Tables, TablesInsert } from '../../types/database'

export type PilotRow = Tables<'pilots'>

/**
 * Fetch a single pilot by ID
 */
export async function fetchPilot(pilotId: string): Promise<PilotRow> {
  const { data, error } = await supabase
    .from('pilots')
    .select('*')
    .eq('id', pilotId)
    .single()

  if (error) throw error
  if (!data) throw new Error('Pilot not found')
  return data as PilotRow
}

/**
 * Fetch all pilots for the current user
 */
export async function fetchUserPilots(userId: string): Promise<PilotRow[]> {
  const { data, error } = await supabase
    .from('pilots')
    .select('*')
    .eq('user_id', userId)
    .order('callsign')

  if (error) throw error
  return (data || []) as PilotRow[]
}

/**
 * Fetch all pilots for a crawler
 */
export async function fetchCrawlerPilots(crawlerId: string): Promise<PilotRow[]> {
  const { data, error } = await supabase
    .from('pilots')
    .select('*')
    .eq('crawler_id', crawlerId)
    .order('callsign')

  if (error) throw error
  return (data || []) as PilotRow[]
}

/**
 * Create a new pilot
 */
export async function createPilot(userId: string): Promise<PilotRow> {
  const pilotData: TablesInsert<'pilots'> = {
    callsign: 'Unknown Name',
    max_hp: 10,
    max_ap: 3,
    current_damage: 0,
    current_ap: 0,
    user_id: userId,
  }

  const { data, error } = await supabase
    .from('pilots')
    .insert(pilotData)
    .select()
    .single()

  if (error) throw error
  if (!data) throw new Error('Failed to create pilot')
  return data as PilotRow
}

/**
 * Update a pilot
 */
export async function updatePilot(
  pilotId: string,
  updates: Partial<PilotRow>
): Promise<void> {
  const { error } = await supabase
    .from('pilots')
    .update(updates)
    .eq('id', pilotId)

  if (error) throw error
}

