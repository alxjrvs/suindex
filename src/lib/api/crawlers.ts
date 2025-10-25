import { supabase } from '../supabase'
import type { Tables, TablesInsert } from '../../types/database'

export type CrawlerRow = Tables<'crawlers'>

/**
 * Fetch a single crawler by ID
 */
export async function fetchCrawler(crawlerId: string): Promise<CrawlerRow> {
  const { data, error } = await supabase.from('crawlers').select('*').eq('id', crawlerId).single()

  if (error) throw error
  if (!data) throw new Error('Crawler not found')
  return data as CrawlerRow
}

/**
 * Fetch all crawlers for the current user
 */
export async function fetchUserCrawlers(userId: string): Promise<CrawlerRow[]> {
  const { data, error } = await supabase
    .from('crawlers')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data || []) as CrawlerRow[]
}

/**
 * Fetch crawler for a specific game
 */
export async function fetchGameCrawler(gameId: string): Promise<CrawlerRow | null> {
  const { data, error } = await supabase
    .from('crawlers')
    .select('*')
    .eq('game_id', gameId)
    .maybeSingle()

  if (error) throw error
  return (data || null) as CrawlerRow | null
}

/**
 * Create a new crawler
 */
export async function createCrawler(userId: string): Promise<CrawlerRow> {
  const crawlerData: TablesInsert<'crawlers'> = {
    name: 'Unknown Name',
    current_damage: 0,
    current_scrap: 0,
    user_id: userId,
  }

  const { data, error } = await supabase.from('crawlers').insert(crawlerData).select().single()

  if (error) throw error
  if (!data) throw new Error('Failed to create crawler')
  return data as CrawlerRow
}

/**
 * Update a crawler
 */
export async function updateCrawler(
  crawlerId: string,
  updates: Partial<CrawlerRow>
): Promise<void> {
  const { error } = await supabase.from('crawlers').update(updates).eq('id', crawlerId)

  if (error) throw error
}
